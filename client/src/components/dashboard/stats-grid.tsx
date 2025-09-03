import { useQuery } from "@tanstack/react-query";
import { Users, TrendingUp, DollarSign, GraduationCap } from "lucide-react";

interface AnalyticsData {
  activeLeads: number;
  activeLeadsChange: number;
  conversionRate: number;
  conversionRateChange: number;
  monthlyRevenue: number;
  revenueChange: number;
  enrolledStudents: number;
}

export function StatsGrid() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat-card p-6 animate-pulse">
            <div className="h-8 bg-electric-cyan/20 rounded mb-4"></div>
            <div className="h-8 bg-white/20 rounded mb-2"></div>
            <div className="h-4 bg-white/10 rounded"></div>
          </div>
        ))}
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

  const formatChange = (value: number, label: string) => {
    const sign = value >= 0 ? "+" : "";
    const color = value >= 0 ? "text-green-400" : "text-red-400";
    return { text: `${sign}${value}% ${label}`, color };
  };

  const activeLeadsChange = formatChange(analytics.activeLeadsChange, "from yesterday");
  const conversionRateChange = formatChange(analytics.conversionRateChange, "this week");
  const revenueChange = formatChange(analytics.revenueChange, "this month");

  const stats = [
    {
      title: "Active Pipeline",
      value: analytics.activeLeads.toString(),
      change: activeLeadsChange.text,
      changeColor: activeLeadsChange.color,
      icon: Users,
      color: "text-electric-cyan",
    },
    {
      title: "Conversion Rate",
      value: `${analytics.conversionRate}%`,
      change: conversionRateChange.text,
      changeColor: conversionRateChange.color,
      icon: TrendingUp,
      color: "text-fuchsia",
    },
    {
      title: "Monthly Revenue",
      value: `$${(analytics.monthlyRevenue || 0).toLocaleString()}`,
      change: revenueChange.text,
      changeColor: revenueChange.color,
      icon: DollarSign,
      color: "text-vibrant-purple",
    },
    {
      title: "Students Enrolled",
      value: analytics.enrolledStudents.toString(),
      change: "Total enrolled",
      changeColor: "text-green-400",
      icon: GraduationCap,
      color: "text-neon-magenta",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="stat-card p-6 text-center">
            <div className={`text-3xl mb-2 ${stat.color}`}>
              <Icon className="w-8 h-8 mx-auto" />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.title}</div>
            <div className={`text-xs mt-1 ${stat.changeColor}`}>{stat.change}</div>
          </div>
        );
      })}
    </div>
  );
}