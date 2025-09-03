import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, TrendingDown, Users, DollarSign, GraduationCap, 
  Calendar, Phone, Target, Clock, AlertCircle, CheckCircle,
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
  callSuccessRate: number;
  avgCallDuration: number;
  totalCalls: number;
  callsToday: number;

  // Course Analytics
  courseEnrollmentBreakdown: Record<string, number>;
  cohortPerformance: Array<{
    cohort: string;
    enrolled: number;
    completed: number;
    inProgress: number;
  }>;

  // Lead Source Performance
  sourceBreakdown: Record<string, {
    leads: number;
    converted: number;
    rate: number;
  }>;
}

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
  });

  if (isLoading) {
    return (
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="text-vibrant-purple">School</span>{" "}
            <span className="text-white">Administration</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card-glass p-6 h-32">
                <div className="h-4 bg-white/10 rounded mb-3"></div>
                <div className="h-8 bg-white/20 rounded mb-2"></div>
                <div className="h-3 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
    <div className="pt-20 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          <span className="text-vibrant-purple">School</span>{" "}
          <span className="text-white">Administration</span>
        </h2>

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

        {/* Operational Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Call Performance */}
          <div className="card-glass p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Phone className="mr-3 text-fuchsia" />
              Call Metrics
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-fuchsia">
                  {(analytics?.callSuccessRate || 0).toFixed(1)}%
                </div>
                <p className="text-sm text-slate-400">Success Rate</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {analytics?.totalCalls || 0}
                </div>
                <p className="text-sm text-slate-400">Total Calls</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-electric-cyan">
                  {analytics?.callsToday || 0}
                </div>
                <p className="text-sm text-slate-400">Today</p>
              </div>
            </div>
          </div>

          {/* Appointment Analytics */}
          <div className="card-glass p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Calendar className="mr-3 text-vibrant-purple" />
              Appointments
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-vibrant-purple">
                  {(analytics?.appointmentShowRate || 0).toFixed(1)}%
                </div>
                <p className="text-sm text-slate-400">Show Rate</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {Math.round(analytics?.avgCallDuration || 0)} min
                </div>
                <p className="text-sm text-slate-400">Avg Duration</p>
              </div>
            </div>
          </div>

          {/* Lead Quality */}
          <div className="card-glass p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Award className="mr-3 text-neon-magenta" />
              Lead Quality
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-neon-magenta">
                  {analytics?.qualifiedLeads || 0}
                </div>
                <p className="text-sm text-slate-400">Qualified Leads</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {analytics?.qualifiedLeads && analytics?.activeLeads ? 
                    ((analytics.qualifiedLeads / analytics.activeLeads) * 100).toFixed(1) : 0}%
                </div>
                <p className="text-sm text-slate-400">Qualification Rate</p>
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
          {analytics?.sourceBreakdown ? (
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
                      <div className="text-slate-400">Converted</div>
                      <div className="text-xl font-bold text-electric-cyan">{data.converted}</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Conversion Rate</span>
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
              No lead source data available
            </div>
          )}
        </div>

        {/* Student Progress & Cohort Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cohort Performance */}
          <div className="card-glass p-6">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <GraduationCap className="mr-3 text-vibrant-purple" />
              Cohort Performance
            </h3>
            {analytics?.cohortPerformance && analytics.cohortPerformance.length > 0 ? (
              <div className="space-y-4">
                {analytics.cohortPerformance.map((cohort, index) => (
                  <div key={index} className="p-4 bg-slate-800/30 rounded-lg">
                    <h4 className="font-semibold text-white mb-3 capitalize">
                      {cohort.cohort} Cohort
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-electric-cyan">{cohort.enrolled}</div>
                        <div className="text-xs text-slate-400">Enrolled</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-400">{cohort.completed}</div>
                        <div className="text-xs text-slate-400">Completed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-400">{cohort.inProgress}</div>
                        <div className="text-xs text-slate-400">In Progress</div>
                      </div>
                    </div>
                    {cohort.enrolled > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Completion Rate</span>
                          <span className="text-green-400 font-semibold">
                            {((cohort.completed / cohort.enrolled) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-green-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(cohort.completed / cohort.enrolled) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-8">
                <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No active cohorts</p>
                <p className="text-sm mt-1">Start enrolling students to see cohort analytics</p>
              </div>
            )}
          </div>

          {/* Administrative Overview */}
          <div className="card-glass p-6">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FileText className="mr-3 text-neon-magenta" />
              Administrative Overview
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-white mb-3">Payment Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-slate-800/30 rounded">
                    <div className="text-xl font-bold text-yellow-400">
                      ${(analytics?.outstandingPayments || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">Outstanding</div>
                  </div>
                  <div className="text-center p-3 bg-slate-800/30 rounded">
                    <div className="text-xl font-bold text-electric-cyan">
                      {analytics?.paymentPlanActive || 0}
                    </div>
                    <div className="text-xs text-slate-400">Payment Plans</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3">Daily Operations</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Appointment Show Rate</span>
                    <span className={`font-semibold ${
                      (analytics?.appointmentShowRate || 0) >= 80 ? 'text-green-400' : 
                      (analytics?.appointmentShowRate || 0) >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {(analytics?.appointmentShowRate || 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Calls Today</span>
                    <span className="font-semibold text-white">
                      {analytics?.callsToday || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Avg Call Duration</span>
                    <span className="font-semibold text-white">
                      {Math.round(analytics?.avgCallDuration || 0)} min
                    </span>
                  </div>
                </div>
              </div>

              {(analytics?.outstandingPayments || 0) > 0 && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400 mr-2" />
                    <span className="font-semibold text-yellow-400">Payment Follow-up Required</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    {analytics?.paymentPlanActive || 0} students have outstanding payment obligations
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Items for School Admin */}
        <div className="card-glass p-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Activity className="mr-3 text-electric-cyan" />
            Administrative Action Items
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-800/30 rounded-lg border-l-4 border-electric-cyan">
              <h4 className="font-semibold text-white mb-2">Lead Follow-up</h4>
              <p className="text-sm text-slate-300 mb-3">
                {analytics?.activeLeads || 0} leads need attention in your pipeline
              </p>
              <button className="text-electric-cyan text-sm font-semibold hover:underline">
                → Review Prospects
              </button>
            </div>

            <div className="p-4 bg-slate-800/30 rounded-lg border-l-4 border-yellow-400">
              <h4 className="font-semibold text-white mb-2">Payment Collection</h4>
              <p className="text-sm text-slate-300 mb-3">
                ${(analytics?.outstandingPayments || 0).toLocaleString()} in outstanding payments
              </p>
              <button className="text-yellow-400 text-sm font-semibold hover:underline">
                → Manage Payments
              </button>
            </div>

            <div className="p-4 bg-slate-800/30 rounded-lg border-l-4 border-green-400">
              <h4 className="font-semibold text-white mb-2">Enrollment Processing</h4>
              <p className="text-sm text-slate-300 mb-3">
                {analytics?.qualifiedLeads || 0} qualified students ready to enroll
              </p>
              <button className="text-green-400 text-sm font-semibold hover:underline">
                → Process Enrollments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}