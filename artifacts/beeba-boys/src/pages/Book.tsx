import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useListServices, useListTeam, useCreateBooking } from "@workspace/api-client-react";
import { FALLBACK_SERVICES, FALLBACK_TEAM } from "@/lib/data";
import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, formatISO } from "date-fns";
import { Check, ChevronRight } from "lucide-react";

export default function Book() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: servicesData } = useListServices();
  const { data: teamData } = useListTeam();
  const createBooking = useCreateBooking();

  const services = servicesData?.length ? servicesData : FALLBACK_SERVICES;
  const team = teamData?.length ? teamData : FALLBACK_TEAM;

  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState({
    service_id: "",
    stylist_id: "",
    appointment_date: "",
    appointment_time: "",
    client_name: "",
    client_email: "",
    client_phone: ""
  });

  const nextStep = () => setStep(s => Math.min(5, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  // Generate some dates
  const dates = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i));
  const times = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

  const handleBook = () => {
    createBooking.mutate({ data: booking }, {
      onSuccess: () => {
        setStep(5);
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to create booking.", variant: "destructive" });
      }
    });
  };

  const activeService = services.find(s => s.id === booking.service_id);
  const activeStylist = team.find(s => s.id === booking.stylist_id);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-serif text-center mb-8">Book Appointment</h1>
          
          {/* Progress */}
          <div className="flex justify-between items-center mb-12 border-b border-border pb-6">
            {[1, 2, 3, 4].map(num => (
              <div key={num} className={`flex flex-col items-center ${step >= num ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono text-sm mb-2 ${step >= num ? "border-primary bg-primary/10" : "border-border"}`}>
                  {step > num ? <Check size={14} /> : num}
                </div>
                <span className="text-xs uppercase tracking-widest hidden md:block">
                  {num === 1 ? "Service" : num === 2 ? "Stylist" : num === 3 ? "Time" : "Details"}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Service */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-serif mb-6">Select a Service</h2>
              <div className="grid gap-4">
                {services.filter(s => s.active).map(service => (
                  <div 
                    key={service.id} 
                    onClick={() => setBooking({ ...booking, service_id: service.id })}
                    className={`p-6 border cursor-pointer transition-colors flex justify-between items-center ${booking.service_id === service.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"}`}
                  >
                    <div>
                      <div className="text-xs text-primary font-mono tracking-widest uppercase mb-1">{service.category}</div>
                      <h3 className="font-serif text-xl">{service.name}</h3>
                      <div className="text-sm text-muted-foreground mt-2">{service.duration_minutes} MIN</div>
                    </div>
                    <div className="font-mono text-lg">₹{service.price}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={nextStep} 
                  disabled={!booking.service_id}
                  className="ghost-btn-gold px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Stylist */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-serif mb-6">Select a Barber</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team.filter(t => t.active).map(member => (
                  <div 
                    key={member.id} 
                    onClick={() => setBooking({ ...booking, stylist_id: member.id })}
                    className={`p-6 border cursor-pointer transition-colors text-center ${booking.stylist_id === member.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"}`}
                  >
                    <div className="w-20 h-20 mx-auto bg-muted rounded-full mb-4 flex items-center justify-center overflow-hidden border border-border">
                      {member.photo_url ? (
                        <img src={member.photo_url} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <span className="font-serif text-2xl text-muted-foreground">{member.name.charAt(0)}</span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl mb-1">{member.name}</h3>
                    <div className="text-xs text-primary font-mono tracking-widest uppercase">{member.role}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={prevStep} className="text-muted-foreground hover:text-foreground font-mono uppercase tracking-widest text-sm">Back</button>
                <button 
                  onClick={nextStep} 
                  disabled={!booking.stylist_id}
                  className="ghost-btn-gold px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Date/Time */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-serif mb-6">Select Date & Time</h2>
              <div className="bg-card border border-border p-6 mb-6">
                <h3 className="text-sm font-mono tracking-widest uppercase text-muted-foreground mb-4">Date</h3>
                <div className="flex gap-3 overflow-x-auto pb-4 snap-x">
                  {dates.map(date => {
                    const dateStr = formatISO(date, { representation: 'date' });
                    const isSelected = booking.appointment_date === dateStr;
                    return (
                      <div 
                        key={dateStr}
                        onClick={() => setBooking({ ...booking, appointment_date: dateStr, appointment_time: "" })}
                        className={`shrink-0 w-20 h-24 border flex flex-col items-center justify-center cursor-pointer transition-colors snap-center ${isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"}`}
                      >
                        <span className="text-xs font-mono uppercase mb-1">{format(date, "EEE")}</span>
                        <span className="font-serif text-2xl">{format(date, "dd")}</span>
                        <span className="text-xs">{format(date, "MMM")}</span>
                      </div>
                    )
                  })}
                </div>

                {booking.appointment_date && (
                  <div className="mt-6 animate-in fade-in">
                    <h3 className="text-sm font-mono tracking-widest uppercase text-muted-foreground mb-4">Time</h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {times.map(time => (
                        <div 
                          key={time}
                          onClick={() => setBooking({ ...booking, appointment_time: time })}
                          className={`py-3 border text-center font-mono cursor-pointer transition-colors ${booking.appointment_time === time ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"}`}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={prevStep} className="text-muted-foreground hover:text-foreground font-mono uppercase tracking-widest text-sm">Back</button>
                <button 
                  onClick={nextStep} 
                  disabled={!booking.appointment_date || !booking.appointment_time}
                  className="ghost-btn-gold px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Details */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-serif mb-6">Your Details</h2>
              <div className="bg-card border border-border p-6 mb-8">
                <h3 className="font-serif text-lg border-b border-border pb-4 mb-4">Summary</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-serif">{activeService?.name}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Barber</span>
                  <span className="font-serif">{activeStylist?.name}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">When</span>
                  <span className="font-mono">{booking.appointment_date} at {booking.appointment_time}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-mono text-xl text-primary">₹{activeService?.price}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-mono tracking-widest uppercase text-muted-foreground mb-2">Name</label>
                  <input 
                    type="text" 
                    value={booking.client_name}
                    onChange={e => setBooking({...booking, client_name: e.target.value})}
                    className="w-full bg-card border border-border p-4 text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono tracking-widest uppercase text-muted-foreground mb-2">Email</label>
                  <input 
                    type="email" 
                    value={booking.client_email}
                    onChange={e => setBooking({...booking, client_email: e.target.value})}
                    className="w-full bg-card border border-border p-4 text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono tracking-widest uppercase text-muted-foreground mb-2">Phone</label>
                  <input 
                    type="tel" 
                    value={booking.client_phone}
                    onChange={e => setBooking({...booking, client_phone: e.target.value})}
                    className="w-full bg-card border border-border p-4 text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button onClick={prevStep} className="text-muted-foreground hover:text-foreground font-mono uppercase tracking-widest text-sm">Back</button>
                <button 
                  onClick={handleBook} 
                  disabled={!booking.client_name || !booking.client_phone || createBooking.isPending}
                  className="ghost-btn-gold bg-primary text-primary-foreground hover:bg-primary/90 border-none px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createBooking.isPending ? "Confirming..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="animate-in fade-in zoom-in duration-500 text-center py-12">
              <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary flex items-center justify-center mx-auto mb-8 text-primary">
                <Check size={40} />
              </div>
              <h2 className="text-4xl font-serif mb-4">Booking Confirmed</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Thank you, {booking.client_name}. Your appointment is confirmed for {booking.appointment_date} at {booking.appointment_time} with {activeStylist?.name}.
              </p>
              <button 
                onClick={() => setLocation("/")}
                className="ghost-btn-gold px-8 py-3"
              >
                Return to Home
              </button>
            </div>
          )}

        </div>
      </div>
      
      <Footer />
    </div>
  );
}
