import { apiRequest } from "./queryClient";
import type { InsertLead, InsertCallRecord, InsertPayment, InsertEnrollment } from "@shared/schema";

export const api = {
  // Leads
  getLeads: () => apiRequest("GET", "/api/leads"),
  getLead: (id: number) => apiRequest("GET", `/api/leads/${id}`),
  createLead: (data: InsertLead) => apiRequest("POST", "/api/leads", data),
  updateLead: (id: number, data: Partial<InsertLead>) => apiRequest("PATCH", `/api/leads/${id}`, data),

  // Call Records
  getCallRecords: () => apiRequest("GET", "/api/call-records"),

  // Payments
  getPayments: () => apiRequest("GET", "/api/payments"),
  createPayment: (data: InsertPayment) => apiRequest("POST", "/api/payments", data),

  // Enrollments
  getEnrollments: () => apiRequest("GET", "/api/enrollments"),
  createEnrollment: (data: InsertEnrollment) => apiRequest("POST", "/api/enrollments", data),

  // Analytics
  getAnalytics: () => apiRequest("GET", "/api/analytics"),

  // Webhooks
  aiQuery: (query: string) => apiRequest("POST", "/api/webhooks/internal-query", { query }),
  elevenlabsCall: (callData: any) => apiRequest("POST", "/api/webhooks/elevenlabs-call", callData),
};
