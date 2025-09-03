import { Button } from "@/components/ui/button";
import { PlusCircle, Phone, Download, Headphones, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function QuickActions() {
  const { toast } = useToast();

  const actions = {
    addLead: () => {
      // Find and trigger the Add Prospect modal
      const addButton = document.querySelector('[data-add-prospect-trigger]') as HTMLElement;
      if (addButton) {
        addButton.click();
      } else {
        toast({ 
          title: "Lead Creation", 
          description: "Navigate to Prospects page to add new leads" 
        });
      }
    },
    viewCallRecords: () => {
      window.location.href = '/leads'; // Navigate to leads which shows call records
    },
    exportData: () => {
      // Export current data to CSV
      const currentDate = new Date().toISOString().split('T')[0];
      toast({ 
        title: "Data Export", 
        description: "Export functionality available on Prospects page" 
      });
    },
  };

  return (
    <div className="space-y-6">

      {/* Quick Lead Actions */}
      <div className="card-glass p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <PlusCircle className="text-fuchsia mr-3" />
          Quick Actions
        </h3>
        <div className="space-y-3">
          <Button 
            className="btn-glass w-full justify-start" 
            onClick={actions.addLead}
          >
            <PlusCircle className="mr-3 h-4 w-4" />
            Add New Lead
          </Button>
          <Button 
            className="btn-glass w-full justify-start" 
            onClick={actions.viewCallRecords}
          >
            <Phone className="mr-3 h-4 w-4" />
            View Call Records
          </Button>
          <Button 
            className="btn-glass w-full justify-start" 
            onClick={actions.exportData}
          >
            <Download className="mr-3 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Voice Agent Status */}
      <div className="card-glass p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Headphones className="text-neon-magenta mr-3" />
          Agent Status
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Primary Agent</span>
            <span className="text-green-400 font-semibold flex items-center">
              <Circle className="h-2 w-2 fill-current mr-1" />
              Online
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Backup Agent</span>
            <span className="text-green-400 font-semibold flex items-center">
              <Circle className="h-2 w-2 fill-current mr-1" />
              Standby
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Calls Today</span>
            <span className="text-white font-semibold">127</span>
          </div>
        </div>
      </div>
    </div>
  );
}