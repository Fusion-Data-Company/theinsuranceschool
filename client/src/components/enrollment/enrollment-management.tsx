import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GraduationCap, Plus, Calendar, User, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Enrollment, Lead } from "@shared/schema";

interface EnrollmentFormData {
  leadId: number;
  course: string;
  cohort: string;
  startDate: string;
}

export function EnrollmentManagement() {
  const [formData, setFormData] = useState<Partial<EnrollmentFormData>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery<Enrollment[]>({
    queryKey: ["/api/enrollments"],
  });

  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const enrollmentMutation = useMutation({
    mutationFn: async (data: EnrollmentFormData) => {
      const response = await apiRequest("POST", "/api/enrollments", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Enrollment Successful",
        description: "Student has been enrolled successfully.",
      });
      setFormData({});
    },
    onError: () => {
      toast({
        title: "Enrollment Failed",
        description: "Unable to enroll student at this time.",
        variant: "destructive",
      });
    },
  });

  const handleEnrollment = () => {
    if (!formData.leadId || !formData.course || !formData.cohort) {
      toast({
        title: "Missing Information",
        description: "Please select all required fields.",
        variant: "destructive",
      });
      return;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 14); // Start in 2 weeks

    enrollmentMutation.mutate({
      leadId: formData.leadId,
      course: formData.course,
      cohort: formData.cohort,
      startDate: startDate.toISOString(),
    });
  };

  // Filter leads that haven't been enrolled yet
  const availableLeads = leads.filter(lead => 
    lead.status === "qualified" && 
    !enrollments.some(enrollment => enrollment.leadId === lead.id)
  );

  const getCourseName = (course: string) => {
    switch (course) {
      case "2-15_life_health": return "2-15 Life & Health";
      case "2-40_property_casualty": return "2-40 Property & Casualty";
      case "2-14_personal_lines": return "2-14 Personal Lines";
      default: return course;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "enrolled": return "bg-blue-500/20 text-blue-400";
      case "active": return "bg-green-500/20 text-green-400";
      case "completed": return "bg-purple-500/20 text-purple-400";
      case "dropped": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  if (enrollmentsLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 card-glass p-6 animate-pulse">
            <div className="h-6 bg-white/20 rounded mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-white/10 rounded"></div>
              ))}
            </div>
          </div>
          <div className="card-glass p-6 animate-pulse">
            <div className="h-6 bg-white/20 rounded mb-4"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-white/10 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enrollment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card p-6 text-center">
          <div className="text-3xl text-electric-cyan mb-2">
            <GraduationCap className="w-8 h-8 mx-auto" />
          </div>
          <div className="text-2xl font-bold text-white">{enrollments.length}</div>
          <div className="text-sm text-gray-400">Total Enrollments</div>
        </div>
        <div className="stat-card p-6 text-center">
          <div className="text-3xl text-green-400 mb-2">
            <User className="w-8 h-8 mx-auto" />
          </div>
          <div className="text-2xl font-bold text-white">
            {enrollments.filter(e => e.status === "active").length}
          </div>
          <div className="text-sm text-gray-400">Active Students</div>
        </div>
        <div className="stat-card p-6 text-center">
          <div className="text-3xl text-fuchsia mb-2">
            <BookOpen className="w-8 h-8 mx-auto" />
          </div>
          <div className="text-2xl font-bold text-white">
            {enrollments.filter(e => e.status === "completed").length}
          </div>
          <div className="text-sm text-gray-400">Completed</div>
        </div>
        <div className="stat-card p-6 text-center">
          <div className="text-3xl text-vibrant-purple mb-2">
            <Calendar className="w-8 h-8 mx-auto" />
          </div>
          <div className="text-2xl font-bold text-white">
            {availableLeads.length}
          </div>
          <div className="text-sm text-gray-400">Ready to Enroll</div>
        </div>
      </div>

      {/* Main Enrollment Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Enrollments List */}
        <div className="lg:col-span-2">
          <div className="card-glass p-6">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <GraduationCap className="text-neon-magenta mr-3" />
              Active Enrollments
            </h3>
            
            <div className="space-y-4">
              {enrollments.length === 0 ? (
                <div className="text-center py-8">
                  <GraduationCap className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-400">No active enrollments found</p>
                  <p className="text-gray-500 text-sm">Students will appear here once enrolled</p>
                </div>
              ) : (
                enrollments.map((enrollment) => {
                  const lead = leads.find(l => l.id === enrollment.leadId);
                  if (!lead) return null;
                  
                  return (
                    <div key={enrollment.id} className="flex items-center justify-between p-4 bg-black-glass rounded-lg border border-white/10 hover:border-electric-cyan/30 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-electric-cyan to-fuchsia rounded-full flex items-center justify-center">
                          <span className="text-black font-bold">
                            {lead.firstName[0]}{lead.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {lead.firstName} {lead.lastName}
                          </p>
                          <p className="text-gray-400 text-sm">{getCourseName(enrollment.course)}</p>
                          <p className="text-gray-400 text-xs flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {enrollment.cohort} Cohort - Starts {new Date(enrollment.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(enrollment.status)}`}>
                          {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                        </span>
                        <div className="flex items-center mt-1 text-gray-400 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          Progress: {enrollment.progress}%
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Enrollment Actions */}
        <div className="space-y-6">
          {/* Quick Enroll Form */}
          <div className="card-glass p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Plus className="text-electric-cyan mr-3" />
              Quick Enroll
            </h3>
            <div className="space-y-4">
              <Select 
                value={formData.leadId?.toString() || ""} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, leadId: parseInt(value) }))}
              >
                <SelectTrigger className="form-glass">
                  <SelectValue placeholder="Select Lead" />
                </SelectTrigger>
                <SelectContent>
                  {availableLeads.length === 0 ? (
                    <SelectItem value="" disabled>No qualified leads available</SelectItem>
                  ) : (
                    availableLeads.map(lead => (
                      <SelectItem key={lead.id} value={lead.id.toString()}>
                        {lead.firstName} {lead.lastName} - {lead.licenseGoal}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              <Select 
                value={formData.course || ""} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, course: value }))}
              >
                <SelectTrigger className="form-glass">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-15_life_health">2-15 Life & Health</SelectItem>
                  <SelectItem value="2-40_property_casualty">2-40 Property & Casualty</SelectItem>
                  <SelectItem value="2-14_personal_lines">2-14 Personal Lines</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={formData.cohort || ""} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, cohort: value }))}
              >
                <SelectTrigger className="form-glass">
                  <SelectValue placeholder="Select Cohort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day Cohort - Starts Feb 1</SelectItem>
                  <SelectItem value="evening">Evening Cohort - Starts Feb 5</SelectItem>
                  <SelectItem value="weekend">Weekend Cohort - Starts Feb 10</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                className="btn-glass w-full" 
                onClick={handleEnrollment}
                disabled={enrollmentMutation.isPending || !formData.leadId || !formData.course || !formData.cohort}
              >
                {enrollmentMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <GraduationCap className="mr-2 h-4 w-4" />
                )}
                Enroll Student
              </Button>
            </div>
          </div>

          {/* Upcoming Cohorts */}
          <div className="card-glass p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Calendar className="text-fuchsia mr-3" />
              Upcoming Cohorts
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-black-glass rounded hover:bg-white/5 transition-colors">
                <div>
                  <p className="text-white font-medium">2-15 Day Cohort</p>
                  <p className="text-gray-400 text-sm">Feb 1, 2024</p>
                </div>
                <span className="text-electric-cyan font-bold">
                  {enrollments.filter(e => e.course === "2-15_life_health" && e.cohort === "day").length} enrolled
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-black-glass rounded hover:bg-white/5 transition-colors">
                <div>
                  <p className="text-white font-medium">2-40 Evening</p>
                  <p className="text-gray-400 text-sm">Feb 5, 2024</p>
                </div>
                <span className="text-fuchsia font-bold">
                  {enrollments.filter(e => e.course === "2-40_property_casualty" && e.cohort === "evening").length} enrolled
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-black-glass rounded hover:bg-white/5 transition-colors">
                <div>
                  <p className="text-white font-medium">2-14 Weekend</p>
                  <p className="text-gray-400 text-sm">Feb 10, 2024</p>
                </div>
                <span className="text-vibrant-purple font-bold">
                  {enrollments.filter(e => e.course === "2-14_personal_lines" && e.cohort === "weekend").length} enrolled
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
