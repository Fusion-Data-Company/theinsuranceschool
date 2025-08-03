import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Phone, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";

interface LeadFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  licenseGoal: string;
  painPoints: string;
  employmentStatus: string;
  urgencyLevel: string;
  paymentPreference: string;
  paymentStatus: 'PAID' | 'NOT_PAID';
  confirmationNumber?: string;
  agentName: string;
  supervisor: string;
  leadSource: string;
  callSummary: string;
  conversationId: string;
}

export default function SMSTest() {
  const [formData, setFormData] = useState<LeadFormData>({
    firstName: 'Jessica',
    lastName: 'Thompson', 
    phone: '+15551234567',
    email: 'jessica.thompson@example.com',
    licenseGoal: '2-15',
    painPoints: 'Single mom needs extra income to support kids',
    employmentStatus: 'Part-time receptionist',
    urgencyLevel: 'High - needs income boost ASAP',
    paymentPreference: 'Payment plan - $299 down, $99/month',
    paymentStatus: 'NOT_PAID',
    confirmationNumber: '',
    agentName: 'Bandit AI',
    supervisor: 'Kelli Kirk',
    leadSource: 'ElevenLabs Voice Agent',
    callSummary: 'Very interested in getting licensed quickly, concerned about study time with kids, wants flexible payment options',
    conversationId: 'conv_test_' + Date.now()
  });

  const testSMSMutation = useMutation({
    mutationFn: () => apiRequest('/api/test-sms', 'POST'),
    onSuccess: () => {
      toast({
        title: "Test SMS Sent! 📱",
        description: "SMS notification sent to +14074013100 from +16894076645",
      });
    },
    onError: (error: any) => {
      toast({
        title: "SMS Test Failed",
        description: error.message || "Failed to send test SMS",
        variant: "destructive",
      });
    }
  });

  const processLeadMutation = useMutation({
    mutationFn: (data: LeadFormData) => apiRequest('/api/webhooks/n8n-lead-processor', 'POST', data),
    onSuccess: (response: any) => {
      toast({
        title: "Lead Processed & SMS Sent! 🎯",
        description: `${response.action === 'created' ? 'Created' : 'Updated'} lead ${response.leadId} with SMS notification`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lead Processing Failed",
        description: error.message || "Failed to process lead",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: keyof LeadFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTestSMS = () => {
    testSMSMutation.mutate();
  };

  const handleProcessLead = () => {
    processLeadMutation.mutate(formData);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">SMS Integration Test Center</h1>
        <p className="text-slate-400">Test Twilio SMS notifications for the Insurance School CRM system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SMS Configuration Panel */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Phone className="h-5 w-5 text-cyan-400" />
              SMS Configuration
            </CardTitle>
            <CardDescription>
              Twilio integration using second account credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-300">From Phone Number</Label>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-500">
                  +16894076645
                </Badge>
                <span className="text-xs text-slate-400">TWILIO_PHONE_NUMBER_2</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-300">To Phone Number (Fixed)</Label>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-500">
                  +14074013100
                </Badge>
                <span className="text-xs text-slate-400">Supervisor notification line</span>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleTestSMS} 
                disabled={testSMSMutation.isPending}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {testSMSMutation.isPending ? (
                  "Sending Test SMS..."
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Test SMS
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Message Templates Preview */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Message Templates</CardTitle>
            <CardDescription>
              SMS templates based on payment status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-green-400">PAID Lead Message</Label>
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                <p className="text-sm text-green-300">
                  💰 NEW ENROLLMENT! {formData.firstName} {formData.lastName} just paid for {formData.licenseGoal} license. 
                  Payment confirmed: {formData.confirmationNumber || 'Pending'}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-orange-400">NOT_PAID Lead Message</Label>
              <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
                <p className="text-sm text-orange-300">
                  🎯 HOT LEAD: {formData.firstName} {formData.lastName} wants {formData.licenseGoal} license. 
                  {formData.urgencyLevel} to start. Needs follow-up!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Data Form */}
      <Card className="mt-6 bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Enhanced Lead Data Form</CardTitle>
          <CardDescription>
            Complete lead information with all 12 enhanced fields for SMS testing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">First Name</Label>
              <Input 
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Last Name</Label>
              <Input 
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Phone</Label>
              <Input 
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Email</Label>
              <Input 
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">License Goal</Label>
              <Select value={formData.licenseGoal} onValueChange={(value) => handleInputChange('licenseGoal', value)}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-15">2-15 Property & Casualty</SelectItem>
                  <SelectItem value="2-40">2-40 Customer Representative</SelectItem>
                  <SelectItem value="2-14">2-14 Personal Lines</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Payment Status</Label>
              <Select value={formData.paymentStatus} onValueChange={(value: 'PAID' | 'NOT_PAID') => handleInputChange('paymentStatus', value)}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NOT_PAID">NOT_PAID</SelectItem>
                  <SelectItem value="PAID">PAID</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Pain Points</Label>
              <Input 
                value={formData.painPoints}
                onChange={(e) => handleInputChange('painPoints', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Employment Status</Label>
              <Input 
                value={formData.employmentStatus}
                onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Urgency Level</Label>
              <Input 
                value={formData.urgencyLevel}
                onChange={(e) => handleInputChange('urgencyLevel', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Agent Name</Label>
              <Input 
                value={formData.agentName}
                onChange={(e) => handleInputChange('agentName', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <Label className="text-slate-300">Call Summary</Label>
              <Textarea 
                value={formData.callSummary}
                onChange={(e) => handleInputChange('callSummary', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
                rows={3}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <Button 
              onClick={handleProcessLead} 
              disabled={processLeadMutation.isPending}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
              size="lg"
            >
              {processLeadMutation.isPending ? (
                "Processing Lead & Sending SMS..."
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Process Lead & Send SMS Notification
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}