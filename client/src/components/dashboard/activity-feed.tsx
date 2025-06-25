import { useQuery } from "@tanstack/react-query";
import { Phone, CreditCard, GraduationCap, Clock } from "lucide-react";
import type { Lead, CallRecord, Payment, Enrollment } from "@shared/schema";

interface Activity {
  id: string;
  type: 'call' | 'payment' | 'enrollment';
  description: string;
  timestamp: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

export function ActivityFeed() {
  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });
  
  const { data: callRecords = [] } = useQuery<CallRecord[]>({
    queryKey: ["/api/call-records"],
  });
  
  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });
  
  const { data: enrollments = [] } = useQuery<Enrollment[]>({
    queryKey: ["/api/enrollments"],
  });

  // Transform data into activities
  const activities: Activity[] = [];

  // Add recent call records
  callRecords.slice(0, 3).forEach(call => {
    const lead = leads.find(l => l.id === call.leadId);
    if (lead) {
      activities.push({
        id: `call-${call.id}`,
        type: 'call',
        description: `New lead captured: ${lead.firstName} ${lead.lastName} interested in ${lead.licenseGoal} license`,
        timestamp: new Date(call.createdAt).toLocaleString(),
        icon: Phone,
        iconColor: 'bg-electric-cyan',
      });
    }
  });

  // Add recent payments
  payments.slice(0, 2).forEach(payment => {
    const lead = leads.find(l => l.id === payment.leadId);
    if (lead) {
      activities.push({
        id: `payment-${payment.id}`,
        type: 'payment',
        description: `Payment processed: ${lead.firstName} ${lead.lastName} - $${payment.amount} ${payment.planChosen} payment`,
        timestamp: new Date(payment.createdAt).toLocaleString(),
        icon: CreditCard,
        iconColor: 'bg-fuchsia',
      });
    }
  });

  // Add recent enrollments
  enrollments.slice(0, 2).forEach(enrollment => {
    const lead = leads.find(l => l.id === enrollment.leadId);
    if (lead) {
      activities.push({
        id: `enrollment-${enrollment.id}`,
        type: 'enrollment',
        description: `Enrollment completed: ${lead.firstName} ${lead.lastName} - ${enrollment.cohort} cohort starting ${new Date(enrollment.startDate).toLocaleDateString()}`,
        timestamp: new Date(enrollment.createdAt).toLocaleString(),
        icon: GraduationCap,
        iconColor: 'bg-vibrant-purple',
      });
    }
  });

  // Sort by timestamp (most recent first)
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (activities.length === 0) {
    return (
      <div className="card-glass p-6">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Clock className="text-electric-cyan mr-3" />
          Recent Activity
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-400">No recent activity to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-glass p-6">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Clock className="text-electric-cyan mr-3" />
        Recent Activity
      </h3>
      
      <div className="space-y-4">
        {activities.slice(0, 5).map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-4 p-4 bg-black-glass rounded-lg border border-white/10">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 ${activity.iconColor} rounded-full flex items-center justify-center`}>
                  <Icon className="text-black text-sm" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{activity.description}</p>
                <p className="text-gray-400 text-sm">{activity.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
