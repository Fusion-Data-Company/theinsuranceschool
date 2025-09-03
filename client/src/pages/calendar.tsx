import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarBookingModal } from "@/components/calendar/calendar-booking-modal";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus,
  User,
  Phone,
  MapPin,
  FileText
} from "lucide-react";
import type { Appointment, Lead } from "@shared/schema";

interface CalendarProps {}

export default function CalendarPage({}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Fetch appointments
  const { data: appointments = [] } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"]
  });

  // Fetch leads for display
  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/leads"]
  });

  // Create lead lookup map
  const leadsMap = useMemo(() => {
    return leads.reduce((acc, lead) => {
      acc[lead.id] = lead;
      return acc;
    }, {} as Record<number, Lead>);
  }, [leads]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    
    return days;
  }, [currentDate]);

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return appointments.filter(appointment => 
      new Date(appointment.appointmentDate).toDateString() === dateStr
    );
  };

  // Available time slots
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    // Check if slot is already booked
    const dayAppointments = getAppointmentsForDate(date);
    const isBooked = dayAppointments.some(apt => {
      const aptTime = new Date(apt.appointmentDate);
      const timeString = `${aptTime.getHours().toString().padStart(2, '0')}:${aptTime.getMinutes().toString().padStart(2, '0')}`;
      return timeString === time;
    });

    if (isBooked) return;

    setSelectedDate(date);
    setSelectedTime(time);
    setIsBookingModalOpen(true);
  };

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'follow_up': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'enrollment': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'payment_discussion': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-electric-cyan/20 text-electric-cyan border-electric-cyan/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'no_show': return 'bg-red-800/20 text-red-300 border-red-800/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const today = new Date();
  const isToday = (date: Date) => date.toDateString() === today.toDateString();
  const isCurrentMonth = (date: Date) => date.getMonth() === currentDate.getMonth();

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Calendar</h1>
              <p className="text-slate-400">Schedule and manage appointments</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigateMonth('prev')}
                  className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-white font-medium min-w-[150px] text-center">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigateMonth('next')}
                  className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-6">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-3 text-center text-sm font-medium text-slate-400">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((date, index) => {
                    const dayAppointments = getAppointmentsForDate(date);
                    return (
                      <div 
                        key={index}
                        className={`
                          min-h-[120px] p-2 border rounded-lg cursor-pointer transition-all
                          ${isCurrentMonth(date) ? 'bg-slate-800 border-slate-600' : 'bg-slate-850 border-slate-700'}
                          ${isToday(date) ? 'ring-2 ring-electric-cyan/50' : ''}
                          hover:bg-slate-750
                        `}
                      >
                        <div className={`
                          text-sm font-medium mb-2
                          ${isCurrentMonth(date) ? 'text-white' : 'text-slate-500'}
                          ${isToday(date) ? 'text-electric-cyan' : ''}
                        `}>
                          {date.getDate()}
                        </div>
                        
                        <div className="space-y-1">
                          {dayAppointments.map((appointment, aptIndex) => {
                            const lead = leadsMap[appointment.leadId];
                            const aptTime = new Date(appointment.appointmentDate);
                            const timeStr = `${aptTime.getHours().toString().padStart(2, '0')}:${aptTime.getMinutes().toString().padStart(2, '0')}`;
                            
                            return (
                              <div 
                                key={aptIndex}
                                className={`
                                  p-1 rounded text-xs font-medium border
                                  ${getAppointmentTypeColor(appointment.type)}
                                  hover:opacity-80 cursor-pointer
                                `}
                                title={`${timeStr} - ${appointment.title} - ${lead?.firstName} ${lead?.lastName}`}
                              >
                                <div className="truncate">
                                  {timeStr} {appointment.title}
                                </div>
                                {lead && (
                                  <div className="truncate opacity-75">
                                    {lead.firstName} {lead.lastName}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time Slots & Quick Book */}
          <div className="space-y-6">
            {/* Time Slots for Today */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {timeSlots.slice(0, 8).map(time => {
                  const todayAppointments = getAppointmentsForDate(today);
                  const isBooked = todayAppointments.some(apt => {
                    const aptTime = new Date(apt.appointmentDate);
                    const timeString = `${aptTime.getHours().toString().padStart(2, '0')}:${aptTime.getMinutes().toString().padStart(2, '0')}`;
                    return timeString === time;
                  });

                  return (
                    <Button
                      key={time}
                      variant="outline"
                      size="sm"
                      disabled={isBooked}
                      onClick={() => handleTimeSlotClick(today, time)}
                      className={`
                        w-full justify-start
                        ${isBooked 
                          ? 'bg-red-900/20 border-red-600/30 text-red-400 cursor-not-allowed' 
                          : 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700 hover:border-electric-cyan/50'
                        }
                      `}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {time} {isBooked ? '(Booked)' : ''}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments
                    .filter(apt => new Date(apt.appointmentDate) >= today)
                    .slice(0, 5)
                    .map(appointment => {
                      const lead = leadsMap[appointment.leadId];
                      const aptDate = new Date(appointment.appointmentDate);
                      
                      return (
                        <div key={appointment.id} className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-white font-medium text-sm">
                              {appointment.title}
                            </span>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {aptDate.toLocaleDateString()} at {aptDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                            
                            {lead && (
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3" />
                                {lead.firstName} {lead.lastName}
                              </div>
                            )}
                            
                            {appointment.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                {appointment.location}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  
                  {appointments.filter(apt => new Date(apt.appointmentDate) >= today).length === 0 && (
                    <p className="text-slate-500 text-sm text-center py-4">
                      No upcoming appointments
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking Modal */}
        <CalendarBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />
      </div>
    </div>
  );
}