import { 
  users, leads, callRecords, payments, enrollments, webhookLogs, agentMetrics,
  type User, type InsertUser, type Lead, type InsertLead, type CallRecord, 
  type InsertCallRecord, type Payment, type InsertPayment, type Enrollment, 
  type InsertEnrollment, type WebhookLog, type InsertWebhookLog, 
  type AgentMetric, type InsertAgentMetric 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, avg, sum, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Leads
  getAllLeads(): Promise<Lead[]>;
  getLeadById(id: number): Promise<Lead | undefined>;
  getLeadByPhone(phone: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, updates: Partial<InsertLead>): Promise<Lead | undefined>;

  // Call Records
  getAllCallRecords(): Promise<CallRecord[]>;
  getCallRecordsByLeadId(leadId: number): Promise<CallRecord[]>;
  createCallRecord(callRecord: InsertCallRecord): Promise<CallRecord>;

  // Payments
  getAllPayments(): Promise<Payment[]>;
  getPaymentsByLeadId(leadId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, updates: Partial<InsertPayment>): Promise<Payment | undefined>;

  // Enrollments
  getAllEnrollments(): Promise<Enrollment[]>;
  getEnrollmentsByLeadId(leadId: number): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollment(id: number, updates: Partial<InsertEnrollment>): Promise<Enrollment | undefined>;

  // Webhook Logs
  logWebhook(webhookLog: InsertWebhookLog): Promise<WebhookLog>;
  getRecentWebhookLogs(limit?: number): Promise<WebhookLog[]>;

  // Agent Metrics
  createAgentMetric(metric: InsertAgentMetric): Promise<AgentMetric>;
  getAgentMetricsByCallId(callRecordId: number): Promise<AgentMetric[]>;

  // Analytics
  getAnalytics(): Promise<{
    activeLeads: number;
    conversionRate: number;
    revenueToday: number;
    agentPerformance: number;
    totalLeads: number;
    qualified: number;
    enrolled: number;
    totalCalls: number;
    monthlyRevenue: number;
    avgDealSize: number;
    aiPerformance: number;
    responseTime: number;
    enrollmentRate: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Leads
  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLeadById(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async getLeadByPhone(phone: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.phone, phone));
    return lead || undefined;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values({
      ...insertLead,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return lead;
  }

  async updateLead(id: number, updates: Partial<InsertLead>): Promise<Lead | undefined> {
    const [lead] = await db.update(leads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return lead || undefined;
  }

  // Call Records
  async getAllCallRecords(): Promise<CallRecord[]> {
    return await db.select().from(callRecords).orderBy(desc(callRecords.createdAt));
  }

  async getCallRecordsByLeadId(leadId: number): Promise<CallRecord[]> {
    return await db.select().from(callRecords)
      .where(eq(callRecords.leadId, leadId))
      .orderBy(desc(callRecords.createdAt));
  }

  async createCallRecord(insertCallRecord: InsertCallRecord): Promise<CallRecord> {
    const [callRecord] = await db.insert(callRecords).values({
      ...insertCallRecord,
      createdAt: new Date(),
    }).returning();
    return callRecord;
  }

  // Payments
  async getAllPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.createdAt));
  }

  async getPaymentsByLeadId(leadId: number): Promise<Payment[]> {
    return await db.select().from(payments)
      .where(eq(payments.leadId, leadId))
      .orderBy(desc(payments.createdAt));
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values({
      ...insertPayment,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return payment;
  }

  async updatePayment(id: number, updates: Partial<InsertPayment>): Promise<Payment | undefined> {
    const [payment] = await db.update(payments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(payments.id, id))
      .returning();
    return payment || undefined;
  }

  // Enrollments
  async getAllEnrollments(): Promise<Enrollment[]> {
    return await db.select().from(enrollments).orderBy(desc(enrollments.createdAt));
  }

  async getEnrollmentsByLeadId(leadId: number): Promise<Enrollment[]> {
    return await db.select().from(enrollments)
      .where(eq(enrollments.leadId, leadId))
      .orderBy(desc(enrollments.createdAt));
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db.insert(enrollments).values({
      ...insertEnrollment,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return enrollment;
  }

  async updateEnrollment(id: number, updates: Partial<InsertEnrollment>): Promise<Enrollment | undefined> {
    const [enrollment] = await db.update(enrollments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(enrollments.id, id))
      .returning();
    return enrollment || undefined;
  }

  // Webhook Logs
  async logWebhook(insertWebhookLog: InsertWebhookLog): Promise<WebhookLog> {
    const [webhookLog] = await db.insert(webhookLogs).values({
      ...insertWebhookLog,
      receivedAt: new Date(),
    }).returning();
    return webhookLog;
  }

  async getRecentWebhookLogs(limit: number = 100): Promise<WebhookLog[]> {
    return await db.select().from(webhookLogs)
      .orderBy(desc(webhookLogs.receivedAt))
      .limit(limit);
  }

  // Agent Metrics
  async createAgentMetric(insertAgentMetric: InsertAgentMetric): Promise<AgentMetric> {
    const [agentMetric] = await db.insert(agentMetrics).values({
      ...insertAgentMetric,
      createdAt: new Date(),
    }).returning();
    return agentMetric;
  }

  async getAgentMetricsByCallId(callRecordId: number): Promise<AgentMetric[]> {
    return await db.select().from(agentMetrics)
      .where(eq(agentMetrics.callRecordId, callRecordId));
  }

  // Analytics
  async getAnalytics(): Promise<{
    activeLeads: number;
    conversionRate: number;
    revenueToday: number;
    agentPerformance: number;
    totalLeads: number;
    qualified: number;
    enrolled: number;
    totalCalls: number;
    monthlyRevenue: number;
    avgDealSize: number;
    aiPerformance: number;
    responseTime: number;
    enrollmentRate: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get lead counts
    const [totalLeadsResult] = await db.select({ count: count() }).from(leads);
    const [qualifiedResult] = await db.select({ count: count() }).from(leads)
      .where(eq(leads.status, 'qualified'));
    const [enrolledResult] = await db.select({ count: count() }).from(leads)
      .where(eq(leads.status, 'enrolled'));

    // Get active leads (new, contacted, qualified)
    const [activeLeadsResult] = await db.select({ count: count() }).from(leads)
      .where(and(
        eq(leads.status, 'new'),
        eq(leads.status, 'contacted'),
        eq(leads.status, 'qualified')
      ));

    // Get today's revenue
    const [revenueResult] = await db.select({ 
      total: sum(payments.amount) 
    }).from(payments)
      .where(and(
        eq(payments.status, 'completed'),
        gte(payments.createdAt, today),
        lte(payments.createdAt, tomorrow)
      ));

    // Get monthly revenue
    const [monthlyRevenueResult] = await db.select({
      total: sum(payments.amount)
    }).from(payments)
      .where(and(
        eq(payments.status, 'completed'),
        gte(payments.createdAt, monthStart)
      ));

    // Get average deal size
    const [avgDealResult] = await db.select({
      avg: avg(payments.amount)
    }).from(payments)
      .where(eq(payments.status, 'completed'));

    // Get call metrics
    const [callCountResult] = await db.select({ count: count() }).from(callRecords);
    const [avgConfidenceResult] = await db.select({
      avg: avg(agentMetrics.confidence)
    }).from(agentMetrics);
    const [avgResponseTimeResult] = await db.select({
      avg: avg(agentMetrics.responseTimeMs)
    }).from(agentMetrics);

    const totalLeads = totalLeadsResult?.count || 0;
    const qualified = qualifiedResult?.count || 0;
    const enrolled = enrolledResult?.count || 0;
    const totalCalls = callCountResult?.count || 0;

    const conversionRate = totalLeads > 0 ? (enrolled / totalLeads) * 100 : 0;
    const enrollmentRate = qualified > 0 ? (enrolled / qualified) * 100 : 0;
    const agentPerformance = Number(avgConfidenceResult?.avg || 0) * 100;
    const aiPerformance = agentPerformance;
    const responseTime = Number(avgResponseTimeResult?.avg || 1300) / 1000; // Convert to seconds

    return {
      activeLeads: activeLeadsResult?.count || totalLeads,
      conversionRate: Number(conversionRate.toFixed(1)),
      revenueToday: Number(revenueResult?.total || 0),
      agentPerformance: Number(agentPerformance.toFixed(1)),
      totalLeads,
      qualified,
      enrolled,
      totalCalls,
      monthlyRevenue: Number(monthlyRevenueResult?.total || 0),
      avgDealSize: Number(avgDealResult?.avg || 0),
      aiPerformance: Number(aiPerformance.toFixed(1)),
      responseTime: Number(responseTime.toFixed(1)),
      enrollmentRate: Number(enrollmentRate.toFixed(1)),
    };
  }
}

export const storage = new DatabaseStorage();
