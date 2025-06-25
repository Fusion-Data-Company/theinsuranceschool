import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Phone, Edit, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Lead } from "@shared/schema";

export function LeadsTable() {
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [licenseFilter, setLicenseFilter] = useState("all");

  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const filteredLeads = leads.filter(lead => {
    if (sourceFilter !== "all" && lead.source !== sourceFilter) return false;
    if (statusFilter !== "all" && lead.status !== statusFilter) return false;
    if (licenseFilter !== "all" && lead.licenseGoal !== licenseFilter) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "qualified": return "bg-vibrant-purple/20 text-vibrant-purple";
      case "enrolled": return "bg-green-500/20 text-green-400";
      case "contacted": return "bg-electric-cyan/20 text-electric-cyan";
      case "new": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getLicenseColor = (license: string) => {
    switch (license) {
      case "2-15": return "bg-electric-cyan/20 text-electric-cyan";
      case "2-40": return "bg-fuchsia/20 text-fuchsia";
      case "2-14": return "bg-neon-magenta/20 text-neon-magenta";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="card-glass p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/20 rounded"></div>
          <div className="h-64 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lead Filters */}
      <div className="card-glass p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="form-glass">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="voice_agent">Voice Agent</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="form-glass">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="enrolled">Enrolled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={licenseFilter} onValueChange={setLicenseFilter}>
            <SelectTrigger className="form-glass">
              <SelectValue placeholder="All Licenses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Licenses</SelectItem>
              <SelectItem value="2-15">2-15 (Life & Health)</SelectItem>
              <SelectItem value="2-40">2-40 (Property & Casualty)</SelectItem>
              <SelectItem value="2-14">2-14 (Personal Lines)</SelectItem>
            </SelectContent>
          </Select>

          <Button className="btn-glass">
            <Filter className="mr-2 h-4 w-4" />
            Filter Leads
          </Button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="card-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black-glass">
              <tr>
                <th className="px-6 py-4 text-left text-white font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Contact</th>
                <th className="px-6 py-4 text-left text-white font-semibold">License Goal</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Source</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No leads found matching the current filters
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-black-glass/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">
                        {lead.firstName} {lead.lastName}
                      </div>
                      <div className="text-gray-400 text-sm">
                        Added {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{lead.phone}</div>
                      <div className="text-gray-400 text-sm">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getLicenseColor(lead.licenseGoal)}`}>
                        {lead.licenseGoal} License
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 capitalize">
                        {lead.source.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-electric-cyan hover:text-white hover:bg-electric-cyan/20"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-fuchsia hover:text-white hover:bg-fuchsia/20"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-neon-magenta hover:text-white hover:bg-neon-magenta/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
