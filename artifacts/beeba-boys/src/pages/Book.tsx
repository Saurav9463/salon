import { useEffect, useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";
import { FALLBACK_SERVICES, FALLBACK_TEAM } from "@/lib/data";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, formatISO } from "date-fns";
import { Check } from "lucide-react";

export default function Book() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [servicesData, setServicesData] = useState<any[]>([]);
  const [teamData, setTeamData] = useState<any[]>([]);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    supabase.from("services").select("*").eq("active", true)
      .then(({ data }) => { if (data) setServicesData(data); });
    supabase.from("team").select("*").eq("active", true)
      .then(({ data }) => { if (data) setTeamData(data); });
  }, []);

  const services = servicesData?.length ? servicesData : FALLBACK_SERVICES;
  const team = teamData?.length ? teamData : FALLBACK_TEAM;

  const [step, setStep] = useState(1);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [stylistId, setStylistId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [details, setDetails] = useState({ client_name: "", client_email: "", client_phone: "" });

  const nextStep = () => setStep(s => Math.min(5, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const dates = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i));
  const times = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

  const toggleService = (id: string) => {
    setSelectedServiceIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const selectedServices = useMemo(
    () => services.filter(s => selectedServiceIds.includes(s.id)),
    [services, selectedServiceIds]
  );

  const totalPrice = selectedServices.reduce((sum, s) => sum + Number(s.price), 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + Number(s.duration_minutes), 0);
  const activeStylist = team.find(s => s.id === stylistId);
  const primaryService = selectedServices[0];

  const handleBook = async () => {
    setIsBooking(true);
    const { error } = await supabase.from("bookings").insert([{
      client_name: details.client_name,
      client_email: details.client_email || undefined,
      client_phone: details.client_phone,
      service_id: primaryService?.id,
      team_id: stylistId || undefined,
      appointment_date: date,
      appointment_time: time,
      status: "Pending",
    }]);
    setIsBooking(false);
    if (error) {
      console.error("Booking insert error:", error);
      toast({ title: "Error", description: error.message || "Failed to create booking.", variant: "destructive" });
    } else {
      setStep(5);
    }
  };

  const servicesByCategory = useMemo(() => {
    const map: Record<string, typeof services> = {};
    services.filter(s => s.active).forEach(s => {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    });
    return map;
  }, [services]);

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
                  {num === 1 ? "Services" : num === 2 ? "Stylist" : num === 3 ? "Time" : "Details"}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Services (multi-select) */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif">Select Services</h2>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Choose one or more</span>
              </div>

              {Object.entries(servicesByCategory).map(([category, catServices]) => (
                <div key={category} className="mb-6">
                  <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">{category}</div>
                  <div className="grid gap-3">
                    {catServices.map(service => {
                      const selected = selectedServiceIds.includes(service.id);
                      return (
                        <div
                          key={service.id}
                          onClick={() => toggleService(service.id)}
                          className={`p-5 border cursor-pointer transition-all flex justify-between items-center ${
                            selected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-colors ${selected ? "border-primary bg-primary" : "border-border"}`}>
                              {selected && <Check size={12} className="text-primary-foreground" />}
                            </div>
                            <div>
                              <h3 className="font-serif text-lg">{service.name}</h3>
                              <div className="text-xs text-muted-foreground mt-1">{service.duration_minutes} MIN</div>
                            </div>
                          </div>
                          <div className="font-mono text-lg text-right">₹{service.price}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {selectedServiceIds.length > 0 && (
                <div className="bg-card border border-primary/20 p-4 mb-6 flex justify-between items-center">
                  <div className="text-sm font-mono text-muted-foreground">
                    {selectedServiceIds.length} service{selectedServiceIds.length > 1 ? 's' : ''} · {totalDuration} min
                  </div>
                  <div className="font-mono text-lg text-primary">Total: ₹{totalPrice}</div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={nextStep}
                  disabled={selectedServiceIds.length === 0}
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
                    onClick={() => setStylistId(member.id)}
                    className={`p-6 border cursor-pointer transition-colors text-center ${stylistId === member.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"}`}
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
                  disabled={!stylistId}
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
                  {dates.map(d => {
                    const dateStr = formatISO(d, { representation: 'date' });
                    const isSelected = date === dateStr;
                    return (
                      <div
                        key={dateStr}
                        onClick={() => { setDate(dateStr); setTime(""); }}
                        className={`shrink-0 w-20 h-24 border flex flex-col items-center justify-center cursor-pointer transition-colors snap-center ${isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"}`}
                      >
                        <span className="text-xs font-mono uppercase mb-1">{format(d, "EEE")}</span>
                        <span className="font-serif text-2xl">{format(d, "dd")}</span>
                        <span className="text-xs">{format(d, "MMM")}</span>
                      </div>
                    );
                  })}
                </div>

                {date && (
                  <div className="mt-6 animate-in fade-in">
                    <h3 className="text-sm font-mono tracking-widest uppercase text-muted-foreground mb-4">Time</h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {times.map(t => (
                        <div
                          key={t}
                          onClick={() => setTime(t)}
                          className={`py-3 border text-center font-mono cursor-pointer transition-colors ${time === t ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"}`}
                        >
                          {t}
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
                  disabled={!date || !time}
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
                <div className="space-y-2 mb-4">
                  {selectedServices.map(s => (
                    <div key={s.id} className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">{s.name}</span>
                      <span className="font-mono text-sm">₹{s.price}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="text-muted-foreground">Barber</span>
                  <span className="font-serif">{activeStylist?.name}</span>
                </div>
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="text-muted-foreground">When</span>
                  <span className="font-mono">{date} at {time}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="text-muted-foreground font-mono text-sm">Total · {totalDuration} min</span>
                  <span className="font-mono text-xl text-primary">₹{totalPrice}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-mono tracking-widest uppercase text-muted-foreground mb-2">Name *</label>
                  <input
                    type="text"
                    value={details.client_name}
                    onChange={e => setDetails({...details, client_name: e.target.value})}
                    className="w-full bg-card border border-border p-4 text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono tracking-widest uppercase text-muted-foreground mb-2">Email</label>
                  <input
                    type="email"
                    value={details.client_email}
                    onChange={e => setDetails({...details, client_email: e.target.value})}
                    className="w-full bg-card border border-border p-4 text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono tracking-widest uppercase text-muted-foreground mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={details.client_phone}
                    onChange={e => setDetails({...details, client_phone: e.target.value})}
                    className="w-full bg-card border border-border p-4 text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button onClick={prevStep} className="text-muted-foreground hover:text-foreground font-mono uppercase tracking-widest text-sm">Back</button>
                <button
                  onClick={handleBook}
                  disabled={!details.client_name || !details.client_phone || isBooking}
                  className="ghost-btn-gold bg-primary text-primary-foreground hover:bg-primary/90 border-none px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBooking ? "Confirming..." : "Confirm Booking"}
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
              <p className="text-muted-foreground mb-2 max-w-md mx-auto">
                Thank you, {details.client_name}. Your appointment is confirmed for {date} at {time} with {activeStylist?.name}.
              </p>
              <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
                Services: {selectedServices.map(s => s.name).join(", ")}
              </p>
              <button onClick={() => setLocation("/")} className="ghost-btn-gold px-8 py-3">
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
