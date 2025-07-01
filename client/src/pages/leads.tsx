import { LeadsTable } from "@/components/leads/leads-table";
import { Shield, Users, TrendingUp, Target, Clock, Plus, Download, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { Lead } from "@shared/schema";

export default function Leads() {
  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  // Calculate metrics
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(lead => lead.status === 'qualified').length;
  const enrolledLeads = leads.filter(lead => lead.status === 'enrolled').length;
  const newLeads = leads.filter(lead => lead.status === 'new').length;
  const conversionRate = totalLeads > 0 ? Math.round((enrolledLeads / totalLeads) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section with Enterprise Branding */}
      <div className="pt-20 pb-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="flex items-center px-3 py-1.5 bg-blue-100 border border-blue-200 rounded-full text-blue-700 text-sm font-medium">
                  <Shield className="w-4 h-4 mr-2" />
                  Lead Management System
                </div>
                <div className="ml-4 px-3 py-1.5 bg-green-100 border border-green-200 rounded-full text-green-700 text-xs font-medium">
                  Live Data
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Prospect Pipeline
              </h1>
              
              <p className="text-lg text-slate-600 max-w-2xl">
                Comprehensive lead management dashboard with real-time analytics, 
                automated qualification scoring, and enterprise-grade tracking capabilities.
              </p>
            </div>

            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lead
                </Button>
                <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Leads</p>
                  <p className="text-2xl font-bold text-slate-900">{totalLeads}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">New</p>
                  <p className="text-2xl font-bold text-slate-900">{newLeads}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Qualified</p>
                  <p className="text-2xl font-bold text-slate-900">{qualifiedLeads}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Enrolled</p>
                  <p className="text-2xl font-bold text-slate-900">{enrolledLeads}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Conversion</p>
                  <p className="text-2xl font-bold text-slate-900">{conversionRate}%</p>
                </div>
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <LeadsTable />
      </div>
    </div>
  );
}
