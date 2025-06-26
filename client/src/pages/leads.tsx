import { LeadsTable } from "@/components/leads/leads-table";
import { Shield } from "lucide-react";

export default function Leads() {
  return (
    <div className="pt-20 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-electric-cyan/20 border border-electric-cyan/30 rounded-full text-electric-cyan text-sm font-medium mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Enterprise-Grade CRM
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-center">
            <span className="text-fuchsia">Lead</span>{" "}
            <span className="text-white">Management</span>
          </h2>
        </div>

        <LeadsTable />
      </div>
    </div>
  );
}
