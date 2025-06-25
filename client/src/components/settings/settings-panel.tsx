import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Bot, Link, Database, CreditCard, Save, CheckCircle, Clock, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SystemSettings {
  voiceModel: string;
  personality: string;
  maxCallDuration: number;
  webhookLogging: boolean;
  autoEnrollment: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export function SettingsPanel() {
  const [settings, setSettings] = useState<SystemSettings>({
    voiceModel: "elevenlabs-rachel",
    personality: "professional",
    maxCallDuration: 15,
    webhookLogging: true,
    autoEnrollment: false,
    emailNotifications: true,
    smsNotifications: false,
  });
  
  const { toast } = useToast();

  const saveSettingsMutation = useMutation({
    mutationFn: async (settingsData: SystemSettings) => {
      // In production, this would save to backend
      const response = await apiRequest("POST", "/api/settings", settingsData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings Saved",
        description: "Your configuration has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Unable to save settings at this time.",
        variant: "destructive",
      });
    },
  });

  const handleSaveSettings = () => {
    saveSettingsMutation.mutate(settings);
  };

  const updateSetting = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Settings Header */}
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-titanium">System</span>{" "}
          <span className="text-white">Settings</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Configure your Insurance School Annex CRM system preferences and integrations
        </p>
      </div>

      <Tabs defaultValue="ai-agent" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black-glass">
          <TabsTrigger value="ai-agent" className="data-[state=active]:bg-electric-cyan/20 data-[state=active]:text-electric-cyan">
            AI Agent
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="data-[state=active]:bg-fuchsia/20 data-[state=active]:text-fuchsia">
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="database" className="data-[state=active]:bg-vibrant-purple/20 data-[state=active]:text-vibrant-purple">
            Database
          </TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-neon-magenta/20 data-[state=active]:text-neon-magenta">
            Integrations
          </TabsTrigger>
        </TabsList>

        {/* AI Agent Configuration */}
        <TabsContent value="ai-agent">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card-glass p-6">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Bot className="text-electric-cyan mr-3" />
                Voice Agent Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Primary Voice Model</label>
                  <Select 
                    value={settings.voiceModel} 
                    onValueChange={(value) => updateSetting('voiceModel', value)}
                  >
                    <SelectTrigger className="form-glass">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elevenlabs-rachel">ElevenLabs - Rachel (Premium)</SelectItem>
                      <SelectItem value="elevenlabs-josh">ElevenLabs - Josh (Standard)</SelectItem>
                      <SelectItem value="elevenlabs-bella">ElevenLabs - Bella (Conversational)</SelectItem>
                      <SelectItem value="elevenlabs-adam">ElevenLabs - Adam (Professional)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Response Personality</label>
                  <Select 
                    value={settings.personality} 
                    onValueChange={(value) => updateSetting('personality', value)}
                  >
                    <SelectTrigger className="form-glass">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional & Friendly</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic & Energetic</SelectItem>
                      <SelectItem value="calm">Calm & Reassuring</SelectItem>
                      <SelectItem value="consultative">Consultative & Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Max Call Duration (minutes)</label>
                  <Input 
                    type="number" 
                    className="form-glass" 
                    value={settings.maxCallDuration}
                    onChange={(e) => updateSetting('maxCallDuration', parseInt(e.target.value))}
                    min={5} 
                    max={30}
                  />
                </div>
              </div>
            </div>

            <div className="card-glass p-6">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <SettingsIcon className="text-fuchsia mr-3" />
                Automation Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="auto-enrollment" 
                    checked={settings.autoEnrollment}
                    onCheckedChange={(checked) => updateSetting('autoEnrollment', checked as boolean)}
                  />
                  <label htmlFor="auto-enrollment" className="text-gray-300">
                    Auto-enroll qualified leads
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="email-notifications" 
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked as boolean)}
                  />
                  <label htmlFor="email-notifications" className="text-gray-300">
                    Send email notifications
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="sms-notifications" 
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => updateSetting('smsNotifications', checked as boolean)}
                  />
                  <label htmlFor="sms-notifications" className="text-gray-300">
                    Send SMS notifications
                  </label>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Webhook Configuration */}
        <TabsContent value="webhooks">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card-glass p-6">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Link className="text-fuchsia mr-3" />
                Webhook Endpoints
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">ElevenLabs Webhook URL</label>
                  <Input 
                    type="url" 
                    className="form-glass" 
                    value="/api/webhooks/elevenlabs-call" 
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Used for incoming voice agent calls</p>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Internal Query Endpoint</label>
                  <Input 
                    type="url" 
                    className="form-glass" 
                    value="/api/webhooks/internal-query" 
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Used for AI assistant queries</p>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Payment Confirmation Webhook</label>
                  <Input 
                    type="url" 
                    className="form-glass" 
                    value="/api/webhooks/payment-confirmation" 
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Stripe/payment processor callbacks</p>
                </div>
              </div>
            </div>

            <div className="card-glass p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Webhook Configuration</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="webhook-logging" 
                    checked={settings.webhookLogging}
                    onCheckedChange={(checked) => updateSetting('webhookLogging', checked as boolean)}
                  />
                  <label htmlFor="webhook-logging" className="text-gray-300">
                    Enable detailed webhook logging
                  </label>
                </div>
                <div className="p-4 bg-black-glass rounded">
                  <h4 className="text-white font-medium mb-2">Recent Webhook Activity</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>elevenlabs-call</span>
                      <span className="text-green-400">200 OK</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>internal-query</span>
                      <span className="text-green-400">200 OK</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>payment-confirmation</span>
                      <span className="text-green-400">200 OK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Database Configuration */}
        <TabsContent value="database">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card-glass p-6">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Database className="text-vibrant-purple mr-3" />
                Database Status
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Active Connections</label>
                    <div className="text-2xl font-bold text-electric-cyan">24</div>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Total Records</label>
                    <div className="text-2xl font-bold text-fuchsia">15,847</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Storage Used</label>
                    <div className="text-lg font-bold text-vibrant-purple">2.3 GB</div>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Last Backup</label>
                    <div className="text-lg font-bold text-neon-magenta">2 hours ago</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-glass p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Database Operations</h3>
              <div className="space-y-4">
                <Button className="btn-glass w-full">
                  <Database className="mr-2 h-4 w-4" />
                  Run Maintenance
                </Button>
                <Button className="btn-glass w-full bg-gradient-to-r from-vibrant-purple to-neon-magenta">
                  <Save className="mr-2 h-4 w-4" />
                  Create Backup
                </Button>
                <Button className="btn-glass w-full bg-gradient-to-r from-electric-cyan to-fuchsia">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Optimize Performance
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card-glass p-6">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <CreditCard className="text-neon-magenta mr-3" />
                Payment Integrations
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-black-glass rounded">
                  <span className="text-white">Stripe Integration</span>
                  <span className="text-green-400 flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black-glass rounded">
                  <span className="text-white">Affirm Partnership</span>
                  <span className="text-green-400 flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black-glass rounded">
                  <span className="text-white">Klarna Integration</span>
                  <span className="text-yellow-400 flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    Pending
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black-glass rounded">
                  <span className="text-white">PayPal Integration</span>
                  <span className="text-gray-400 flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    Disabled
                  </span>
                </div>
              </div>
            </div>

            <div className="card-glass p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Communication Integrations</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-black-glass rounded">
                  <span className="text-white">ElevenLabs Voice API</span>
                  <span className="text-green-400 flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black-glass rounded">
                  <span className="text-white">OpenRouter AI</span>
                  <span className="text-green-400 flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black-glass rounded">
                  <span className="text-white">Twilio SMS</span>
                  <span className="text-green-400 flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black-glass rounded">
                  <span className="text-white">SendGrid Email</span>
                  <span className="text-yellow-400 flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    Testing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Settings Button */}
      <div className="text-center">
        <Button 
          className="btn-glass px-12 py-4 text-lg" 
          onClick={handleSaveSettings}
          disabled={saveSettingsMutation.isPending}
        >
          {saveSettingsMutation.isPending ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="mr-2 h-5 w-5" />
          )}
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
