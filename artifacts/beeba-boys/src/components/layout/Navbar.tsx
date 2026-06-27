import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/team", label: "Team" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
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

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Nav */}
        <div
          className={`fixed inset-0 bg-background flex flex-col items-center justify-center gap-8 transition-transform duration-500 ease-in-out z-40 md:hidden ${
            mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-2xl font-serif tracking-widest ${
                location === link.href ? "text-primary" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setMobileMenuOpen(false)}
            className="font-mono text-sm uppercase tracking-widest mt-4"
            style={{ border: "1px solid #C9A96E", color: "#C9A96E", padding: "12px 32px" }}
          >
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}
