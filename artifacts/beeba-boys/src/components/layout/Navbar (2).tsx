import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/team", label: "Team" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Header — z-[1001] so it always stays above the menu overlay */}
      <header
        style={{ zIndex: 1001 }}
        className={`fixed top-0 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link href="/" style={{ zIndex: 1001, position: "relative" }} className="text-2xl font-serif font-bold tracking-widest text-primary">
            BEEBA BOYS
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-widest uppercase transition-colors relative group ${
                  location === link.href ? "text-primary" : "text-foreground hover:text-primary"
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-full h-[1px] bg-primary transform origin-left transition-transform duration-300 ${
                  location === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`} />
              </Link>
            ))}
            <Link
              href="/book"
              className="ml-4 font-mono text-xs uppercase tracking-widest transition-all duration-200"
              style={{ border: "1px solid #C9A96E", color: "#C9A96E", padding: "10px 24px", background: "transparent" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#C9A96E"; (e.currentTarget as HTMLElement).style.color = "#0A0A0A"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#C9A96E"; }}
            >
              Book Now
            </Link>
          </nav>

          {/* Mobile toggle — always on top via inline style */}
          <button
            style={{ zIndex: 1002, position: "relative" }}
            className="md:hidden p-2 flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X size={28} color="#F5F0EB" />
            ) : (
              <div className="flex flex-col gap-1.5">
                <span style={{ width: 24, height: 1, background: "#F5F0EB", display: "block" }} />
                <span style={{ width: 24, height: 1, background: "#C9A96E", display: "block" }} />
                <span style={{ width: 16, height: 1, background: "#F5F0EB", display: "block" }} />
              </div>
            )}
          </button>
        </div>
      </header>

      {/* Mobile fullscreen overlay — z-1000, BELOW the header (1001) so header stays visible */}
      {isOpen && (
        <div
          style={{ zIndex: 1000, background: "#0A0A0A" }}
          className="fixed inset-0 flex flex-col items-center justify-center gap-8 md:hidden"
        >
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-4xl font-serif text-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setIsOpen(false)}
            style={{
              border: "1px solid #C9A96E",
              color: "#C9A96E",
              padding: "14px 36px",
              fontSize: "0.75rem",
              fontFamily: "DM Mono, monospace",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginTop: "12px",
              display: "block",
            }}
          >
            Book Appointment
          </Link>
        </div>
      )}
    </>
  );
}
