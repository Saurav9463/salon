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

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

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
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-bold tracking-widest text-primary z-50">
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
                <span
                  className={`absolute -bottom-1 left-0 w-full h-[1px] bg-primary transform origin-left transition-transform duration-300 ${
                    location === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}

            <Link
              href="/book"
              className="ml-4 font-mono text-xs uppercase tracking-widest transition-all duration-200"
              style={{
                border: "1px solid #C9A96E",
                color: "#C9A96E",
                padding: "10px 24px",
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
              Book Now
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 z-[1000] relative"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X size={24} className="text-foreground" />
            ) : (
              <>
                <span className="w-6 h-px bg-foreground block" />
                <span className="w-6 h-px bg-primary block" />
                <span className="w-4 h-px bg-foreground block" />
              </>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Fullscreen Menu — rendered outside header so z-index works correctly */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-10 md:hidden"
          style={{ zIndex: 999 }}
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
              padding: "16px 40px",
              fontSize: "0.75rem",
              fontFamily: "DM Mono, monospace",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginTop: "16px",
            }}
          >
            Book Appointment
          </Link>
        </div>
      )}
    </>
  );
}
