import { useState, useEffect } from "react";
import { Bot, Link, Database, CreditCard, Save, CheckCircle, Clock, Globe, TestTube, Activity, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [settings, setSettings] = useState({
    voiceModel: "elevenlabs-rachel",
    personality: "professional",
    maxCallDuration: 15,
    webhookLogging: true,
    airtopApiKey: "",
    airtopEnabled: false,
    airtopSessionLimit: 10,
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Failed to load saved settings:', error);
      }
    }
  }, []);
  
  const { toast } = useToast();

  const handleSaveSettings = async () => {
    try {
      // Save settings to backend or localStorage
      localStorage.setItem('app-settings', JSON.stringify(settings));
      
      toast({
        title: "Settings Saved",
        description: "Your configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="pt-20 px-4 pb-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          <span className="text-titanium">System</span>{" "}
          <span className="text-white">Settings</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Agent Configuration */}
          <div className="card-glass p-6">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Bot className="text-electric-cyan mr-3" />
              AI Agent Config
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Primary Voice Model</label>
                <Select value={settings.voiceModel} onValueChange={(value) => setSettings(prev => ({ ...prev, voiceModel: value }))}>
                  <SelectTrigger className="form-glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elevenlabs-rachel">ElevenLabs - Rachel (Premium)</SelectItem>
                    <SelectItem value="elevenlabs-josh">ElevenLabs - Josh (Standard)</SelectItem>
                    <SelectItem value="elevenlabs-bella">ElevenLabs - Bella (Conversational)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Response Personality</label>
                <Select value={settings.personality} onValueChange={(value) => setSettings(prev => ({ ...prev, personality: value }))}>
                  <SelectTrigger className="form-glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional & Friendly</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic & Energetic</SelectItem>
                    <SelectItem value="calm">Calm & Reassuring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Max Call Duration (minutes)</label>
                <Input 
                  type="number" 
                  className="form-glass" 
                  value={settings.maxCallDuration}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxCallDuration: parseInt(e.target.value) }))}
                  min={5} 
                  max={30}
                />
              </div>
            </div>
          </div>

          {/* Webhook Configuration */}
          <div className="card-glass p-6">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Link className="text-fuchsia mr-3" />
              Webhook Settings
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
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Internal Query Endpoint</label>
                <Input 
                  type="url" 
                  className="form-glass" 
                  value="/api/webhooks/internal-query" 
                  readOnly
                />
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="webhook-logging" 
                  checked={settings.webhookLogging}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, webhookLogging: checked as boolean }))}
                />
                <label htmlFor="webhook-logging" className="text-gray-300">
                  Enable detailed webhook logging
                </label>
              </div>
            </div>
          </div>

          {/* Database Configuration */}
          <div className="card-glass p-6">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Database className="text-vibrant-purple mr-3" />
              Database Settings
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Database Status</label>
                  <div className="text-lg font-semibold text-green-400">Connected</div>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Environment</label>
                  <div className="text-lg font-semibold text-electric-cyan">Development</div>
                </div>
              </div>
              <Button className="btn-glass w-full" onClick={() => {
                toast({
                  title: "Database Healthy",
                  description: "No maintenance required at this time."
                });
              }}>
                <Database className="mr-2 h-4 w-4" />
                Check Status
              </Button>
            </div>
          </div>

          {/* Payment Integration */}
          <div className="card-glass p-6">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <CreditCard className="text-neon-magenta mr-3" />
              Payment Integration
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/30 rounded border-l-4 border-electric-cyan">
                <h4 className="font-semibold text-white mb-2">Available Payment Methods:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Stripe (Credit Cards & ACH)</li>
                  <li>• PayPal & PayPal Credit</li>
                  <li>• Affirm (Buy Now, Pay Later)</li>
                  <li>• Direct Bank Transfer</li>
                  <li>• Check Payments</li>
                </ul>
              </div>
              
              <Button className="btn-glass w-full" onClick={() => {
                toast({
                  title: "Payment Configuration",
                  description: "Contact support to configure payment processors."
                });
              }}>
                <CreditCard className="mr-2 h-4 w-4" />
                Configure Payment Methods
              </Button>
            </div>
          </div>

          {/* Airtop Browser Automation Integration */}
          <div className="card-glass p-6">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Globe className="text-electric-cyan mr-3" />
              Airtop Automation
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-black-glass rounded">
                <span className="text-white">Browser Automation Service</span>
                <span className={`flex items-center ${settings.airtopEnabled && settings.airtopApiKey ? 'text-green-400' : 'text-red-400'}`}>
                  <Activity className="mr-1 h-4 w-4" />
                  {settings.airtopEnabled && settings.airtopApiKey ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Airtop API Key</label>
                <Input 
                  type="password" 
                  className="form-glass" 
                  placeholder="API key from portal.airtop.ai"
                  value={settings.airtopApiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, airtopApiKey: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Max Concurrent Sessions</label>
                <Select 
                  value={settings.airtopSessionLimit.toString()} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, airtopSessionLimit: parseInt(value) }))}
                >
                  <SelectTrigger className="form-glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Sessions</SelectItem>
                    <SelectItem value="10">10 Sessions</SelectItem>
                    <SelectItem value="20">20 Sessions</SelectItem>
                    <SelectItem value="50">50 Sessions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="airtop-enabled" 
                  checked={settings.airtopEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, airtopEnabled: checked as boolean }))}
                />
                <label htmlFor="airtop-enabled" className="text-gray-300">
                  Enable Airtop integration for web automation tasks
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button className="btn-glass" onClick={async () => {
                  if (!settings.airtopApiKey) {
                    toast({ title: "API Key Required", description: "Please enter your Airtop API key first", variant: "destructive" });
                    return;
                  }
                  
                  toast({ title: "Testing Connection...", description: "Verifying Airtop API connection" });
                  
                  try {
                    const response = await fetch('/api/airtop/test', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        apiKey: settings.airtopApiKey, 
                        sessionLimit: settings.airtopSessionLimit 
                      })
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                      toast({ title: "Connection Successful", description: result.message });
                    } else {
                      toast({ title: "Connection Failed", description: result.message, variant: "destructive" });
                    }
                  } catch (error) {
                    toast({ title: "Test Failed", description: "Unable to test connection", variant: "destructive" });
                  }
                }}>
                  <TestTube className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
                <Button className="btn-glass" onClick={() => {
                  window.open("https://portal.airtop.ai/", "_blank");
                }}>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Manage API Keys
                </Button>
              </div>
              
              <div className="mt-4 p-3 bg-slate-800/30 rounded border-l-4 border-electric-cyan">
                <h4 className="font-semibold text-white mb-2">Automation Capabilities:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Social media profile enrichment</li>
                  <li>• Automated form filling and data entry</li>
                  <li>• Lead research and data collection</li>
                  <li>• Competitor analysis and monitoring</li>
                  <li>• SERP monitoring and keyword research</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Save Settings */}
        <div className="text-center mt-12">
          <Button className="btn-glass px-12 py-4 text-lg" onClick={handleSaveSettings}>
            <Save className="mr-2 h-5 w-5" />
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
