import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, MapPin, FileText, Tag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Lead, InsertAppointment } from "@shared/schema";

interface CalendarBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  selectedTime: string | null;
}

export function CalendarBookingModal({
  isOpen,
  onClose,
  selectedDate,
  selectedTime
}: CalendarBookingModalProps) {
  const [formData, setFormData] = useState({
    leadId: "",
    title: "",
    description: "",
    duration: 60,
    type: "consultation",
    location: "phone",
    notes: ""
  });

  const queryClient = useQueryClient();

  // Fetch leads for selection
  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
    enabled: isOpen
  });

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: (appointmentData: InsertAppointment) => 
      apiRequest("/api/appointments", "POST", appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({ 
        title: "Appointment created successfully",
        description: `Appointment scheduled for ${selectedDate?.toLocaleDateString()} at ${selectedTime}`,
        duration: 4000 
      });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({ 
        title: "Failed to create appointment", 
        variant: "destructive",
        duration: 3000 
      });
    },
  });

  const resetForm = () => {
    setFormData({
      leadId: "",
      title: "",
      description: "",
      duration: 60,
      type: "consultation",
      location: "phone",
      notes: ""
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !formData.leadId || !formData.title) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    // Combine date and time
    const [hours, minutes] = selectedTime.split(':');
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const appointmentData: InsertAppointment = {
      leadId: parseInt(formData.leadId),
      title: formData.title,
      description: formData.description || null,
      appointmentDate,
      duration: formData.duration,
      type: formData.type,
      location: formData.location || null,
      notes: formData.notes || null,
      status: "scheduled",
      reminderSent: false
    };

    createAppointmentMutation.mutate(appointmentData);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white text-lg font-bold">
            Book Appointment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date & Time Display */}
          <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-electric-cyan mb-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Selected Date & Time</span>
            </div>
            <p className="text-white">
              {selectedDate?.toLocaleDateString("en-US", { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} at {selectedTime}
            </p>
          </div>

          {/* Lead Selection */}
          <div className="space-y-2">
            <Label htmlFor="leadId" className="text-slate-300 flex items-center gap-2">
              <User className="h-4 w-4" />
              Lead *
            </Label>
            <Select value={formData.leadId} onValueChange={(value) => setFormData(prev => ({ ...prev, leadId: value }))}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Select a lead" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {leads.map((lead) => (
                  <SelectItem key={lead.id} value={lead.id.toString()} className="text-white hover:bg-slate-700">
                    {lead.firstName} {lead.lastName} ({lead.phone})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Appointment Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-300 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Initial consultation, Follow-up call"
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          {/* Appointment Type */}
          <div className="space-y-2">
            <Label className="text-slate-300 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Appointment Type
            </Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="consultation" className="text-white hover:bg-slate-700">Consultation</SelectItem>
                <SelectItem value="follow_up" className="text-white hover:bg-slate-700">Follow-up</SelectItem>
                <SelectItem value="enrollment" className="text-white hover:bg-slate-700">Enrollment</SelectItem>
                <SelectItem value="payment_discussion" className="text-white hover:bg-slate-700">Payment Discussion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Duration */}
            <div className="space-y-2">
              <Label className="text-slate-300 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Duration (min)
              </Label>
              <Select value={formData.duration.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="30" className="text-white hover:bg-slate-700">30 min</SelectItem>
                  <SelectItem value="45" className="text-white hover:bg-slate-700">45 min</SelectItem>
                  <SelectItem value="60" className="text-white hover:bg-slate-700">60 min</SelectItem>
                  <SelectItem value="90" className="text-white hover:bg-slate-700">90 min</SelectItem>
                  <SelectItem value="120" className="text-white hover:bg-slate-700">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="text-slate-300 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="phone" className="text-white hover:bg-slate-700">Phone Call</SelectItem>
                  <SelectItem value="zoom" className="text-white hover:bg-slate-700">Zoom Meeting</SelectItem>
                  <SelectItem value="in_person" className="text-white hover:bg-slate-700">In Person</SelectItem>
                  <SelectItem value="office" className="text-white hover:bg-slate-700">Office Visit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-slate-300">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the appointment..."
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 h-20"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-slate-300">Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Internal notes, reminders, special instructions..."
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 h-20"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createAppointmentMutation.isPending}
              className="flex-1 bg-electric-cyan hover:bg-electric-cyan/80 text-slate-900 font-bold"
            >
              {createAppointmentMutation.isPending ? "Creating..." : "Book Appointment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}