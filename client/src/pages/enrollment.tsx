import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GraduationCap, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Enrollment, Lead } from "@shared/schema";

export default function EnrollmentPage() {
  const [selectedLead, setSelectedLead] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCohort, setSelectedCohort] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: enrollments = [] } = useQuery<Enrollment[]>({
    queryKey: ["/api/enrollments"],
  });

  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const enrollmentMutation = useMutation({
    mutationFn: async (data: { leadId: number; course: string; cohort: string; startDate: string }) => {
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
      setSelectedLead("");
      setSelectedCourse("");
      setSelectedCohort("");
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
    if (!selectedLead || !selectedCourse || !selectedCohort) {
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
      leadId: parseInt(selectedLead),
      course: selectedCourse,
      cohort: selectedCohort,
      startDate: startDate.toISOString(),
    });
  };

  // Filter leads that haven't been enrolled yet
  const availableLeads = leads.filter(lead => 
    lead.status === "qualified" && 
    !enrollments.some(enrollment => enrollment.leadId === lead.id)
  );

  return (
    <div className="pt-20 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          <span className="text-neon-magenta">Enrollment</span>{" "}
          <span className="text-white">Management</span>
        </h2>

        {/* Enrollment Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Enrollments */}
          <div className="lg:col-span-2">
            <div className="card-glass p-6">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <GraduationCap className="text-neon-magenta mr-3" />
                Active Enrollments
              </h3>
              
              <div className="space-y-4">
                {enrollments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No active enrollments found</p>
                  </div>
                ) : (
                  enrollments.map((enrollment) => {
                    const lead = leads.find(l => l.id === enrollment.leadId);
                    if (!lead) return null;
                    
                    return (
                      <div key={enrollment.id} className="flex items-center justify-between p-4 bg-black-glass rounded-lg border border-white/10">
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
                            <p className="text-gray-400 text-sm">{enrollment.course}</p>
                            <p className="text-gray-400 text-xs">
                              {enrollment.cohort} Cohort - Starts {new Date(enrollment.startDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                            {enrollment.status}
                          </span>
                          <p className="text-gray-400 text-xs mt-1">
                            Progress: {enrollment.progress}%
                          </p>
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
            <div className="card-glass p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Plus className="text-electric-cyan mr-3" />
                Quick Enroll
              </h3>
              <div className="space-y-4">
                <Select value={selectedLead} onValueChange={setSelectedLead}>
                  <SelectTrigger className="form-glass">
                    <SelectValue placeholder="Select Lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLeads.map(lead => (
                      <SelectItem key={lead.id} value={lead.id.toString()}>
                        {lead.firstName} {lead.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="form-glass">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-15_life_health">2-15 Life & Health</SelectItem>
                    <SelectItem value="2-40_property_casualty">2-40 Property & Casualty</SelectItem>
                    <SelectItem value="2-14_personal_lines">2-14 Personal Lines</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedCohort} onValueChange={setSelectedCohort}>
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
                  disabled={enrollmentMutation.isPending}
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

            <div className="card-glass p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Calendar className="text-fuchsia mr-3" />
                Upcoming Cohorts
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-black-glass rounded">
                  <div>
                    <p className="text-white font-medium">2-15 Day Cohort</p>
                    <p className="text-gray-400 text-sm">Feb 1, 2024</p>
                  </div>
                  <span className="text-electric-cyan font-bold">12 enrolled</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black-glass rounded">
                  <div>
                    <p className="text-white font-medium">2-40 Evening</p>
                    <p className="text-gray-400 text-sm">Feb 5, 2024</p>
                  </div>
                  <span className="text-fuchsia font-bold">8 enrolled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
