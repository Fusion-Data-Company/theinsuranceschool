import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/navbar";
import { ElevenLabsWidget } from "@/components/ui/elevenlabs-widget";
import Home from "@/pages/home";
import Leads from "@/pages/leads";
import CalendarPage from "@/pages/calendar";
import EnrollmentPage from "@/pages/enrollment";
import RegulationsPage from "@/pages/regulations";
import Settings from "@/pages/settings";
import PublicBooking from "@/pages/public-booking";
import MCPDemo from "@/pages/mcp-demo";
import SMSTest from "@/pages/sms-test";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/leads" component={Leads} />
        <Route path="/calendar" component={CalendarPage} />
        <Route path="/enrollment" component={EnrollmentPage} />
        <Route path="/regulations" component={RegulationsPage} />
        <Route path="/settings" component={Settings} />
        <Route path="/book" component={PublicBooking} />
        <Route path="/mcp-demo" component={MCPDemo} />
        <Route path="/sms-test" component={SMSTest} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <Navbar />
          <main className="pt-16">
            <Router />
          </main>
        </div>
        <ElevenLabsWidget />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
