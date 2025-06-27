import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/navbar";
import { ElevenLabsWidget } from "@/components/ui/elevenlabs-widget";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Leads from "@/pages/leads";
import Analytics from "@/pages/analytics";
import EnrollmentPage from "@/pages/enrollment";
import Settings from "@/pages/settings";
import MCPDemo from "@/pages/mcp-demo";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/leads" component={Leads} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/enrollment" component={EnrollmentPage} />
      <Route path="/settings" component={Settings} />
      <Route path="/mcp-demo" component={MCPDemo} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <Navbar />
          <Router />
        </div>
        <ElevenLabsWidget />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
