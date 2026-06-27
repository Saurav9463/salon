import { Link } from "wouter";
import { Instagram, Facebook, Twitter, MapPin, Phone, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-serif font-bold tracking-widest text-primary block mb-6">
              BEEBA BOYS
            </Link>
            <p className="text-muted-foreground mb-6">
              Where Precision Meets Style. A premium men's grooming salon merging high-end editorial with street-sharp barbershop culture.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-serif text-lg text-foreground mb-6 uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/team" className="text-muted-foreground hover:text-primary transition-colors">Our Team</Link></li>
              <li><Link href="/gallery" className="text-muted-foreground hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg text-foreground mb-6 uppercase tracking-widest">Visit Us</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary mt-1 shrink-0" size={18} />
                <span>UGF 18, Silver Crown Plaza, PPR Market, Ravindra Nagar, Phase 2, Jalandhar, Punjab 144001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-primary shrink-0" size={18} />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg text-foreground mb-6 uppercase tracking-widest">Hours</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-center gap-3">
                <Clock className="text-primary shrink-0" size={18} />
                <div>
                  <p className="text-foreground">Monday – Sunday</p>
                  <p>10:00 AM – 9:00 PM</p>
                </div>
              </li>
            </ul>
            <div className="mt-8">
              <Link href="/book" className="ghost-btn-gold px-6 py-3 block text-center w-full">
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Beeba Boys Barbershop. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/admin/login" className="hover:text-primary transition-colors">Admin Login</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
