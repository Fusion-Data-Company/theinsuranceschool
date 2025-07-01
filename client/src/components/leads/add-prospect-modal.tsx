import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, User, Phone, Mail, Target } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertLead } from "@shared/schema";

interface AddProspectModalProps {
  children: React.ReactNode;
}

export function AddProspectModal({ children }: AddProspectModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    licenseGoal: "",
    source: "website"
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createProspectMutation = useMutation({
    mutationFn: async (data: InsertLead) => {
      return apiRequest("POST", "/api/leads", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Success",
        description: "Prospect added successfully",
      });
      setOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        licenseGoal: "",
        source: "website"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add prospect",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.licenseGoal) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createProspectMutation.mutate({
      ...formData,
      status: "new"
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 max-w-md text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center">
            <User className="w-5 h-5 mr-2 text-electric-cyan" />
            Add New Prospect
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Enter prospect information to add them to your lead pipeline.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-slate-300">
                First Name *
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-slate-300">
                Last Name *
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                placeholder="Smith"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-slate-300 flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
              placeholder="(555) 123-4567"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-slate-300 flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
              placeholder="john.smith@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenseGoal" className="text-sm font-medium text-slate-300 flex items-center">
              <Target className="w-4 h-4 mr-1" />
              License Goal *
            </Label>
            <Select value={formData.licenseGoal} onValueChange={(value) => handleInputChange("licenseGoal", value)}>
              <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                <SelectValue placeholder="Select license type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="2-15">2-15 (Life & Health)</SelectItem>
                <SelectItem value="2-40">2-40 (Property & Casualty)</SelectItem>
                <SelectItem value="2-14">2-14 (Personal Lines)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source" className="text-sm font-medium text-slate-300">
              Lead Source
            </Label>
            <Select value={formData.source} onValueChange={(value) => handleInputChange("source", value)}>
              <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="voice_agent">Voice Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="btn-glass flex-1"
              disabled={createProspectMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-glass-primary flex-1"
              disabled={createProspectMutation.isPending}
            >
              {createProspectMutation.isPending ? "Adding..." : "Add Prospect"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}