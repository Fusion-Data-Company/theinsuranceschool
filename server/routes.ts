import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertLeadSchema, insertCallRecordSchema, insertPaymentSchema, insertEnrollmentSchema, insertWebhookLogSchema } from "@shared/schema";
import { registerMCPEndpoint } from "./mcp";
import { sendLeadNotification, testSMSNotification, sendPersonalTestSMS } from "./sms";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register MCP endpoint FIRST to ensure it's not intercepted by frontend routing
  registerMCPEndpoint(app);
  
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

      // Send SMS notification based on payment status
      if (lead) {
        try {
          const notificationType = lead.paymentStatus === 'PAID' ? 'PAID' : 'NOT_PAID';
          await sendLeadNotification({
            lead,
            type: notificationType
          });
          console.log(`SMS notification sent for lead ${lead.id} (${notificationType})`);
        } catch (smsError) {
          console.error('Failed to send SMS notification:', smsError);
          // Don't fail the webhook if SMS fails
        }
      }

      // If qualified lead, trigger payment link (placeholder for integration)
      if (lead && intent === "interested") {
        // TODO: Integrate with Stripe/payment processor
        console.log(`Should send payment link to ${lead.email}`);
      }

      // Get all data for n8n PostgreSQL node
      const [allLeads, allEnrollments, allPayments, allCallRecords, allChatHistories] = await Promise.all([
        storage.getAllLeads(),
        storage.getAllEnrollments(),
        storage.getAllPayments(),
        storage.getAllCallRecords(),
        storage.getAllN8nChatHistories()
      ]);

      const analytics = await storage.getAnalytics();

      const responseTime = Date.now() - startTime;
      res.json({ 
        success: true, 
        leadId: lead?.id,
        message: "Webhook processed successfully",
        responseTime,
        // Complete UUID dataset for n8n PostgreSQL node
        timestamp: new Date().toISOString(),
        summary: {
          totalLeads: allLeads.length,
          totalEnrollments: allEnrollments.length,
          totalPayments: allPayments.length,
          totalCallRecords: allCallRecords.length,
          totalChatHistories: allChatHistories.length,
          activeLeads: analytics.activeLeads,
          conversionRate: analytics.conversionRate,
          monthlyRevenue: analytics.monthlyRevenue
        },
        leads: allLeads,
        enrollments: allEnrollments,
        payments: allPayments,
        callRecords: allCallRecords,
        chatHistories: allChatHistories,
        uuid_schema: {
          primary_key: "uuid",
          chat_table: "n8n_chat_histories",
          unique_identifier_field: "uuid",
          session_grouping_field: "sessionId",
          postgres_node_instructions: "Use uuid field as unique identifier for learning agent memory"
        },
        analytics: analytics
      });

    } catch (error) {
      console.error("ElevenLabs webhook error:", error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // n8n Analytics webhook - handles UUID data requests
  app.post("/webhook/:webhookId", async (req, res) => {
    try {
      const startTime = Date.now();
      
      await storage.logWebhook({
        endpoint: `/webhook/${req.params.webhookId}`,
        method: "POST",
        payload: req.body,
        responseStatus: 200,
        responseTime: 0,
      });

      // Get comprehensive dashboard data with UUIDs for n8n workflow
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { db } = await import("./db");
      const { leads, enrollments, payments, callRecords, n8nChatHistories } = await import("@shared/schema");
      const { desc, eq, gte, lte, and, count, sum, avg } = await import("drizzle-orm");

      // Get all data including chat histories with UUIDs
      const [allLeads, allEnrollments, allPayments, allCallRecords, allChatHistories] = await Promise.all([
        db.select().from(leads).orderBy(desc(leads.createdAt)),
        db.select().from(enrollments).orderBy(desc(enrollments.createdAt)),
        db.select().from(payments).orderBy(desc(payments.createdAt)),
        db.select().from(callRecords).orderBy(desc(callRecords.createdAt)),
        db.select({
          uuid: n8nChatHistories.uuid,
          sessionId: n8nChatHistories.sessionId,
          messages: n8nChatHistories.messages,
          message: n8nChatHistories.message,
          createdAt: n8nChatHistories.createdAt,
          updatedAt: n8nChatHistories.updatedAt
        }).from(n8nChatHistories).orderBy(desc(n8nChatHistories.createdAt))
      ]);

      const analytics = await storage.getAnalytics();

      // Extract UUID fields for direct PostgreSQL access
      const uuidFields = allChatHistories.map(chat => ({
        uuid: chat.uuid,
        sessionId: chat.sessionId,
        message: chat.message,
        messages: chat.messages,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      }));

      const responseData = {
        success: true,
        timestamp: new Date().toISOString(),
        // Direct UUID access for PostgreSQL node
        uuid: allChatHistories[0]?.uuid || null,
        sessionId: allChatHistories[0]?.sessionId || null,
        uuids: uuidFields,
        chat_memory: uuidFields,
        // Complete dataset
        summary: {
          totalLeads: allLeads.length,
          totalEnrollments: allEnrollments.length,
          totalPayments: allPayments.length,
          totalCallRecords: allCallRecords.length,
          totalChatHistories: allChatHistories.length,
          activeLeads: analytics.activeLeads,
          conversionRate: analytics.conversionRate,
          monthlyRevenue: analytics.monthlyRevenue
        },
        leads: allLeads,
        enrollments: allEnrollments,
        payments: allPayments,
        callRecords: allCallRecords,
        chatHistories: allChatHistories,
        uuid_schema: {
          primary_key: "uuid",
          chat_table: "n8n_chat_histories",
          unique_identifier_field: "uuid",
          session_grouping_field: "sessionId",
          postgres_node_instructions: "Use uuid field as unique identifier for learning agent memory"
        },
        analytics: analytics,
        webhook_data: req.body,
        headers: req.headers,
        params: req.params,
        query: req.query,
        body: req.body,
        webhookUrl: req.body.webhookUrl,
        executionMode: req.body.executionMode,
        responseTime: Date.now() - startTime
      };

      res.json(responseData);

    } catch (error) {
      console.error("n8n webhook error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Webhook processing failed",
        timestamp: new Date().toISOString()
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

  // n8n Webhook endpoint for enhanced lead processing with SMS notifications
  app.post("/api/webhooks/n8n-lead-processor", async (req, res) => {
    try {
      const startTime = Date.now();
      
      // Log the webhook
      await storage.logWebhook({
        endpoint: "/api/webhooks/n8n-lead-processor",
        method: "POST",
        payload: req.body,
        responseStatus: 200,
        responseTime: 0,
      });

      const leadData = req.body;
      
      // Create expanded lead schema with all 12 new fields
      const expandedLeadInput = insertLeadSchema.parse({
        firstName: leadData.firstName || leadData.first_name,
        lastName: leadData.lastName || leadData.last_name,
        phone: leadData.phone,
        email: leadData.email,
        licenseGoal: leadData.licenseGoal || leadData.license_goal,
        source: leadData.source || "n8n_workflow",
        status: leadData.status || "new",
        // Enhanced lead fields from ElevenLabs conversation
        painPoints: leadData.painPoints || leadData.pain_points,
        employmentStatus: leadData.employmentStatus || leadData.employment_status,
        urgencyLevel: leadData.urgencyLevel || leadData.urgency_level,
        paymentPreference: leadData.paymentPreference || leadData.payment_preference,
        paymentStatus: leadData.paymentStatus || leadData.payment_status || 'NOT_PAID',
        confirmationNumber: leadData.confirmationNumber || leadData.confirmation_number,
        agentName: leadData.agentName || leadData.agent_name || 'Bandit AI',
        supervisor: leadData.supervisor || 'Kelli Kirk',
        leadSource: leadData.leadSource || leadData.lead_source || 'n8n Workflow',
        callSummary: leadData.callSummary || leadData.call_summary,
        callDate: leadData.callDate || leadData.call_date ? new Date(leadData.callDate || leadData.call_date) : null,
        conversationId: leadData.conversationId || leadData.conversation_id,
      });
      
      // Check if lead exists by phone
      const existingLead = await storage.getLeadByPhone(expandedLeadInput.phone);
      let lead;
      
      if (existingLead) {
        // Update existing lead with new information
        lead = await storage.updateLead(existingLead.id, expandedLeadInput);
        console.log(`Updated existing lead ${existingLead.id} with enhanced data`);
      } else {
        // Create new lead
        lead = await storage.createLead(expandedLeadInput);
        console.log(`Created new lead ${lead.id} with enhanced data`);
      }

      // Send SMS notification immediately
      try {
        const notificationType = lead.paymentStatus === 'PAID' ? 'PAID' : 'NOT_PAID';
        const smsSuccess = await sendLeadNotification({
          lead,
          type: notificationType
        });
        
        if (smsSuccess) {
          console.log(`SMS notification sent for lead ${lead.id} (${notificationType}) to +14074013100`);
        }
      } catch (smsError) {
        console.error('Failed to send SMS notification:', smsError);
      }

      const responseTime = Date.now() - startTime;
      
      res.json({ 
        success: true, 
        leadId: lead.id,
        action: existingLead ? 'updated' : 'created',
        smsNotified: true,
        message: `Lead ${existingLead ? 'updated' : 'created'} successfully with SMS notification sent`,
        responseTime,
        leadData: {
          id: lead.id,
          name: `${lead.firstName} ${lead.lastName}`,
          phone: lead.phone,
          licenseGoal: lead.licenseGoal,
          paymentStatus: lead.paymentStatus,
          urgencyLevel: lead.urgencyLevel,
          agentName: lead.agentName
        }
      });
      
    } catch (error) {
      console.error("n8n webhook error:", error);
      res.status(500).json({ error: "Failed to process n8n webhook", details: error.message });
    }
  });

  // Test SMS endpoint for verification
  app.post("/api/test-sms", async (req, res) => {
    try {
      const success = await testSMSNotification();
      if (success) {
        res.json({ success: true, message: "Test SMS sent successfully to +14074013100" });
      } else {
        res.status(500).json({ success: false, message: "Failed to send test SMS" });
      }
    } catch (error) {
      console.error("Test SMS error:", error);
      res.status(500).json({ success: false, error: "SMS test failed" });
    }
  });

  // Personal test SMS endpoint - for verification purposes
  app.post("/api/test-personal-sms", async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      if (!phoneNumber) {
        return res.status(400).json({ success: false, message: "Phone number is required" });
      }
      
      const success = await sendPersonalTestSMS(phoneNumber);
      if (success) {
        res.json({ 
          success: true, 
          message: `Personal test SMS sent successfully to ${phoneNumber}`,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(500).json({ success: false, message: "Failed to send personal test SMS" });
      }
    } catch (error) {
      console.error("Personal test SMS error:", error);
      res.status(500).json({ success: false, message: "Personal SMS test failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
