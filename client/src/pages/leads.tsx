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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Dark Enterprise Hero Section */}
      <div className="pt-20 pb-8 bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-6">
                <div className="flex items-center px-4 py-2 card-glass border-electric-cyan/40 rounded-full text-electric-cyan text-sm font-bold backdrop-blur-lg">
                  <Shield className="w-4 h-4 mr-2" />
                  Enterprise Lead Intelligence
                </div>
                <div className="ml-4 px-3 py-1.5 card-glass border-green-500/40 rounded-full text-green-400 text-xs font-bold backdrop-blur-lg">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2"></div>
                  Live Data Stream
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white via-electric-cyan to-fuchsia bg-clip-text text-transparent">
                  Prospect Pipeline
                </span>
              </h1>
              
              <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                Advanced lead intelligence platform with real-time behavioral analytics, 
                AI-powered qualification scoring, and enterprise-grade pipeline management.
              </p>
            </div>

            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="btn-glass-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Prospect
                </Button>
                <Button className="btn-glass">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-12">
            <div className="card-glass border-slate-700/50 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Total Pipeline</p>
                    <p className="text-3xl font-bold text-white mt-1">{totalLeads}</p>
                    <p className="text-xs text-green-400 mt-1">+12% this month</p>
                  </div>
                  <div className="p-3 bg-electric-cyan/20 rounded-xl">
                    <Users className="w-6 h-6 text-electric-cyan" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card-glass border-slate-700/50 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">New Prospects</p>
                    <p className="text-3xl font-bold text-white mt-1">{newLeads}</p>
                    <p className="text-xs text-yellow-400 mt-1">+3 today</p>
                  </div>
                  <div className="p-3 bg-yellow-500/20 rounded-xl">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card-glass border-slate-700/50 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Qualified</p>
                    <p className="text-3xl font-bold text-white mt-1">{qualifiedLeads}</p>
                    <p className="text-xs text-vibrant-purple mt-1">Hot prospects</p>
                  </div>
                  <div className="p-3 bg-vibrant-purple/20 rounded-xl">
                    <Target className="w-6 h-6 text-vibrant-purple" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card-glass border-slate-700/50 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Enrolled</p>
                    <p className="text-3xl font-bold text-white mt-1">{enrolledLeads}</p>
                    <p className="text-xs text-green-400 mt-1">Revenue active</p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card-glass border-slate-700/50 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Conversion</p>
                    <p className="text-3xl font-bold text-white mt-1">{conversionRate}%</p>
                    <p className="text-xs text-fuchsia mt-1">Pipeline efficiency</p>
                  </div>
                  <div className="p-3 bg-fuchsia/20 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-fuchsia" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <LeadsTable />
      </div>
    </div>
  );
}
