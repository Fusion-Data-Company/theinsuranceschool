import { StatsGrid } from "@/components/dashboard/stats-grid";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function Dashboard() {
  return (
    <div className="pt-20 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-electric-cyan">Enterprise</span>{" "}
            <span className="text-white">Dashboard</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time analytics, lead management, and AI-powered insights for maximum enrollment success
          </p>
        </div>

        {/* Real-time Stats Grid */}
        <StatsGrid />

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity Feed */}
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>

          {/* Quick Actions Panel */}
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}
