import { Link } from "wouter";
import { Instagram, Facebook, Twitter, MapPin, Phone, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1">
            <Link href="/" className="text-2xl font-serif font-bold tracking-widest text-primary block mb-6">
              BEEBA BOYS
            </Link>
            <p className="text-muted-foreground mb-6">
              Where Precision Meets Style. A premium men's grooming salon merging high-end editorial with street-sharp barbershop culture.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg text-foreground mb-6 uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-4">
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "Services" },
                { href: "/team", label: "Our Team" },
                { href: "/gallery", label: "Gallery" },
                { href: "/contact", label: "Contact" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
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
            <ul className="space-y-4 text-muted-foreground mb-8">
              <li className="flex items-center gap-3">
                <Clock className="text-primary shrink-0" size={18} />
                <div>
                  <p className="text-foreground">Monday – Sunday</p>
                  <p>10:00 AM – 9:00 PM</p>
                </div>
              </li>
            </ul>
            <Link
              href="/book"
              className="block text-center font-mono text-xs uppercase tracking-widest transition-all duration-200"
              style={{
                border: "1px solid #C9A96E",
                color: "#C9A96E",
                padding: "12px 28px",
                background: "transparent",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "#C9A96E";
                (e.currentTarget as HTMLElement).style.color = "#0A0A0A";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "#C9A96E";
              }}
            >
              Book Appointment
            </Link>
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
