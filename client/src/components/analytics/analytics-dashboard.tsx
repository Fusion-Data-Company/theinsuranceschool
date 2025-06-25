import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";

interface AnalyticsData {
  totalLeads: number;
  qualified: number;
  enrolled: number;
  conversionRate: number;
  monthlyRevenue: number;
  avgDealSize: number;
  aiPerformance: number;
  responseTime: number;
  enrollmentRate: number;
}

export function AnalyticsDashboard() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="card-glass p-6 animate-pulse">
              <div className="h-6 bg-white/20 rounded mb-4"></div>
              <div className="h-64 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="card-glass p-6 text-center">
        <p className="text-white">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Conversion Funnel & Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Conversion Funnel */}
        <div className="card-glass p-6">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="text-electric-cyan mr-3" />
            Conversion Funnel
          </h3>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
              alt="Data analytics dashboard with neon charts" 
              className="w-full h-64 object-cover rounded-lg opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black-glass to-transparent rounded-lg"></div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-electric-cyan">{analytics.totalLeads}</div>
              <div className="text-sm text-gray-400">Total Leads</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-fuchsia">{analytics.qualified}</div>
              <div className="text-sm text-gray-400">Qualified</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-vibrant-purple">{analytics.enrolled}</div>
              <div className="text-sm text-gray-400">Enrolled</div>
            </div>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="card-glass p-6">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <DollarSign className="text-fuchsia mr-3" />
            Revenue Analytics
          </h3>
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
                ${analytics.monthlyRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-magenta">
                ${analytics.avgDealSize.toFixed(0)}
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
            <Activity className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">AI Agent Performance</h3>
          <div className="text-3xl font-bold text-electric-cyan mb-2">
            {analytics.aiPerformance}%
          </div>
          <p className="text-gray-400">Success rate across all interactions</p>
        </div>

        <div className="card-glass p-6 text-center">
          <div className="text-4xl text-fuchsia mb-4">
            <TrendingUp className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Average Response Time</h3>
          <div className="text-3xl font-bold text-fuchsia mb-2">
            {analytics.responseTime}s
          </div>
          <p className="text-gray-400">Lightning-fast AI responses</p>
        </div>

        <div className="card-glass p-6 text-center">
          <div className="text-4xl text-vibrant-purple mb-4">
            <Users className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Enrollment Rate</h3>
          <div className="text-3xl font-bold text-vibrant-purple mb-2">
            {analytics.enrollmentRate}%
          </div>
          <p className="text-gray-400">Industry-leading conversion</p>
        </div>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card p-4 text-center">
          <div className="text-xl font-bold text-electric-cyan">{analytics.conversionRate}%</div>
          <div className="text-sm text-gray-400">Overall Conversion</div>
        </div>
        <div className="stat-card p-4 text-center">
          <div className="text-xl font-bold text-fuchsia">{analytics.qualified}</div>
          <div className="text-sm text-gray-400">Qualified Leads</div>
        </div>
        <div className="stat-card p-4 text-center">
          <div className="text-xl font-bold text-vibrant-purple">{analytics.enrolled}</div>
          <div className="text-sm text-gray-400">Active Enrollments</div>
        </div>
        <div className="stat-card p-4 text-center">
          <div className="text-xl font-bold text-neon-magenta">${analytics.avgDealSize.toFixed(0)}</div>
          <div className="text-sm text-gray-400">Avg Revenue/Student</div>
        </div>
      </div>
    </div>
  );
}
