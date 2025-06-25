import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bot, PlusCircle, Phone, Download, Headphones, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function QuickActions() {
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const aiQueryMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest("POST", "/api/webhooks/internal-query", { query });
      return response.json();
    },
    onSuccess: (data) => {
      setAiResponse(data.response);
      toast({
        title: "AI Query Completed",
        description: "Jason Analytics has processed your request.",
      });
    },
    onError: () => {
      toast({
        title: "Query Failed",
        description: "Unable to process your request at this time.",
        variant: "destructive",
      });
    },
  });

  const handleAIQuery = () => {
    if (!aiQuery.trim()) return;
    aiQueryMutation.mutate(aiQuery);
    setAiQuery("");
  };

  const mockActions = {
    addLead: () => toast({ title: "Add Lead", description: "Lead form would open here" }),
    viewCallRecords: () => toast({ title: "Call Records", description: "Call records view would open here" }),
    exportData: () => toast({ title: "Export Started", description: "Data export has been initiated" }),
  };

  return (
    <div className="space-y-6">
      {/* AI Agent Query */}
      <div className="card-glass p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Bot className="text-electric-cyan mr-3" />
          Ask Jason AI
        </h3>
        <div className="space-y-4">
          <Textarea 
            className="form-glass resize-none"
            placeholder="Ask about leads, performance, or any data insights..."
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            rows={3}
          />
          <Button 
            className="btn-glass w-full" 
            onClick={handleAIQuery}
            disabled={aiQueryMutation.isPending || !aiQuery.trim()}
          >
            {aiQueryMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Bot className="mr-2 h-4 w-4" />
            )}
            Send Query
          </Button>
          {aiResponse && (
            <div className="p-4 bg-black-glass rounded border border-electric-cyan/30">
              <p className="text-white text-sm">{aiResponse}</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Lead Actions */}
      <div className="card-glass p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <PlusCircle className="text-fuchsia mr-3" />
          Quick Actions
        </h3>
        <div className="space-y-3">
          <Button 
            className="btn-glass w-full justify-start" 
            onClick={mockActions.addLead}
          >
            <PlusCircle className="mr-3 h-4 w-4" />
            Add New Lead
          </Button>
          <Button 
            className="btn-glass w-full justify-start" 
            onClick={mockActions.viewCallRecords}
          >
            <Phone className="mr-3 h-4 w-4" />
            View Call Records
          </Button>
          <Button 
            className="btn-glass w-full justify-start" 
            onClick={mockActions.exportData}
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
