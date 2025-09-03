import { HeroCore } from "@/components/hero-core";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, TrendingDown, Users, DollarSign, GraduationCap, 
  Calendar, Target, AlertCircle, CheckCircle,
  BookOpen, Award, FileText, Activity
} from "lucide-react";

interface AnalyticsData {
  // Student Pipeline
  activeLeads: number;
  activeLeadsChange: number;
  qualifiedLeads: number;
  enrolledStudents: number;
  conversionRate: number;
  conversionRateChange: number;

  // Financial Metrics
  monthlyRevenue: number;
  revenueChange: number;
  avgDealSize: number;
  outstandingPayments: number;
  paymentPlanActive: number;

  // Operational Metrics
  appointmentShowRate: number;
  totalAppointments: number;

  // Course Analytics
  courseEnrollmentBreakdown: Record<string, number>;

  // Lead Source Performance
  sourceBreakdown: Record<string, {
    leads: number;
    converted: number;
    rate: number;
  }>;
}

export default function Home() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
  });

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? "text-green-400" : "text-red-400";
    
    return (
      <div className={`flex items-center text-sm ${colorClass}`}>
        <Icon className="w-3 h-3 mr-1" />
        {Math.abs(change).toFixed(1)}%
      </div>
    );
  };

  return (
    <div className="pt-16"> {/* Account for fixed navbar */}
      {/* Hero Section */}
      <HeroCore />
      
      {/* School Administration Dashboard */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-vibrant-purple">School</span>{" "}
              <span className="text-white">Administration</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real-time insights and metrics for educational licensing enrollment management
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card-glass p-6 h-32">
                  <div className="h-4 bg-white/10 rounded mb-3"></div>
                  <div className="h-8 bg-white/20 rounded mb-2"></div>
                  <div className="h-3 bg-white/10 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Key Performance Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {/* Active Students in Pipeline */}
                <div className="card-glass p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 text-electric-cyan" />
                    {formatChange(analytics?.activeLeadsChange || 0)}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-300">Active Pipeline</h3>
                  <div className="text-3xl font-bold text-white">{analytics?.activeLeads || 0}</div>
                  <p className="text-sm text-slate-400 mt-2">Students in enrollment process</p>
                </div>

                {/* Monthly Revenue */}
                <div className="card-glass p-6">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="w-8 h-8 text-green-400" />
                    {formatChange(analytics?.revenueChange || 0)}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-300">Monthly Revenue</h3>
                  <div className="text-3xl font-bold text-white">
                    ${(analytics?.monthlyRevenue || 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-400 mt-2">Total course payments received</p>
                </div>

                {/* Conversion Rate */}
                <div className="card-glass p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="w-8 h-8 text-fuchsia" />
                    {formatChange(analytics?.conversionRateChange || 0)}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-300">Conversion Rate</h3>
                  <div className="text-3xl font-bold text-white">
                    {(analytics?.conversionRate || 0).toFixed(1)}%
                  </div>
                  <p className="text-sm text-slate-400 mt-2">Lead to enrollment conversion</p>
                </div>

                {/* Total Enrolled */}
                <div className="card-glass p-6">
                  <div className="flex items-center justify-between mb-4">
                    <GraduationCap className="w-8 h-8 text-vibrant-purple" />
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-300">Total Enrolled</h3>
                  <div className="text-3xl font-bold text-white">{analytics?.enrolledStudents || 0}</div>
                  <p className="text-sm text-slate-400 mt-2">Students currently enrolled</p>
                </div>
              </div>

              {/* Detailed Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Financial Overview */}
                <div className="card-glass p-6">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <DollarSign className="mr-3 text-green-400" />
                    Financial Performance
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded">
                      <span className="text-slate-300">Average Deal Size</span>
                      <span className="text-2xl font-bold text-green-400">
                        ${(analytics?.avgDealSize || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded">
                      <span className="text-slate-300">Outstanding Payments</span>
                      <span className="text-2xl font-bold text-yellow-400">
                        ${(analytics?.outstandingPayments || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded">
                      <span className="text-slate-300">Active Payment Plans</span>
                      <span className="text-2xl font-bold text-electric-cyan">
                        {analytics?.paymentPlanActive || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Course Enrollment Breakdown */}
                <div className="card-glass p-6">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <BookOpen className="mr-3 text-electric-cyan" />
                    Course Enrollment
                  </h3>
                  <div className="space-y-4">
                    {analytics?.courseEnrollmentBreakdown ? 
                      Object.entries(analytics.courseEnrollmentBreakdown).map(([course, count]) => (
                        <div key={course} className="flex justify-between items-center p-4 bg-slate-800/30 rounded">
                          <span className="text-slate-300">
                            {course === '2-15' ? '2-15 Life & Health' : 
                             course === '2-40' ? '2-40 Property & Casualty' : 
                             course === '2-14' ? '2-14 Personal Lines' : course}
                          </span>
                          <span className="text-2xl font-bold text-white">{count}</span>
                        </div>
                      )) : 
                      <div className="text-center text-slate-400 py-8">
                        No enrollment data available
                      </div>
                    }
                  </div>
                </div>
              </div>

              {/* Student Pipeline & Appointments */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Student Progress Pipeline */}
                <div className="card-glass p-6">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Users className="mr-3 text-electric-cyan" />
                    Student Progress Pipeline
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded border-l-4 border-electric-cyan">
                      <span className="text-slate-300">Active Pipeline</span>
                      <span className="text-2xl font-bold text-electric-cyan">
                        {analytics?.activeLeads || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded border-l-4 border-fuchsia">
                      <span className="text-slate-300">Qualified Students</span>
                      <span className="text-2xl font-bold text-fuchsia">
                        {analytics?.qualifiedLeads || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded border-l-4 border-green-400">
                      <span className="text-slate-300">Successfully Enrolled</span>
                      <span className="text-2xl font-bold text-green-400">
                        {analytics?.enrolledStudents || 0}
                      </span>
                    </div>
                  </div>
                  
                  {(analytics?.qualifiedLeads || 0) > 0 && (
                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Award className="w-4 h-4 text-blue-400 mr-2" />
                        <span className="font-semibold text-blue-400">Ready for Enrollment</span>
                      </div>
                      <p className="text-sm text-slate-300">
                        {analytics?.qualifiedLeads || 0} qualified students are ready to enroll in courses
                      </p>
                    </div>
                  )}
                </div>

                {/* Appointment Management */}
                <div className="card-glass p-6">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Calendar className="mr-3 text-vibrant-purple" />
                    Appointment Management
                  </h3>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-slate-800/30 rounded">
                      <div className="text-3xl font-bold text-vibrant-purple">
                        {(analytics?.appointmentShowRate || 0).toFixed(1)}%
                      </div>
                      <p className="text-sm text-slate-400">Appointment Show Rate</p>
                    </div>
                    <div className="text-center p-4 bg-slate-800/30 rounded">
                      <div className="text-2xl font-bold text-white">
                        {analytics?.totalAppointments || 0}
                      </div>
                      <p className="text-sm text-slate-400">Total Scheduled</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Source Performance */}
              <div className="card-glass p-8 mb-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Activity className="mr-3 text-electric-cyan" />
                  Lead Source Performance
                </h3>
                {analytics?.sourceBreakdown && Object.keys(analytics.sourceBreakdown).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(analytics.sourceBreakdown).map(([source, data]) => (
                      <div key={source} className="p-4 bg-slate-800/30 rounded-lg">
                        <h4 className="font-semibold text-white mb-2 capitalize">
                          {source.replace('_', ' ')}
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-slate-400">Leads</div>
                            <div className="text-xl font-bold text-white">{data.leads}</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Enrolled</div>
                            <div className="text-xl font-bold text-electric-cyan">{data.converted}</div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Success Rate</span>
                            <span className="text-fuchsia font-semibold">{data.rate.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-fuchsia h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(data.rate, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No lead source data available</p>
                    <p className="text-sm mt-1">Data will appear as you add leads from different sources</p>
                  </div>
                )}
              </div>

              {/* Administrative Action Items */}
              <div className="card-glass p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FileText className="mr-3 text-electric-cyan" />
                  Administrative Action Items
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(analytics?.activeLeads || 0) > 0 && (
                    <div className="p-4 bg-slate-800/30 rounded-lg border-l-4 border-electric-cyan">
                      <h4 className="font-semibold text-white mb-2">Lead Follow-up</h4>
                      <p className="text-sm text-slate-300 mb-3">
                        {analytics?.activeLeads || 0} leads need attention in your pipeline
                      </p>
                      <button className="text-electric-cyan text-sm font-semibold hover:underline">
                        → Review Prospects
                      </button>
                    </div>
                  )}

                  {(analytics?.outstandingPayments || 0) > 0 && (
                    <div className="p-4 bg-slate-800/30 rounded-lg border-l-4 border-yellow-400">
                      <h4 className="font-semibold text-white mb-2">Payment Collection</h4>
                      <p className="text-sm text-slate-300 mb-3">
                        ${(analytics?.outstandingPayments || 0).toLocaleString()} in outstanding payments
                      </p>
                      <button className="text-yellow-400 text-sm font-semibold hover:underline">
                        → Manage Payments
                      </button>
                    </div>
                  )}

                  {(analytics?.qualifiedLeads || 0) > 0 && (
                    <div className="p-4 bg-slate-800/30 rounded-lg border-l-4 border-green-400">
                      <h4 className="font-semibold text-white mb-2">Enrollment Processing</h4>
                      <p className="text-sm text-slate-300 mb-3">
                        {analytics?.qualifiedLeads || 0} qualified students ready to enroll
                      </p>
                      <button className="text-green-400 text-sm font-semibold hover:underline">
                        → Process Enrollments
                      </button>
                    </div>
                  )}
                </div>

                {/* Show message when no action items */}
                {(analytics?.activeLeads || 0) === 0 && (analytics?.outstandingPayments || 0) === 0 && (analytics?.qualifiedLeads || 0) === 0 && (
                  <div className="text-center text-slate-400 py-8">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
                    <p className="text-lg font-semibold text-white">All caught up!</p>
                    <p className="text-sm mt-1">No immediate action items for school administration</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}