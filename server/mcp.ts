import { Express, Request, Response } from "express";
import { db } from "./db";
import { 
  leads, 
  enrollments, 
  callRecords, 
  payments, 
  agentMetrics,
  webhookLogs 
} from "@shared/schema";
import { eq, gte, lte, count, avg, sum, and, desc } from "drizzle-orm";

// MCP endpoint for ElevenLabs voice agents to query database analytics
export function registerMCPEndpoint(app: Express) {
  // Handle CORS preflight
  app.options("/api/mcp", (req: Request, res: Response) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
  });

  app.post("/api/mcp", async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const SECRET = process.env.MCP_SECRET_TOKEN || "recruiting-mcp-secret-2024";
    
    // More flexible auth check
    const token = authHeader?.replace('Bearer ', '');
    if (!token || token !== SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Handle different request formats from ElevenLabs
    const { query, method, params } = req.body;
    const queryText = query || method || params?.query || "unknown";
    
    try {
      let result = "Unknown query";

      // Set proper headers for ElevenLabs
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (queryText === "enrollments_today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [enrollmentCount] = await db
          .select({ count: count() })
          .from(enrollments)
          .where(and(
            gte(enrollments.createdAt, today),
            lte(enrollments.createdAt, tomorrow)
          ));

        result = `${enrollmentCount.count} new enrollments today`;

      } else if (queryText === "leads_today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [leadCount] = await db
          .select({ count: count() })
          .from(leads)
          .where(and(
            gte(leads.createdAt, today),
            lte(leads.createdAt, tomorrow)
          ));

        result = `${leadCount.count} new leads captured today`;

      } else if (queryText === "qualified_leads") {
        const [qualifiedCount] = await db
          .select({ count: count() })
          .from(leads)
          .where(eq(leads.status, "qualified"));

        result = `${qualifiedCount.count} qualified leads ready for enrollment`;

      } else if (queryText === "enrollment_breakdown") {
        const enrollmentStats = await db
          .select({
            course: enrollments.course,
            count: count()
          })
          .from(enrollments)
          .groupBy(enrollments.course);

        const breakdown = enrollmentStats
          .map(stat => `${stat.course}: ${stat.count}`)
          .join(", ");
        
        result = `Enrollment breakdown: ${breakdown || "No enrollments yet"}`;

      } else if (queryText === "revenue_today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [revenueSum] = await db
          .select({ total: sum(payments.amount) })
          .from(payments)
          .where(and(
            eq(payments.status, "completed"),
            gte(payments.createdAt, today),
            lte(payments.createdAt, tomorrow)
          ));

        const revenue = revenueSum.total || 0;
        result = `$${revenue} in completed payments today`;

      } else if (queryText === "agent_performance") {
        const [avgConfidence] = await db
          .select({ avg: avg(agentMetrics.confidence) })
          .from(agentMetrics)
          .where(gte(agentMetrics.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)));

        const confidence = avgConfidence.avg ? Number(avgConfidence.avg).toFixed(2) : "0";
        result = `Average agent confidence score: ${confidence}% over last 24 hours`;

      } else if (queryText === "call_summary") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const [callStats] = await db
          .select({ 
            total: count(),
            interested: count(callRecords.intent)
          })
          .from(callRecords)
          .where(gte(callRecords.createdAt, today));

        const interestedCalls = await db
          .select({ count: count() })
          .from(callRecords)
          .where(and(
            eq(callRecords.intent, "interested"),
            gte(callRecords.createdAt, today)
          ));

        result = `${callStats.total} calls today, ${interestedCalls[0].count} showed interest`;

      } else if (queryText === "license_types") {
        const licenseStats = await db
          .select({
            license: leads.licenseGoal,
            count: count()
          })
          .from(leads)
          .groupBy(leads.licenseGoal);

        const breakdown = licenseStats
          .map(stat => `${stat.license}: ${stat.count}`)
          .join(", ");
        
        result = `License interest breakdown: ${breakdown || "No leads yet"}`;

      } else if (queryText.startsWith("lead:")) {
        const leadId = parseInt(queryText.split(":")[1]);
        
        if (isNaN(leadId)) {
          result = "Invalid lead ID format";
        } else {
          const lead = await db
            .select()
            .from(leads)
            .where(eq(leads.id, leadId))
            .limit(1);

          if (lead.length > 0) {
            const leadData = lead[0];
            result = `Lead ${leadData.firstName} ${leadData.lastName}, Status: ${leadData.status}, License Goal: ${leadData.licenseGoal}, Source: ${leadData.source}`;
          } else {
            result = "Lead not found";
          }
        }

      } else if (queryText === "recent_activity") {
        const recentLeads = await db
          .select({
            firstName: leads.firstName,
            lastName: leads.lastName,
            status: leads.status,
            createdAt: leads.createdAt
          })
          .from(leads)
          .orderBy(desc(leads.createdAt))
          .limit(5);

        if (recentLeads.length > 0) {
          const activity = recentLeads
            .map(lead => `${lead.firstName} ${lead.lastName} (${lead.status})`)
            .join(", ");
          result = `Recent leads: ${activity}`;
        } else {
          result = "No recent activity";
        }

      } else if (queryText === "conversion_rate") {
        const [totalLeads] = await db
          .select({ count: count() })
          .from(leads);

        const [enrolledLeads] = await db
          .select({ count: count() })
          .from(leads)
          .where(eq(leads.status, "enrolled"));

        const rate = totalLeads.count > 0 
          ? ((enrolledLeads.count / totalLeads.count) * 100).toFixed(1)
          : "0";
        
        result = `Conversion rate: ${rate}% (${enrolledLeads.count}/${totalLeads.count})`;
      }

      // Send JSON response for ElevenLabs
      res.json({ 
        result,
        success: true,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("MCP Query Error:", error);
      res.status(500).json({ 
        result: "Database query failed", 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // MCP tools discovery endpoint for ElevenLabs
  app.get("/api/mcp", (req: Request, res: Response) => {
    res.json({
      tools: [
        {
          name: "enrollments_today",
          description: "Get the number of new enrollments today"
        },
        {
          name: "leads_today", 
          description: "Get the number of new leads captured today"
        },
        {
          name: "qualified_leads",
          description: "Get the number of qualified leads ready for enrollment"
        },
        {
          name: "enrollment_breakdown",
          description: "Get enrollment statistics broken down by course type"
        },
        {
          name: "revenue_today",
          description: "Get total completed payments revenue for today"
        },
        {
          name: "agent_performance",
          description: "Get average agent confidence score over last 24 hours"
        },
        {
          name: "call_summary",
          description: "Get call activity summary for today"
        },
        {
          name: "license_types",
          description: "Get breakdown of license types leads are interested in"
        },
        {
          name: "recent_activity",
          description: "Get the 5 most recent leads and their status"
        },
        {
          name: "conversion_rate",
          description: "Get lead to enrollment conversion rate"
        }
      ],
      version: "1.0.0",
      name: "Insurance Recruiting Analytics"
    });
  });

  // Health check endpoint for MCP server
  app.get("/api/mcp/health", (req: Request, res: Response) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });
}