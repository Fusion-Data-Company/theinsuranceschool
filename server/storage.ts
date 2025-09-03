import { 
  users, leads, callRecords, payments, enrollments, webhookLogs, agentMetrics, n8nChatHistories, appointments, enrollmentDocuments,
  type User, type InsertUser, type Lead, type InsertLead, type CallRecord, 
  type InsertCallRecord, type Payment, type InsertPayment, type Enrollment, 
  type InsertEnrollment, type WebhookLog, type InsertWebhookLog, 
  type AgentMetric, type InsertAgentMetric, type N8nChatHistory, type InsertN8nChatHistory,
  type Appointment, type InsertAppointment, type EnrollmentDocument, type InsertEnrollmentDocument
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, avg, sum, and, gte, lte, or } from "drizzle-orm";

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
  getAllWebhookLogs(): Promise<WebhookLog[]>;
  createWebhookLog(webhookLog: InsertWebhookLog): Promise<WebhookLog>;

  // Agent Metrics
  getAllAgentMetrics(): Promise<AgentMetric[]>;
  createAgentMetric(agentMetric: InsertAgentMetric): Promise<AgentMetric>;

  // N8n Chat Histories
  getAllN8nChatHistories(): Promise<N8nChatHistory[]>;
  createN8nChatHistory(chatHistory: InsertN8nChatHistory): Promise<N8nChatHistory>;
  updateN8nChatHistory(id: number, updates: Partial<InsertN8nChatHistory>): Promise<N8nChatHistory | undefined>;

  // Appointments
  getAllAppointments(): Promise<Appointment[]>;
  getAppointmentsByLeadId(leadId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, updates: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;

  // Enrollment Documents
  getAllEnrollmentDocuments(): Promise<EnrollmentDocument[]>;
  getEnrollmentDocumentById(id: number): Promise<EnrollmentDocument | undefined>;
  getEnrollmentDocumentsByEnrollmentId(enrollmentId: number): Promise<EnrollmentDocument[]>;
  createEnrollmentDocument(document: InsertEnrollmentDocument): Promise<EnrollmentDocument>;
  updateEnrollmentDocument(id: number, updates: Partial<InsertEnrollmentDocument>): Promise<EnrollmentDocument | undefined>;
  deleteEnrollmentDocument(id: number): Promise<boolean>;

  // Analytics
  getAnalytics(): Promise<{
    activeLeads: number;
    activeLeadsChange: number;
    qualifiedLeads: number;
    enrolledStudents: number;
    conversionRate: number;
    conversionRateChange: number;
    monthlyRevenue: number;
    revenueChange: number;
    avgDealSize: number;
    outstandingPayments: number;
    paymentPlanActive: number;
    appointmentShowRate: number;
    totalAppointments: number;
    courseEnrollmentBreakdown: Record<string, number>;
    sourceBreakdown: Record<string, {
      leads: number;
      converted: number;
      rate: number;
    }>;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Leads
  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLeadById(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async getLeadByPhone(phone: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.phone, phone));
    return lead;
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return newLead;
  }

  async updateLead(id: number, updates: Partial<InsertLead>): Promise<Lead | undefined> {
    const [updatedLead] = await db.update(leads).set(updates).where(eq(leads.id, id)).returning();
    return updatedLead;
  }

  // Call Records
  async getAllCallRecords(): Promise<CallRecord[]> {
    return await db.select().from(callRecords).orderBy(desc(callRecords.createdAt));
  }

  async getCallRecordsByLeadId(leadId: number): Promise<CallRecord[]> {
    return await db.select().from(callRecords).where(eq(callRecords.leadId, leadId)).orderBy(desc(callRecords.createdAt));
  }

  async createCallRecord(callRecord: InsertCallRecord): Promise<CallRecord> {
    const [newCallRecord] = await db.insert(callRecords).values(callRecord).returning();
    return newCallRecord;
  }

  // Payments
  async getAllPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.createdAt));
  }

  async getPaymentsByLeadId(leadId: number): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.leadId, leadId)).orderBy(desc(payments.createdAt));
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async updatePayment(id: number, updates: Partial<InsertPayment>): Promise<Payment | undefined> {
    const [updatedPayment] = await db.update(payments).set(updates).where(eq(payments.id, id)).returning();
    return updatedPayment;
  }

  // Enrollments
  async getAllEnrollments(): Promise<Enrollment[]> {
    return await db.select().from(enrollments).orderBy(desc(enrollments.createdAt));
  }

  async getEnrollmentsByLeadId(leadId: number): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.leadId, leadId)).orderBy(desc(enrollments.createdAt));
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db.insert(enrollments).values(enrollment).returning();
    return newEnrollment;
  }

  async updateEnrollment(id: number, updates: Partial<InsertEnrollment>): Promise<Enrollment | undefined> {
    const [updatedEnrollment] = await db.update(enrollments).set(updates).where(eq(enrollments.id, id)).returning();
    return updatedEnrollment;
  }

  // Webhook Logs
  async getAllWebhookLogs(): Promise<WebhookLog[]> {
    return await db.select().from(webhookLogs).orderBy(desc(webhookLogs.createdAt));
  }

  async createWebhookLog(webhookLog: InsertWebhookLog): Promise<WebhookLog> {
    const [newWebhookLog] = await db.insert(webhookLogs).values(webhookLog).returning();
    return newWebhookLog;
  }

  // Agent Metrics
  async getAllAgentMetrics(): Promise<AgentMetric[]> {
    return await db.select().from(agentMetrics).orderBy(desc(agentMetrics.createdAt));
  }

  async createAgentMetric(agentMetric: InsertAgentMetric): Promise<AgentMetric> {
    const [newAgentMetric] = await db.insert(agentMetrics).values(agentMetric).returning();
    return newAgentMetric;
  }

  // N8n Chat Histories
  async getAllN8nChatHistories(): Promise<N8nChatHistory[]> {
    return await db.select().from(n8nChatHistories).orderBy(desc(n8nChatHistories.createdAt));
  }

  async createN8nChatHistory(chatHistory: InsertN8nChatHistory): Promise<N8nChatHistory> {
    const [newChatHistory] = await db.insert(n8nChatHistories).values(chatHistory).returning();
    return newChatHistory;
  }

  async updateN8nChatHistory(id: number, updates: Partial<InsertN8nChatHistory>): Promise<N8nChatHistory | undefined> {
    const [updatedChatHistory] = await db.update(n8nChatHistories).set(updates).where(eq(n8nChatHistories.id, id)).returning();
    return updatedChatHistory;
  }

  // Appointments
  async getAllAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments).orderBy(desc(appointments.createdAt));
  }

  async getAppointmentsByLeadId(leadId: number): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.leadId, leadId)).orderBy(desc(appointments.createdAt));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }

  async updateAppointment(id: number, updates: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [updatedAppointment] = await db.update(appointments).set(updates).where(eq(appointments.id, id)).returning();
    return updatedAppointment;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    const result = await db.delete(appointments).where(eq(appointments.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Enrollment Documents
  async getAllEnrollmentDocuments(): Promise<EnrollmentDocument[]> {
    return await db.select().from(enrollmentDocuments).orderBy(desc(enrollmentDocuments.createdAt));
  }

  async getEnrollmentDocumentById(id: number): Promise<EnrollmentDocument | undefined> {
    const [document] = await db.select().from(enrollmentDocuments).where(eq(enrollmentDocuments.id, id));
    return document;
  }

  async getEnrollmentDocumentsByEnrollmentId(enrollmentId: number): Promise<EnrollmentDocument[]> {
    return await db.select().from(enrollmentDocuments)
      .where(eq(enrollmentDocuments.enrollmentId, enrollmentId))
      .orderBy(desc(enrollmentDocuments.createdAt));
  }

  async createEnrollmentDocument(document: InsertEnrollmentDocument): Promise<EnrollmentDocument> {
    const [newDocument] = await db.insert(enrollmentDocuments).values(document).returning();
    return newDocument;
  }

  async updateEnrollmentDocument(id: number, updates: Partial<InsertEnrollmentDocument>): Promise<EnrollmentDocument | undefined> {
    const [updatedDocument] = await db.update(enrollmentDocuments)
      .set(updates)
      .where(eq(enrollmentDocuments.id, id))
      .returning();
    return updatedDocument;
  }

  async deleteEnrollmentDocument(id: number): Promise<boolean> {
    const result = await db.delete(enrollmentDocuments).where(eq(enrollmentDocuments.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Analytics - School Administration Focus
  async getAnalytics(): Promise<{
    activeLeads: number;
    activeLeadsChange: number;
    qualifiedLeads: number;
    enrolledStudents: number;
    conversionRate: number;
    conversionRateChange: number;
    monthlyRevenue: number;
    revenueChange: number;
    avgDealSize: number;
    outstandingPayments: number;
    paymentPlanActive: number;
    appointmentShowRate: number;
    totalAppointments: number;
    courseEnrollmentBreakdown: Record<string, number>;
    sourceBreakdown: Record<string, {
      leads: number;
      converted: number;
      rate: number;
    }>;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(weekAgo);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get active leads (new, contacted, qualified, hot_lead, returning_customer)
    const [activeLeadsResult] = await db.select({ count: count() }).from(leads)
      .where(or(
        eq(leads.status, 'new'),
        eq(leads.status, 'contacted'),
        eq(leads.status, 'qualified'),
        eq(leads.status, 'hot_lead'),
        eq(leads.status, 'returning_customer')
      ));

    // Get yesterday's active leads for comparison
    const [yesterdayActiveLeadsResult] = await db.select({ count: count() }).from(leads)
      .where(and(
        or(
          eq(leads.status, 'new'),
          eq(leads.status, 'contacted'),
          eq(leads.status, 'qualified'),
          eq(leads.status, 'hot_lead'),
          eq(leads.status, 'returning_customer')
        ),
        gte(leads.createdAt, yesterday),
        lte(leads.createdAt, today)
      ));

    // Get qualified leads count
    const [qualifiedLeadsResult] = await db.select({ count: count() }).from(leads)
      .where(eq(leads.status, 'qualified'));

    // Get enrolled students count
    const [enrolledStudentsResult] = await db.select({ count: count() }).from(leads)
      .where(eq(leads.status, 'enrolled'));

    // Get this week's conversion rate data
    const [thisWeekLeadsResult] = await db.select({ count: count() }).from(leads)
      .where(gte(leads.createdAt, weekAgo));
    const [thisWeekEnrolledResult] = await db.select({ count: count() }).from(leads)
      .where(and(
        eq(leads.status, 'enrolled'),
        gte(leads.createdAt, weekAgo)
      ));

    // Get last week's conversion rate data
    const [lastWeekLeadsResult] = await db.select({ count: count() }).from(leads)
      .where(and(
        gte(leads.createdAt, twoWeeksAgo),
        lte(leads.createdAt, weekAgo)
      ));
    const [lastWeekEnrolledResult] = await db.select({ count: count() }).from(leads)
      .where(and(
        eq(leads.status, 'enrolled'),
        gte(leads.createdAt, twoWeeksAgo),
        lte(leads.createdAt, weekAgo)
      ));

    // Get monthly revenue
    const [monthlyRevenueResult] = await db.select({
      total: sum(payments.amount)
    }).from(payments)
      .where(and(
        eq(payments.status, 'completed'),
        gte(payments.createdAt, monthStart)
      ));

    // Get last month's revenue for comparison
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    const [lastMonthRevenueResult] = await db.select({
      total: sum(payments.amount)
    }).from(payments)
      .where(and(
        eq(payments.status, 'completed'),
        gte(payments.createdAt, lastMonthStart),
        lte(payments.createdAt, lastMonthEnd)
      ));

    // Get average deal size
    const [avgDealResult] = await db.select({
      avg: avg(payments.amount)
    }).from(payments)
      .where(eq(payments.status, 'completed'));

    // Get outstanding payments
    const [outstandingPaymentsResult] = await db.select({
      total: sum(payments.amount)
    }).from(payments)
      .where(or(
        eq(payments.status, 'pending'),
        eq(payments.status, 'processing'),
        eq(payments.status, 'failed')
      ));

    // Get active payment plans count
    const [paymentPlansResult] = await db.select({ count: count() }).from(payments)
      .where(eq(payments.planChosen, 'payment_plan'));

    // Get appointment metrics
    const [totalAppointmentsResult] = await db.select({ count: count() }).from(appointments);
    const [completedAppointmentsResult] = await db.select({ count: count() }).from(appointments)
      .where(eq(appointments.status, 'completed'));

    // Get course enrollment breakdown
    const courseBreakdown = await db.select({
      licenseGoal: leads.licenseGoal,
      count: count()
    }).from(leads)
      .where(eq(leads.status, 'enrolled'))
      .groupBy(leads.licenseGoal);

    // Get lead source performance
    const sourcePerformance = await db.select({
      source: leads.source,
      totalLeads: count(),
    }).from(leads)
      .groupBy(leads.source);

    const sourceConversions = await db.select({
      source: leads.source,
      converted: count()
    }).from(leads)
      .where(eq(leads.status, 'enrolled'))
      .groupBy(leads.source);

    // Build source breakdown with conversion rates
    const sourceBreakdown: Record<string, { leads: number; converted: number; rate: number }> = {};
    
    sourcePerformance.forEach(source => {
      const converted = sourceConversions.find(c => c.source === source.source)?.converted || 0;
      sourceBreakdown[source.source] = {
        leads: source.totalLeads,
        converted: converted,
        rate: source.totalLeads > 0 ? (converted / source.totalLeads) * 100 : 0
      };
    });

    // Calculate metrics
    const activeLeads = activeLeadsResult.count;
    const yesterdayActiveLeads = yesterdayActiveLeadsResult.count;
    
    const thisWeekLeads = thisWeekLeadsResult.count;
    const thisWeekEnrolled = thisWeekEnrolledResult.count;
    const lastWeekLeads = lastWeekLeadsResult.count;
    const lastWeekEnrolled = lastWeekEnrolledResult.count;

    const thisWeekConversionRate = thisWeekLeads > 0 ? (thisWeekEnrolled / thisWeekLeads) * 100 : 0;
    const lastWeekConversionRate = lastWeekLeads > 0 ? (lastWeekEnrolled / lastWeekLeads) * 100 : 0;

    const monthlyRevenue = Number(monthlyRevenueResult?.total || 0);
    const lastMonthRevenue = Number(lastMonthRevenueResult?.total || 0);

    // Calculate percentage changes
    const activeLeadsChange = yesterdayActiveLeads > 0 ? 
      ((activeLeads - yesterdayActiveLeads) / yesterdayActiveLeads) * 100 : 0;
    
    const revenueChange = lastMonthRevenue > 0 ? 
      ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;
    
    const conversionRateChange = lastWeekConversionRate > 0 ? 
      thisWeekConversionRate - lastWeekConversionRate : 0;

    // Calculate appointment show rate
    const appointmentShowRate = totalAppointmentsResult.count > 0 ? 
      (completedAppointmentsResult.count / totalAppointmentsResult.count) * 100 : 0;

    return {
      // Student Pipeline
      activeLeads,
      activeLeadsChange: Number(activeLeadsChange.toFixed(1)),
      qualifiedLeads: qualifiedLeadsResult.count,
      enrolledStudents: enrolledStudentsResult.count,
      conversionRate: Number(thisWeekConversionRate.toFixed(1)),
      conversionRateChange: Number(conversionRateChange.toFixed(1)),

      // Financial Metrics
      monthlyRevenue,
      revenueChange: Number(revenueChange.toFixed(1)),
      avgDealSize: Number(avgDealResult?.avg || 0),
      outstandingPayments: Number(outstandingPaymentsResult.total) || 0,
      paymentPlanActive: paymentPlansResult.count,

      // Operational Metrics
      appointmentShowRate: Number(appointmentShowRate.toFixed(1)),
      totalAppointments: totalAppointmentsResult.count,

      // Course & Source Analytics
      courseEnrollmentBreakdown: courseBreakdown.reduce((acc, course) => {
        acc[course.licenseGoal] = course.count;
        return acc;
      }, {} as Record<string, number>),
      
      sourceBreakdown: sourceBreakdown
    };
  }
}

export const storage = new DatabaseStorage();