import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Phone, Edit, Filter, Users } from "lucide-react";
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

  const getEnterpriseColor = (license: string) => {
    switch (license) {
      case "2-15": return "bg-blue-100 text-blue-800";
      case "2-40": return "bg-purple-100 text-purple-800";
      case "2-14": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEnterpriseStatusColor = (status: string) => {
    switch (status) {
      case "qualified": return "bg-purple-100 text-purple-800";
      case "enrolled": return "bg-green-100 text-green-800";
      case "contacted": return "bg-blue-100 text-blue-800";
      case "new": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "qualified": return "bg-purple-500";
      case "enrolled": return "bg-green-500";
      case "contacted": return "bg-blue-500";
      case "new": return "bg-yellow-500";
      default: return "bg-gray-500";
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
      {/* Enhanced Filter Controls */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Prospect Filters</h3>
              <p className="text-sm text-slate-600">Filter and search through your lead database</p>
            </div>
            <div className="text-sm text-slate-500">
              {filteredLeads.length} of {leads.length} leads
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="border-slate-300 bg-white">
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
              <SelectTrigger className="border-slate-300 bg-white">
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
              <SelectTrigger className="border-slate-300 bg-white">
                <SelectValue placeholder="All Licenses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Licenses</SelectItem>
                <SelectItem value="2-15">2-15 (Life & Health)</SelectItem>
                <SelectItem value="2-40">2-40 (Property & Casualty)</SelectItem>
                <SelectItem value="2-14">2-14 (Personal Lines)</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-slate-900 hover:bg-slate-800 text-white">
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Enterprise Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Prospect</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Contact Information</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">License Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Source</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-slate-500">
                      <Users className="mx-auto h-8 w-8 mb-2" />
                      <p className="text-sm">No leads found matching the current filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {lead.firstName} {lead.lastName}
                          </div>
                          <div className="text-sm text-slate-500">
                            Added {new Date(lead.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{lead.phone}</div>
                      <div className="text-sm text-slate-500">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEnterpriseColor(lead.licenseGoal)}`}>
                        {lead.licenseGoal} License
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEnterpriseStatusColor(lead.status)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(lead.status)}`}></div>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 capitalize">
                        {lead.source.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-600 hover:text-green-600 hover:bg-green-50"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-600 hover:text-purple-600 hover:bg-purple-50"
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
