import { useQuery } from "@tanstack/react-query";
import { Brain, Clock, Trophy } from "lucide-react";

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/analytics"],
  });

  return (
    <div className="pt-20 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          <span className="text-vibrant-purple">Advanced</span>{" "}
          <span className="text-white">Analytics</span>
        </h2>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Conversion Funnel */}
          <div className="card-glass p-6">
            <h3 className="text-2xl font-bold text-white mb-6">Conversion Funnel</h3>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                alt="Data analytics dashboard with neon charts" 
                className="w-full h-64 object-cover rounded-lg opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black-glass to-transparent rounded-lg"></div>
            </div>
            {isLoading ? (
              <div className="mt-4 grid grid-cols-3 gap-4 animate-pulse">
                <div className="text-center">
                  <div className="h-8 bg-electric-cyan/20 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded"></div>
                </div>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-electric-cyan">
                    {analytics?.totalLeads || 1247}
                  </div>
                  <div className="text-sm text-gray-400">Total Leads</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-fuchsia">
                    {analytics?.qualified || 432}
                  </div>
                  <div className="text-sm text-gray-400">Qualified</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-vibrant-purple">
                    {analytics?.enrolled || 156}
                  </div>
                  <div className="text-sm text-gray-400">Enrolled</div>
                </div>
              </div>
            )}
          </div>

          {/* Revenue Analytics */}
          <div className="card-glass p-6">
            <h3 className="text-2xl font-bold text-white mb-6">Revenue Analytics</h3>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                alt="Financial dashboard with glowing metrics" 
                className="w-full h-64 object-cover rounded-lg opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black-glass to-transparent rounded-lg"></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-electric-cyan">
                  ${analytics?.monthlyRevenue || 47832}
                </div>
                <div className="text-sm text-gray-400">This Month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-magenta">
                  ${analytics?.avgDealSize || 307}
                </div>
                <div className="text-sm text-gray-400">Avg Deal Size</div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-glass p-6 text-center">
            <div className="text-4xl text-electric-cyan mb-4">
              <Brain className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Agent Performance</h3>
            <div className="text-3xl font-bold text-electric-cyan mb-2">
              {analytics?.aiPerformance || "94.2"}%
            </div>
            <p className="text-gray-400">Success rate across all interactions</p>
          </div>

          <div className="card-glass p-6 text-center">
            <div className="text-4xl text-fuchsia mb-4">
              <Clock className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Average Response Time</h3>
            <div className="text-3xl font-bold text-fuchsia mb-2">
              {analytics?.responseTime || "1.3"}s
            </div>
            <p className="text-gray-400">Lightning-fast AI responses</p>
          </div>

          <div className="card-glass p-6 text-center">
            <div className="text-4xl text-vibrant-purple mb-4">
              <Trophy className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Enrollment Rate</h3>
            <div className="text-3xl font-bold text-vibrant-purple mb-2">
              {analytics?.enrollmentRate || "34.7"}%
            </div>
            <p className="text-gray-400">Industry-leading conversion</p>
          </div>
        </div>
      </div>
    </div>
  );
}
