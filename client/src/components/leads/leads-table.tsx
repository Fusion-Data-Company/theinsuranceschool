import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Phone, Edit, Filter, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Lead } from "@shared/schema";

interface LeadsTableProps {
  filters: {
    source: string;
    status: string;
    license: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function LeadsTable({ filters, onFiltersChange }: LeadsTableProps) {
  const [sourceFilter, setSourceFilter] = useState(filters.source);
  const [statusFilter, setStatusFilter] = useState(filters.status);
  const [licenseFilter, setLicenseFilter] = useState(filters.license);

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

  const getDarkLicenseColor = (license: string) => {
    switch (license) {
      case "2-15": return "bg-electric-cyan/20 text-electric-cyan border-electric-cyan/30";
      case "2-40": return "bg-fuchsia/20 text-fuchsia border-fuchsia/30";
      case "2-14": return "bg-neon-magenta/20 text-neon-magenta border-neon-magenta/30";
      default: return "bg-slate-700/50 text-slate-300 border-slate-600/50";
    }
  };

  const getDarkStatusColor = (status: string) => {
    switch (status) {
      case "qualified": return "bg-vibrant-purple/20 text-vibrant-purple border-vibrant-purple/30";
      case "enrolled": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "contacted": return "bg-electric-cyan/20 text-electric-cyan border-electric-cyan/30";
      case "new": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-slate-700/50 text-slate-300 border-slate-600/50";
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
    <div className="space-y-8">
      {/* Dark Enterprise Filter Controls */}
      <div className="card-glass border-slate-700/50 backdrop-blur-sm">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Intelligence Filters</h3>
              <p className="text-sm text-slate-400 mt-1">Advanced prospect segmentation and search capabilities</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-slate-400">
                <span className="text-electric-cyan font-medium">{filteredLeads.length}</span> of {leads.length} prospects
              </div>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="form-glass border-slate-700/50 text-white">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="voice_agent">🤖 Voice Agent</SelectItem>
                <SelectItem value="website">🌐 Website</SelectItem>
                <SelectItem value="referral">👥 Referral</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="form-glass border-slate-700/50 text-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">🆕 New</SelectItem>
                <SelectItem value="contacted">📞 Contacted</SelectItem>
                <SelectItem value="qualified">✅ Qualified</SelectItem>
                <SelectItem value="enrolled">🎓 Enrolled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={licenseFilter} onValueChange={setLicenseFilter}>
              <SelectTrigger className="form-glass border-slate-700/50 text-white">
                <SelectValue placeholder="All Licenses" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Licenses</SelectItem>
                <SelectItem value="2-15">💼 2-15 (Life & Health)</SelectItem>
                <SelectItem value="2-40">🏠 2-40 (Property & Casualty)</SelectItem>
                <SelectItem value="2-14">🚗 2-14 (Personal Lines)</SelectItem>
              </SelectContent>
            </Select>

            <Button className="btn-glass-primary">
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Dark Enterprise Data Table */}
      <div className="card-glass border-slate-700/50 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-bold text-electric-cyan uppercase tracking-wider">Prospect Profile</th>
                <th className="px-6 py-5 text-left text-sm font-bold text-electric-cyan uppercase tracking-wider">Contact Intelligence</th>
                <th className="px-6 py-5 text-left text-sm font-bold text-electric-cyan uppercase tracking-wider">License Target</th>
                <th className="px-6 py-5 text-left text-sm font-bold text-electric-cyan uppercase tracking-wider">Pipeline Status</th>
                <th className="px-6 py-5 text-left text-sm font-bold text-electric-cyan uppercase tracking-wider">Acquisition Source</th>
                <th className="px-6 py-5 text-left text-sm font-bold text-electric-cyan uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="text-slate-400">
                      <Users className="mx-auto h-12 w-12 mb-4 text-slate-600" />
                      <p className="text-lg font-medium text-slate-300">No prospects match current filters</p>
                      <p className="text-sm text-slate-500 mt-1">Adjust your search criteria to view more results</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/50 transition-all duration-200 border-l-2 border-transparent hover:border-electric-cyan/50">
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-electric-cyan/20 to-fuchsia/20 border border-electric-cyan/30 flex items-center justify-center">
                          <span className="text-sm font-bold text-electric-cyan">
                            {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-white">
                            {lead.firstName} {lead.lastName}
                          </div>
                          <div className="text-xs text-slate-400">
                            Acquired {new Date(lead.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-white font-medium">{lead.phone}</div>
                      <div className="text-xs text-slate-400">{lead.email}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${getDarkLicenseColor(lead.licenseGoal)}`}>
                        {lead.licenseGoal} License
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${getDarkStatusColor(lead.status)}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${getStatusDot(lead.status)}`}></div>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-300 capitalize font-medium">
                        {lead.source.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="btn-glass-icon h-9 w-9 p-0 text-slate-300"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="btn-glass-icon btn-glass-icon-green h-9 w-9 p-0 text-slate-300"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="btn-glass-icon btn-glass-icon-purple h-9 w-9 p-0 text-slate-300"
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
