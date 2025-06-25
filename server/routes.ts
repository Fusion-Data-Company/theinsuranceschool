import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertLeadSchema, insertCallRecordSchema, insertPaymentSchema, insertEnrollmentSchema, insertWebhookLogSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Webhook endpoints
  
  // ElevenLabs voice call webhook
  app.post("/api/webhooks/elevenlabs-call", async (req, res) => {
    try {
      const startTime = Date.now();
      
      // Log the webhook
      await storage.logWebhook({
        endpoint: "/api/webhooks/elevenlabs-call",
        method: "POST",
        payload: req.body,
        responseStatus: 200,
        responseTime: 0, // Will update below
      });

      const {
        call_sid,
        transcript,
        sentiment,
        duration_seconds,
        intent,
        agent_confidence,
        lead_data,
      } = req.body;

      // Upsert lead if data provided
      let lead;
      if (lead_data) {
        const leadInput = insertLeadSchema.parse({
          firstName: lead_data.first_name,
          lastName: lead_data.last_name,
          phone: lead_data.phone,
          email: lead_data.email,
          licenseGoal: lead_data.license_goal,
          source: "voice_agent",
          status: intent === "interested" ? "qualified" : "contacted",
        });
        
        // Check if lead exists by phone
        const existingLead = await storage.getLeadByPhone(lead_data.phone);
        if (existingLead) {
          lead = await storage.updateLead(existingLead.id, {
            status: intent === "interested" ? "qualified" : "contacted",
          });
        } else {
          lead = await storage.createLead(leadInput);
        }
      }

      // Insert call record
      if (lead && call_sid) {
        const callRecordInput = insertCallRecordSchema.parse({
          leadId: lead.id,
          callSid: call_sid,
          transcript,
          sentiment,
          durationSeconds: duration_seconds,
          intent,
          agentConfidence: agent_confidence,
        });
        
        await storage.createCallRecord(callRecordInput);
      }

      // If qualified lead, trigger payment link (placeholder for integration)
      if (lead && intent === "interested") {
        // TODO: Integrate with Stripe/payment processor
        console.log(`Should send payment link to ${lead.email}`);
      }

      const responseTime = Date.now() - startTime;
      res.json({ 
        success: true, 
        leadId: lead?.id,
        message: "Webhook processed successfully",
        responseTime 
      });

    } catch (error) {
      console.error("ElevenLabs webhook error:", error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Internal AI query webhook
  app.post("/api/webhooks/internal-query", async (req, res) => {
    try {
      const startTime = Date.now();
      
      await storage.logWebhook({
        endpoint: "/api/webhooks/internal-query",
        method: "POST",
        payload: req.body,
        responseStatus: 200,
        responseTime: 0,
      });

      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      // Simple query processing (in production, integrate with OpenRouter)
      let response = "I'm Jason Analytics. I can help you with lead and performance data.";
      let data = {};

      if (query.toLowerCase().includes("leads")) {
        const leads = await storage.getAllLeads();
        data = {
          totalLeads: leads.length,
          qualified: leads.filter(l => l.status === "qualified").length,
          enrolled: leads.filter(l => l.status === "enrolled").length,
        };
        response = `You have ${(data as any).totalLeads} total leads, with ${(data as any).qualified} qualified and ${(data as any).enrolled} enrolled.`;
      }

      if (query.toLowerCase().includes("performance") || query.toLowerCase().includes("conversion")) {
        const analytics = await storage.getAnalytics();
        response = `Current conversion rate is ${analytics.conversionRate}% with ${analytics.totalCalls} calls processed.`;
        data = analytics;
      }

      const responseTime = Date.now() - startTime;
      res.json({
        success: true,
        response,
        data,
        responseTime,
      });

    } catch (error) {
      console.error("Internal query webhook error:", error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // API endpoints for CRUD operations

  // Leads endpoints
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.get("/api/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const lead = await storage.getLeadById(id);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lead" });
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      res.status(201).json(lead);
    } catch (error) {
      res.status(400).json({ error: "Invalid lead data" });
    }
  });

  app.patch("/api/leads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const lead = await storage.updateLead(id, updateData);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: "Failed to update lead" });
    }
  });

  // Analytics endpoint
  app.get("/api/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Enrollments endpoints
  app.get("/api/enrollments", async (req, res) => {
    try {
      const enrollments = await storage.getAllEnrollments();
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch enrollments" });
    }
  });

  app.post("/api/enrollments", async (req, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse(req.body);
      const enrollment = await storage.createEnrollment(enrollmentData);
      
      // Update lead status to enrolled
      await storage.updateLead(enrollmentData.leadId, { status: "enrolled" });
      
      res.status(201).json(enrollment);
    } catch (error) {
      res.status(400).json({ error: "Invalid enrollment data" });
    }
  });

  // Call records endpoint
  app.get("/api/call-records", async (req, res) => {
    try {
      const callRecords = await storage.getAllCallRecords();
      res.json(callRecords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch call records" });
    }
  });

  // Payments endpoint
  app.get("/api/payments", async (req, res) => {
    try {
      const payments = await storage.getAllPayments();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
