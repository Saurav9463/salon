import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    const { error } = await supabase.from("messages").insert([{
      name: formData.name,
      email: formData.email,
      message: formData.message,
    }]);
    setIsPending(false);
    if (error) {
      toast({
        title: "Error",
        description: "Could not send message. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Message Sent",
        description: "We'll get back to you shortly.",
      });
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-6">Contact Us</h1>
          <div className="gold-divider w-24 mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you have a question or need a special appointment, our team is here for you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 pb-32 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-serif mb-8 border-b border-border pb-4">Get In Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-mono tracking-widest uppercase text-muted-foreground mb-2">Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-card border border-border p-4 text-foreground focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-mono tracking-widest uppercase text-muted-foreground mb-2">Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-card border border-border p-4 text-foreground focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-mono tracking-widest uppercase text-muted-foreground mb-2">Message</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-card border border-border p-4 text-foreground focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>
              <button 
                type="submit" 
                disabled={isPending}
                className="ghost-btn-gold w-full py-4 bg-primary text-primary-foreground hover:bg-primary/90 border-none disabled:opacity-50"
              >
                {isPending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
          
          <div>
            <h2 className="text-3xl font-serif mb-8 border-b border-border pb-4">Visit Us</h2>
            <div className="bg-card border border-border p-8 mb-8 space-y-6">
              <div className="flex gap-4">
                <MapPin className="text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif text-lg mb-1">Address</h4>
                  <p className="text-muted-foreground leading-relaxed">UGF 18, Silver Crown Plaza, PPR Market, Ravindra Nagar, Phase 2, Urban Estate phase II, Jalandhar, Punjab 144001</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif text-lg mb-1">Phone</h4>
                  <p className="text-muted-foreground">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif text-lg mb-1">Email</h4>
                  <p className="text-muted-foreground">hello@beebaboys.com</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif text-lg mb-1">Hours</h4>
                  <p className="text-muted-foreground">Mon–Sun: 10:00 AM – 9:00 PM</p>
                </div>
              </div>
            </div>
            
            {/* Map Placeholder */}
            <div className="w-full h-[300px] bg-muted border border-border flex items-center justify-center relative overflow-hidden">
              <div className="hero-noise opacity-50" />
              <div className="relative z-10 text-center">
                <MapPin className="text-primary mx-auto mb-2 opacity-50" size={32} />
                <span className="font-mono text-sm tracking-widest text-muted-foreground uppercase">Map View</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
