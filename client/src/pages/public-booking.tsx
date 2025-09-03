import { useState } from "react";
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function PublicBooking() {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    appointmentType: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
    licenseGoal: ""
  });
  
  const { toast } = useToast();

  const appointmentTypes = [
    { value: "consultation", label: "Free Consultation (30 min)" },
    { value: "follow_up", label: "Follow-up Call (15 min)" },
    { value: "enrollment", label: "Enrollment Discussion (45 min)" },
    { value: "payment_discussion", label: "Payment Options (20 min)" }
  ];

  const licenseOptions = [
    { value: "2-15", label: "2-15 (Life & Health Insurance)" },
    { value: "2-40", label: "2-40 (Property & Casualty)" },
    { value: "2-14", label: "2-14 (Personal Lines)" }
  ];

  const timeSlots = [
    "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const appointmentDateTime = new Date(`${bookingData.appointmentDate}T${bookingData.appointmentTime}:00`);
      
      // First, create or find the lead
      const leadResponse = await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: bookingData.firstName,
          lastName: bookingData.lastName,
          email: bookingData.email,
          phone: bookingData.phone,
          licenseGoal: bookingData.licenseGoal,
          source: "public_booking",
          status: "new"
        })
      });
      
      const leadData = await leadResponse.json();
      
      // Then create the appointment
      const appointmentResponse = await fetch('/api/public/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: leadData.id,
          title: `${appointmentTypes.find(t => t.value === bookingData.appointmentType)?.label} - ${bookingData.firstName} ${bookingData.lastName}`,
          description: bookingData.notes,
          appointmentDate: appointmentDateTime.toISOString(),
          type: bookingData.appointmentType,
          status: "scheduled",
          location: "phone",
          notes: bookingData.notes
        })
      });
      
      if (appointmentResponse.ok) {
        setStep(3); // Success step
        toast({ 
          title: "Appointment Scheduled!", 
          description: "We'll send you a confirmation email shortly." 
        });
      } else {
        throw new Error('Failed to create appointment');
      }
    } catch (error) {
      toast({ 
        title: "Booking Failed", 
        description: "Please try again or contact us directly.", 
        variant: "destructive" 
      });
    }
  };

  const isStep1Valid = bookingData.firstName && bookingData.lastName && bookingData.email && bookingData.phone && bookingData.licenseGoal;
  const isStep2Valid = bookingData.appointmentType && bookingData.appointmentDate && bookingData.appointmentTime;

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">You're All Set!</h2>
          <p className="text-slate-300 mb-6">
            Your appointment has been scheduled successfully. We'll send you a confirmation email with all the details.
          </p>
          <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-white mb-2">Appointment Details:</h3>
            <p className="text-sm text-slate-300">
              {appointmentTypes.find(t => t.value === bookingData.appointmentType)?.label}
            </p>
            <p className="text-sm text-slate-300">
              {new Date(`${bookingData.appointmentDate}T${bookingData.appointmentTime}:00`).toLocaleDateString()} at {bookingData.appointmentTime}
            </p>
          </div>
          <Button 
            onClick={() => window.close()} 
            className="w-full bg-electric-cyan hover:bg-electric-cyan/80 text-slate-900 font-semibold"
          >
            Close Window
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Schedule Your Consultation</h1>
          <p className="text-slate-300">Book a free consultation to discuss your insurance licensing goals</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-electric-cyan text-slate-900' : 'bg-slate-600 text-white'} font-semibold mr-4`}>
            1
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-electric-cyan' : 'bg-slate-600'} mr-4`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-electric-cyan text-slate-900' : 'bg-slate-600 text-white'} font-semibold`}>
            2
          </div>
        </div>

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <User className="mr-3 text-electric-cyan" />
              Your Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-2">First Name *</label>
                <Input
                  value={bookingData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="bg-slate-900/50 border-slate-600 text-white"
                  placeholder="Your first name"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Last Name *</label>
                <Input
                  value={bookingData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="bg-slate-900/50 border-slate-600 text-white"
                  placeholder="Your last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-2 flex items-center">
                <Mail className="mr-2 w-4 h-4" />
                Email Address *
              </label>
              <Input
                type="email"
                value={bookingData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-2 flex items-center">
                <Phone className="mr-2 w-4 h-4" />
                Phone Number *
              </label>
              <Input
                type="tel"
                value={bookingData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-2">License Goal *</label>
              <Select value={bookingData.licenseGoal} onValueChange={(value) => handleInputChange("licenseGoal", value)}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select your target license" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {licenseOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={() => setStep(2)} 
              disabled={!isStep1Valid}
              className="w-full bg-electric-cyan hover:bg-electric-cyan/80 text-slate-900 font-semibold py-3"
            >
              Continue to Schedule
            </Button>
          </div>
        )}

        {/* Step 2: Appointment Details */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <Calendar className="mr-3 text-electric-cyan" />
              Schedule Details
            </h2>

            <div>
              <label className="block text-slate-300 mb-2">Appointment Type *</label>
              <Select value={bookingData.appointmentType} onValueChange={(value) => handleInputChange("appointmentType", value)}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {appointmentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-slate-300 mb-2">Preferred Date *</label>
              <Input
                type="date"
                value={bookingData.appointmentDate}
                onChange={(e) => handleInputChange("appointmentDate", e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-2 flex items-center">
                <Clock className="mr-2 w-4 h-4" />
                Preferred Time *
              </label>
              <Select value={bookingData.appointmentTime} onValueChange={(value) => handleInputChange("appointmentTime", value)}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-slate-300 mb-2 flex items-center">
                <MessageSquare className="mr-2 w-4 h-4" />
                Additional Notes (Optional)
              </label>
              <Textarea
                value={bookingData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white"
                placeholder="Any specific topics or questions you'd like to discuss..."
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={() => setStep(1)} 
                variant="outline"
                className="flex-1 border-slate-600 text-white hover:bg-slate-700"
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!isStep2Valid}
                className="flex-1 bg-electric-cyan hover:bg-electric-cyan/80 text-slate-900 font-semibold"
              >
                Schedule Appointment
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}