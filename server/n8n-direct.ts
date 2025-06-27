import { Express, Request, Response } from "express";
import { db } from "./db";
import { n8nChatHistories } from "@shared/schema";
import { desc } from "drizzle-orm";

export function registerN8nDirectEndpoints(app: Express) {
  // Direct endpoint for n8n to access chat histories with explicit UUID handling
  app.get("/api/n8n/chat-histories", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      
      const chatHistories = await db
        .select({
          uuid: n8nChatHistories.uuid,
          session_id: n8nChatHistories.sessionId,
          messages: n8nChatHistories.messages,
          message: n8nChatHistories.message,
          created_at: n8nChatHistories.createdAt,
          updated_at: n8nChatHistories.updatedAt
        })
        .from(n8nChatHistories)
        .orderBy(desc(n8nChatHistories.createdAt))
        .limit(limit);

      // Ensure each record has a proper UUID
      const processedHistories = chatHistories.map(record => ({
        ...record,
        uuid: record.uuid || `generated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }));

      res.json({
        success: true,
        data: processedHistories,
        count: processedHistories.length,
        uuid_field: "uuid",
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("N8N chat histories error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch chat histories",
        timestamp: new Date().toISOString()
      });
    }
  });

  // Simple UUID test endpoint
  app.get("/api/n8n/uuid-test", async (req: Request, res: Response) => {
    try {
      const testRecord = await db
        .select()
        .from(n8nChatHistories)
        .limit(1);

      res.json({
        success: true,
        sample_record: testRecord[0] || null,
        uuid_present: testRecord[0]?.uuid ? true : false,
        uuid_value: testRecord[0]?.uuid || "NOT_FOUND",
        schema_columns: Object.keys(testRecord[0] || {}),
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("UUID test error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to test UUID",
        timestamp: new Date().toISOString()
      });
    }
  });
}