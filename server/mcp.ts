import { Express, Request, Response } from "express";
import { db } from "./db";
import { 
  leads, 
  enrollments, 
  callRecords, 
  payments, 
  agentMetrics 
} from "@shared/schema";
import { eq, gte, lte, count, avg, sum, and, desc } from "drizzle-orm";

export function registerMCPEndpoint(app: Express) {
  console.log("Registering SSE MCP server for ElevenLabs integration...");

  // CORS middleware for all MCP endpoints
  app.use("/api/mcp*", (req: Request, res: Response, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.header('Access-Control-Expose-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Authentication middleware
  const authenticateMCP = (req: Request, res: Response, next: Function) => {
    const authHeader = req.headers.authorization;
    const expectedToken = "Ry27942001$";
    
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization required" });
    }

    const token = authHeader.replace("Bearer ", "");
    if (token !== expectedToken) {
      return res.status(401).json({ error: "Invalid authentication" });
    }

    next();
  };

  // SSE connection endpoint (ElevenLabs MCP format)
  app.get("/api/mcp", authenticateMCP, (req: Request, res: Response) => {
    console.log("ElevenLabs MCP SSE connection established");
    
    // Set up SSE headers for ElevenLabs
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'X-Accel-Buffering': 'no'
    });

    // Send MCP protocol initialization
    const initMessage = {
      jsonrpc: "2.0",
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {}
        },
        clientInfo: {
          name: "Insurance School Recruiting Analytics",
          version: "1.0.0"
        }
      }
    };
    
    res.write(`data: ${JSON.stringify(initMessage)}\n\n`);

    // Send tools list response
    const toolsResponse = {
      jsonrpc: "2.0",
      method: "tools/list",
      result: {
        tools: [
          {
            name: "enrollments_today",
            description: "Get the number of new enrollments today",
            inputSchema: {
              type: "object",
              properties: {},
              required: []
            }
          },
          {
            name: "leads_today",
            description: "Get the number of new leads captured today",
            inputSchema: {
              type: "object",
              properties: {},
              required: []
            }
          },
          {
            name: "qualified_leads",
            description: "Get the number of qualified leads ready for enrollment",
            inputSchema: {
              type: "object",
              properties: {},
              required: []
            }
          },
          {
            name: "enrollment_breakdown",
            description: "Get enrollment statistics broken down by course type",
            inputSchema: {
              type: "object",
              properties: {},
              required: []
            }
          },
          {
            name: "revenue_today",
            description: "Get total completed payments revenue for today",
            inputSchema: {
              type: "object",
              properties: {},
              required: []
            }
          },
          {
            name: "agent_performance",
            description: "Get average agent confidence score over last 24 hours",
            inputSchema: {
              type: "object",
              properties: {},
              required: []
            }
          },
          {
            name: "call_summary",
            description: "Get call activity summary for today",
            inputSchema: {
              type: "object",
              properties: {},
              required: []
            }
          },
          {
            name: "license_types",
            description: "Get breakdown of license types leads are interested in",
            inputSchema: {
              type: "object",
              properties: {},
              required: []
            }
          },
          {
            name: "recent_activity",
            description: "Get the 5 most recent leads and their status",
            inputSchema: {
              type: "object",
              properties: {},
              required: []
            }
          },
          {
            name: "conversion_rate",
            description: "Get lead to enrollment conversion rate",
            inputSchema: {
              type: "object",
              properties: {},
              required: []
            }
          }
        ]
      }
    };

    // Send tools discovery message
    res.write(`data: ${JSON.stringify(toolsResponse)}\n\n`);

    // Keep connection alive with heartbeat
    const keepAlive = setInterval(() => {
      try {
        res.write(`data: ${JSON.stringify({ type: "ping", timestamp: Date.now() })}\n\n`);
      } catch (error) {
        clearInterval(keepAlive);
      }
    }, 30000);

    // Handle client disconnect
    req.on('close', () => {
      console.log("ElevenLabs MCP SSE connection closed");
      clearInterval(keepAlive);
    });

    req.on('error', () => {
      console.log("ElevenLabs MCP SSE connection error");
      clearInterval(keepAlive);
    });
  });

  // Tool execution endpoint for ElevenLabs POST requests
  app.post("/api/mcp", authenticateMCP, async (req: Request, res: Response) => {
    try {
      const { tool_name, arguments: toolArgs = {} } = req.body;
      let result = "No data available";

      console.log(`ElevenLabs Tool execution: ${tool_name}`, toolArgs);

      switch (tool_name) {
        case "enrollments_today": {
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
          break;
        }

        case "leads_today": {
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
          break;
        }

        case "qualified_leads": {
          const [qualifiedCount] = await db
            .select({ count: count() })
            .from(leads)
            .where(eq(leads.status, "qualified"));

          result = `${qualifiedCount.count} qualified leads ready for enrollment`;
          break;
        }

        case "enrollment_breakdown": {
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
          break;
        }

        case "revenue_today": {
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
          break;
        }

        case "agent_performance": {
          const [avgConfidence] = await db
            .select({ avg: avg(agentMetrics.confidence) })
            .from(agentMetrics)
            .where(gte(agentMetrics.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)));

          const confidence = avgConfidence.avg ? Number(avgConfidence.avg).toFixed(2) : "0";
          result = `Average agent confidence score: ${confidence}% over last 24 hours`;
          break;
        }

        case "call_summary": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const [callStats] = await db
            .select({ 
              total: count()
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
          break;
        }

        case "license_types": {
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
          break;
        }

        case "recent_activity": {
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
          break;
        }

        case "conversion_rate": {
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
          break;
        }

        default:
          return res.status(400).json({
            error: `Unknown tool: ${tool_name}`,
            success: false
          });
      }

      // Return ElevenLabs-compatible response
      res.json({
        result,
        success: true,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("ElevenLabs Tool Error:", error);
      res.status(500).json({
        error: "Database query failed",
        success: false,
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Legacy tool execution endpoint (backup)
  app.post("/api/mcp/call", authenticateMCP, async (req: Request, res: Response) => {
    try {
      const { method, params } = req.body;
      
      if (method !== "tools/call") {
        return res.status(400).json({
          jsonrpc: "2.0",
          error: {
            code: -32601,
            message: "Method not found"
          }
        });
      }

      const { name: toolName, arguments: toolArgs = {} } = params;
      let result = "No data available";

      console.log(`MCP Tool execution: ${toolName}`);

      switch (toolName) {
        case "enrollments_today": {
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
          break;
        }

        case "leads_today": {
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
          break;
        }

        case "qualified_leads": {
          const [qualifiedCount] = await db
            .select({ count: count() })
            .from(leads)
            .where(eq(leads.status, "qualified"));

          result = `${qualifiedCount.count} qualified leads ready for enrollment`;
          break;
        }

        case "enrollment_breakdown": {
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
          break;
        }

        case "revenue_today": {
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
          break;
        }

        case "agent_performance": {
          const [avgConfidence] = await db
            .select({ avg: avg(agentMetrics.confidence) })
            .from(agentMetrics)
            .where(gte(agentMetrics.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)));

          const confidence = avgConfidence.avg ? Number(avgConfidence.avg).toFixed(2) : "0";
          result = `Average agent confidence score: ${confidence}% over last 24 hours`;
          break;
        }

        case "call_summary": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const [callStats] = await db
            .select({ 
              total: count()
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
          break;
        }

        case "license_types": {
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
          break;
        }

        case "recent_activity": {
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
          break;
        }

        case "conversion_rate": {
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
          break;
        }

        default:
          return res.status(400).json({
            jsonrpc: "2.0",
            error: {
              code: -32602,
              message: `Unknown tool: ${toolName}`
            }
          });
      }

      // Return MCP-compliant response
      res.json({
        jsonrpc: "2.0",
        result: {
          content: [
            {
              type: "text",
              text: result
            }
          ]
        }
      });

    } catch (error) {
      console.error("MCP Tool Error:", error);
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal error",
          data: error instanceof Error ? error.message : "Unknown error"
        }
      });
    }
  });

  // Tool manifest endpoint for ElevenLabs discovery (no auth required)
  app.get("/api/mcp-manifest", (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({
      name: "Insurance School Recruiting Analytics",
      version: "1.0.0",
      description: "Real-time analytics MCP server for insurance school recruitment operations, providing enrollment metrics, lead tracking, and performance insights",
      server: {
        type: "sse",
        url: "https://a190e6a1-bc0e-470f-8fa1-8a9b6477c321-00-3sbmufpxo473c.spock.replit.dev/api/mcp",
        authentication: {
          type: "bearer",
          token_header: "Authorization"
        }
      },
      tools: [
        {
          name: "enrollments_today",
          description: "Get the number of new student enrollments today across all insurance courses",
          input_schema: {
            type: "object",
            properties: {},
            required: []
          },
          category: "enrollment_metrics"
        },
        {
          name: "leads_today", 
          description: "Get the total number of new leads captured today from all sources",
          input_schema: {
            type: "object",
            properties: {},
            required: []
          },
          category: "lead_metrics"
        },
        {
          name: "qualified_leads",
          description: "Get count of qualified leads ready for enrollment consultation",
          input_schema: {
            type: "object", 
            properties: {},
            required: []
          },
          category: "lead_metrics"
        },
        {
          name: "enrollment_breakdown",
          description: "Get detailed enrollment statistics broken down by course type (2-15, 2-40, 2-14)",
          input_schema: {
            type: "object",
            properties: {},
            required: []
          },
          category: "enrollment_metrics"
        },
        {
          name: "revenue_today",
          description: "Get total completed payment revenue for today across all payment plans",
          input_schema: {
            type: "object",
            properties: {},
            required: []
          },
          category: "financial_metrics"
        },
        {
          name: "agent_performance",
          description: "Get average AI agent confidence score over the last 24 hours",
          input_schema: {
            type: "object",
            properties: {},
            required: []
          },
          category: "performance_metrics"
        },
        {
          name: "call_summary",
          description: "Get call activity summary for today including total calls and interest level",
          input_schema: {
            type: "object",
            properties: {},
            required: []
          },
          category: "call_metrics"
        },
        {
          name: "license_types",
          description: "Get breakdown of license types that leads are interested in pursuing",
          input_schema: {
            type: "object",
            properties: {},
            required: []
          },
          category: "lead_metrics"
        },
        {
          name: "recent_activity",
          description: "Get the 5 most recent leads and their current status in the pipeline",
          input_schema: {
            type: "object",
            properties: {},
            required: []
          },
          category: "activity_metrics"
        },
        {
          name: "conversion_rate",
          description: "Get lead to enrollment conversion rate percentage and totals",
          input_schema: {
            type: "object",
            properties: {},
            required: []
          },
          category: "performance_metrics"
        }
      ],
      capabilities: {
        real_time: true,
        database_queries: true,
        analytics: true,
        reporting: true
      },
      metadata: {
        provider: "Insurance School Recruiting",
        contact: "analytics@insuranceschool.com",
        documentation: "https://a190e6a1-bc0e-470f-8fa1-8a9b6477c321-00-3sbmufpxo473c.spock.replit.dev/api/mcp/health",
        created: "2025-06-26",
        last_updated: "2025-06-26"
      }
    });
  });

  // Health check endpoint
  app.get("/api/mcp/health", (req: Request, res: Response) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      transport: "SSE",
      protocol: "MCP"
    });
  });
}