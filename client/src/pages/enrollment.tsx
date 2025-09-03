import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  GraduationCap, 
  Plus, 
  Calendar, 
  Clock,
  Award,
  FileText,
  Package,
  BookOpen,
  Send,
  User,
  Phone,
  Mail,
  Edit,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DocumentUploader } from "@/components/enrollment/document-uploader";
import type { Enrollment, Lead, EnrollmentDocument } from "@shared/schema";

interface EnrollmentWithLead extends Enrollment {
  lead: Lead;
  documents?: EnrollmentDocument[];
}

const COURSES = [
  { value: "2-15_life_health", label: "2-15 Life & Health Insurance" },
  { value: "2-40_property_casualty", label: "2-40 Property & Casualty Insurance" },
  { value: "2-14_personal_lines", label: "2-14 Personal Lines Insurance" },
];

const COHORTS = [
  { value: "morning", label: "Morning Classes (9:00 AM - 12:00 PM)" },
  { value: "evening", label: "Evening Classes (6:00 PM - 9:00 PM)" },
  { value: "weekend", label: "Weekend Classes (Saturday)" },
  { value: "online", label: "Online Self-Paced" },
];

const ENROLLMENT_STATUSES = [
  { value: "enrolled", label: "Enrolled", color: "bg-blue-500/20 text-blue-400" },
  { value: "active", label: "Active", color: "bg-green-500/20 text-green-400" },
  { value: "completed", label: "Completed", color: "bg-electric-cyan/20 text-electric-cyan" },
  { value: "dropped", label: "Dropped", color: "bg-red-500/20 text-red-400" },
];

export default function EnrollmentPage() {
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentWithLead | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEnrollment, setNewEnrollment] = useState({
    leadId: "",
    course: "2-15_life_health",
    cohort: "morning",
    startDate: "",
    status: "enrolled",
    progress: 0,
  });
  const { toast } = useToast();

  // Fetch enrollments with lead data
  const { data: enrollments = [], isLoading } = useQuery<EnrollmentWithLead[]>({
    queryKey: ["/api/enrollments"],
  });

  // Fetch available leads for enrollment
  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  // Fetch enrollment documents
  const { data: enrollmentDocuments = [] } = useQuery<EnrollmentDocument[]>({
    queryKey: ["/api/enrollment-documents"],
  });

  const createEnrollmentMutation = useMutation({
    mutationFn: async (enrollment: typeof newEnrollment) => {
      return await apiRequest("/api/enrollments", "POST", {
        ...enrollment,
        leadId: parseInt(enrollment.leadId),
        startDate: new Date(enrollment.startDate).toISOString(),
        progress: parseInt(enrollment.progress.toString()),
      });
    },
    onSuccess: () => {
      toast({
        title: "Enrollment created",
        description: "New student enrollment has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
      setShowCreateForm(false);
      setNewEnrollment({
        leadId: "",
        course: "2-15_life_health",
        cohort: "morning", 
        startDate: "",
        status: "enrolled",
        progress: 0,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Enrollment failed",
        description: error.message || "Failed to create enrollment.",
        variant: "destructive",
      });
    },
  });

  const updateEnrollmentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Enrollment> }) => {
      return await apiRequest(`/api/enrollments/${id}`, "PATCH", updates);
    },
    onSuccess: () => {
      toast({
        title: "Enrollment updated",
        description: "Enrollment has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update enrollment.",
        variant: "destructive",
      });
    },
  });

  const handleCreateEnrollment = () => {
    createEnrollmentMutation.mutate(newEnrollment);
  };

  const handleUpdateProgress = (enrollmentId: number, progress: number) => {
    updateEnrollmentMutation.mutate({ id: enrollmentId, updates: { progress } });
  };

  const handleUpdateStatus = (enrollmentId: number, status: string) => {
    updateEnrollmentMutation.mutate({ id: enrollmentId, updates: { status } });
  };

  const getStatusColor = (status: string) => {
    return ENROLLMENT_STATUSES.find(s => s.value === status)?.color || "bg-slate-500/20 text-slate-400";
  };

  const getCourseLabel = (course: string) => {
    return COURSES.find(c => c.value === course)?.label || course;
  };

  const getCohortLabel = (cohort: string) => {
    return COHORTS.find(c => c.value === cohort)?.label || cohort;
  };

  const getEnrollmentDocuments = (enrollmentId: number) => {
    return enrollmentDocuments.filter(doc => doc.enrollmentId === enrollmentId);
  };

  const generateEnrollmentPackage = (enrollment: EnrollmentWithLead) => {
    const documents = getEnrollmentDocuments(enrollment.id);
    if (documents.length === 0) {
      toast({
        title: "No documents",
        description: "Upload documents first before generating enrollment package.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Package generated",
      description: `Enrollment package created with ${documents.length} documents.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-800 rounded mb-4 w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-slate-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <GraduationCap className="h-8 w-8 text-electric-cyan" />
                Student Enrollment Management
              </h1>
              <p className="text-slate-400">Manage course enrollments, documents, and student progress</p>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-electric-cyan hover:bg-electric-cyan/80 text-slate-900 font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Enrollment
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stat-card p-6 text-center">
            <Users className="w-8 h-8 mx-auto text-electric-cyan mb-2" />
            <div className="text-2xl font-bold text-white">{enrollments.length}</div>
            <div className="text-sm text-slate-400">Total Enrollments</div>
          </div>
          <div className="stat-card p-6 text-center">
            <CheckCircle className="w-8 h-8 mx-auto text-green-400 mb-2" />
            <div className="text-2xl font-bold text-white">
              {enrollments.filter(e => e.status === 'active').length}
            </div>
            <div className="text-sm text-slate-400">Active Students</div>
          </div>
          <div className="stat-card p-6 text-center">
            <Award className="w-8 h-8 mx-auto text-yellow-400 mb-2" />
            <div className="text-2xl font-bold text-white">
              {enrollments.filter(e => e.status === 'completed').length}
            </div>
            <div className="text-sm text-slate-400">Completed</div>
          </div>
          <div className="stat-card p-6 text-center">
            <FileText className="w-8 h-8 mx-auto text-purple-400 mb-2" />
            <div className="text-2xl font-bold text-white">{enrollmentDocuments.length}</div>
            <div className="text-sm text-slate-400">Documents</div>
          </div>
        </div>

        {/* Create Enrollment Form */}
        {showCreateForm && (
          <Card className="bg-slate-900 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Enrollment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Student
                  </label>
                  <select 
                    value={newEnrollment.leadId}
                    onChange={(e) => setNewEnrollment(prev => ({ ...prev, leadId: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white focus:ring-electric-cyan focus:border-electric-cyan"
                  >
                    <option value="">Select a student</option>
                    {leads
                      .filter(lead => !enrollments.some(e => e.leadId === lead.id))
                      .map(lead => (
                        <option key={lead.id} value={lead.id.toString()}>
                          {lead.firstName} {lead.lastName} - {lead.phone}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Course
                  </label>
                  <select 
                    value={newEnrollment.course}
                    onChange={(e) => setNewEnrollment(prev => ({ ...prev, course: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white focus:ring-electric-cyan focus:border-electric-cyan"
                  >
                    {COURSES.map(course => (
                      <option key={course.value} value={course.value}>
                        {course.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Cohort
                  </label>
                  <select 
                    value={newEnrollment.cohort}
                    onChange={(e) => setNewEnrollment(prev => ({ ...prev, cohort: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white focus:ring-electric-cyan focus:border-electric-cyan"
                  >
                    {COHORTS.map(cohort => (
                      <option key={cohort.value} value={cohort.value}>
                        {cohort.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={newEnrollment.startDate}
                    onChange={(e) => setNewEnrollment(prev => ({ ...prev, startDate: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                  className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateEnrollment}
                  disabled={!newEnrollment.leadId || !newEnrollment.startDate || createEnrollmentMutation.isPending}
                  className="bg-electric-cyan hover:bg-electric-cyan/80 text-slate-900"
                >
                  Create Enrollment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enrollments List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enrollments Cards */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Current Enrollments</h2>
            {enrollments.length === 0 ? (
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="text-center py-12">
                  <GraduationCap className="h-16 w-16 mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-400 text-lg mb-2">No enrollments yet</p>
                  <p className="text-slate-500 text-sm">Create your first student enrollment to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment) => {
                  const documents = getEnrollmentDocuments(enrollment.id);
                  
                  return (
                    <Card key={enrollment.id} className="bg-slate-900 border-slate-700 hover:border-electric-cyan/30 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">
                                {enrollment.lead.firstName} {enrollment.lead.lastName}
                              </h3>
                              <Badge className={getStatusColor(enrollment.status)}>
                                {enrollment.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-slate-400 space-y-1">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                {getCourseLabel(enrollment.course)}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {getCohortLabel(enrollment.cohort)}
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Started: {new Date(enrollment.startDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {enrollment.lead.phone}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-electric-cyan mb-1">
                              {enrollment.progress}%
                            </div>
                            <div className="text-xs text-slate-400">Progress</div>
                            <div className="w-16 h-2 bg-slate-700 rounded-full mt-2">
                              <div 
                                className="h-2 bg-electric-cyan rounded-full transition-all duration-300"
                                style={{ width: `${enrollment.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Document Summary */}
                        <div className="flex items-center justify-between py-3 px-4 bg-slate-800/50 rounded-lg mb-4">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-purple-400" />
                            <span className="text-sm text-slate-300">
                              Enrollment Package: {documents.length} documents
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => generateEnrollmentPackage(enrollment)}
                              disabled={documents.length === 0}
                              className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Generate
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedEnrollment(enrollment)}
                              className="bg-electric-cyan/20 border-electric-cyan/30 text-electric-cyan hover:bg-electric-cyan/30"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Manage
                            </Button>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-2">
                          <select 
                            value={enrollment.status}
                            onChange={(e) => handleUpdateStatus(enrollment.id, e.target.value)}
                            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white text-sm focus:ring-electric-cyan focus:border-electric-cyan"
                          >
                            {ENROLLMENT_STATUSES.map(status => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                          
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={enrollment.progress}
                            onChange={(e) => handleUpdateProgress(enrollment.id, parseInt(e.target.value))}
                            className="w-full h-8 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Document Management Panel */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Document Management</h2>
            {selectedEnrollment ? (
              <div className="space-y-6">
                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {selectedEnrollment.lead.firstName} {selectedEnrollment.lead.lastName}
                    </CardTitle>
                    <p className="text-slate-400">
                      {getCourseLabel(selectedEnrollment.course)} - {getCohortLabel(selectedEnrollment.cohort)}
                    </p>
                  </CardHeader>
                </Card>

                <DocumentUploader 
                  enrollmentId={selectedEnrollment.id}
                  documents={getEnrollmentDocuments(selectedEnrollment.id)}
                />
              </div>
            ) : (
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-400 text-lg mb-2">No enrollment selected</p>
                  <p className="text-slate-500 text-sm">Select an enrollment to manage documents</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}