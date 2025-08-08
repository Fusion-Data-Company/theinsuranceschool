import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal, varchar, index } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for basic auth (keeping existing)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Leads table - core entity for tracking potential students
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: text("email").notNull(),
  licenseGoal: text("license_goal").notNull(), // 2-15, 2-40, 2-14
  source: text("source").notNull().default("voice_agent"), // voice_agent, website, referral
  status: text("status").notNull().default("new"), // new, contacted, qualified, enrolled, opt_out
  // NEW FIELDS FOR EXPANDED LEAD CAPTURE
  painPoints: text("pain_points"),
  employmentStatus: varchar("employment_status", { length: 100 }),
  urgencyLevel: varchar("urgency_level", { length: 50 }),
  paymentPreference: varchar("payment_preference", { length: 50 }),
  paymentStatus: varchar("payment_status", { length: 20 }).default("NOT_PAID"),
  confirmationNumber: varchar("confirmation_number", { length: 100 }),
  agentName: varchar("agent_name", { length: 100 }),
  supervisor: varchar("supervisor", { length: 100 }).default("Kelli Kirk"),
  leadSource: varchar("lead_source", { length: 100 }),
  callSummary: text("call_summary"),
  callDate: timestamp("call_date"),
  conversationId: varchar("conversation_id", { length: 100 }),
  // Call queue management - tracks multiple consecutive unanswered calls
  unansweredCallAttempts: integer("unanswered_call_attempts").default(0),
  lastCallAttemptAt: timestamp("last_call_attempt_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  phoneIdx: index("phone_idx").on(table.phone),
  statusIdx: index("status_idx").on(table.status),
  createdAtIdx: index("created_at_idx").on(table.createdAt),
}));

// Call records from ElevenLabs voice agents
export const callRecords = pgTable("call_records", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  callSid: text("call_sid").notNull().unique(),
  transcript: text("transcript"),
  sentiment: text("sentiment"), // positive, neutral, negative
  durationSeconds: integer("duration_seconds"),
  intent: text("intent"), // interested, undecided, opt_out
  agentConfidence: decimal("agent_confidence", { precision: 5, scale: 4 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  leadIdIdx: index("call_lead_id_idx").on(table.leadId),
  intentIdx: index("call_intent_idx").on(table.intent),
}));

// Payment plans and transactions
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  planChosen: text("plan_chosen").notNull(), // full, 199_down, affirm, afterpay, klarna
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, completed, failed, refunded
  linkSent: boolean("link_sent").notNull().default(false),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  leadIdIdx: index("payment_lead_id_idx").on(table.leadId),
  statusIdx: index("payment_status_idx").on(table.status),
}));

// Student enrollments
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  course: text("course").notNull(), // 2-15_life_health, 2-40_property_casualty, 2-14_personal_lines
  cohort: text("cohort").notNull(), // day, evening, weekend
  startDate: timestamp("start_date").notNull(),
  status: text("status").notNull().default("enrolled"), // enrolled, active, completed, dropped
  progress: integer("progress").notNull().default(0), // 0-100 percentage
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  leadIdIdx: index("enrollment_lead_id_idx").on(table.leadId),
  statusIdx: index("enrollment_status_idx").on(table.status),
  startDateIdx: index("enrollment_start_date_idx").on(table.startDate),
}));

// Webhook logs for debugging and monitoring
export const webhookLogs = pgTable("webhook_logs", {
  id: serial("id").primaryKey(),
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),
  payload: jsonb("payload"),
  responseStatus: integer("response_status"),
  responseTime: integer("response_time_ms"),
  receivedAt: timestamp("received_at").notNull().defaultNow(),
}, (table) => ({
  endpointIdx: index("webhook_endpoint_idx").on(table.endpoint),
  receivedAtIdx: index("webhook_received_at_idx").on(table.receivedAt),
}));

// Agent performance metrics
export const agentMetrics = pgTable("agent_metrics", {
  id: serial("id").primaryKey(),
  callRecordId: integer("call_record_id").notNull().references(() => callRecords.id, { onDelete: "cascade" }),
  confidence: decimal("confidence", { precision: 5, scale: 4 }),
  responseTimeMs: integer("response_time_ms"),
  avgPauseMs: integer("avg_pause_ms"),
  wordsPerMinute: integer("words_per_minute"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  callRecordIdIdx: index("agent_metrics_call_id_idx").on(table.callRecordId),
}));

// n8n Chat Histories for long-term memory
export const n8nChatHistories = pgTable("n8n_chat_histories", {
  id: serial("id").primaryKey(),
  uuid: text("uuid").unique(),
  sessionId: text("session_id"),
  messages: jsonb("messages"),
  message: text("message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  sessionIdIdx: index("n8n_session_id_idx").on(table.sessionId),
  createdAtIdx: index("n8n_created_at_idx").on(table.createdAt),
  uuidIdx: index("n8n_chat_histories_uuid_idx").on(table.uuid),
}));

// Define relations
export const leadsRelations = relations(leads, ({ many }) => ({
  callRecords: many(callRecords),
  payments: many(payments),
  enrollments: many(enrollments),
}));

export const callRecordsRelations = relations(callRecords, ({ one, many }) => ({
  lead: one(leads, {
    fields: [callRecords.leadId],
    references: [leads.id],
  }),
  agentMetrics: many(agentMetrics),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  lead: one(leads, {
    fields: [payments.leadId],
    references: [leads.id],
  }),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  lead: one(leads, {
    fields: [enrollments.leadId],
    references: [leads.id],
  }),
}));

export const agentMetricsRelations = relations(agentMetrics, ({ one }) => ({
  callRecord: one(callRecords, {
    fields: [agentMetrics.callRecordId],
    references: [callRecords.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCallRecordSchema = createInsertSchema(callRecords).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWebhookLogSchema = createInsertSchema(webhookLogs).omit({
  id: true,
  receivedAt: true,
});

export const insertAgentMetricSchema = createInsertSchema(agentMetrics).omit({
  id: true,
  createdAt: true,
});

export const insertN8nChatHistorySchema = createInsertSchema(n8nChatHistories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type CallRecord = typeof callRecords.$inferSelect;
export type InsertCallRecord = z.infer<typeof insertCallRecordSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;

export type WebhookLog = typeof webhookLogs.$inferSelect;
export type InsertWebhookLog = z.infer<typeof insertWebhookLogSchema>;

export type AgentMetric = typeof agentMetrics.$inferSelect;
export type InsertAgentMetric = z.infer<typeof insertAgentMetricSchema>;

export type N8nChatHistory = typeof n8nChatHistories.$inferSelect;
export type InsertN8nChatHistory = z.infer<typeof insertN8nChatHistorySchema>;
