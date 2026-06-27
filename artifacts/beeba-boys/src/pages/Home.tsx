import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { useListServices, useListTeam } from "@workspace/api-client-react";
import { FALLBACK_SERVICES, FALLBACK_TEAM, TESTIMONIALS } from "@/lib/data";
import { ArrowRight } from "lucide-react";

import shopInterior2 from "@assets/WhatsApp_Image_2026-06-27_at_17.30.42_1782561889403.jpeg";
import haircut1 from "@assets/WhatsApp_Image_2026-06-27_at_17.30.34_1782561889402.jpeg";
import haircut2 from "@assets/WhatsApp_Image_2026-06-27_at_17.30.48_1782561889406.jpeg";
import haircut3 from "@assets/WhatsApp_Image_2026-06-27_at_17.30.55_1782561889407.jpeg";

export default function Home() {
  const { data: servicesData } = useListServices();
  const { data: teamData } = useListTeam();

  const services = servicesData?.length ? servicesData : FALLBACK_SERVICES;
  const team = teamData?.length ? teamData : FALLBACK_TEAM;

  const previewServices = services.slice(0, 4);
  const galleryImages = [haircut1, haircut2, haircut3];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="hero-noise opacity-40" />

        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: `url(${shopInterior2})` }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          {/* Eyebrow */}
          <p
            className="font-mono uppercase mb-4 tracking-[0.25em]"
            style={{ fontSize: 11, color: "rgba(201,169,110,0.70)" }}
          >
            Established · Jalandhar · Punjab
          </p>
          {/* Gold line */}
          <div className="gold-divider w-[120px] mx-auto mb-8" />

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-foreground mb-6 tracking-tight leading-none">
            BEEBA <span className="text-primary italic">BOYS</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground uppercase tracking-[0.2em] mb-12">
            Where Precision Meets Style
          </p>
          <Link href="/book" className="ghost-btn-gold px-10 py-4 text-lg">
            Book Appointment
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1">
          <div className="scroll-line" />
        </div>
      </section>

      {/* ─── Philosophy ───────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-background relative">
        <div className="container mx-auto max-w-4xl text-center">
          <p
            className="font-mono uppercase mb-6 tracking-[0.3em]"
            style={{ fontSize: 11, color: "#C9A96E" }}
          >
            Our Philosophy
          </p>
          <div className="gold-divider w-[80px] mx-auto mb-8" />
          <p className="text-3xl md:text-5xl font-serif leading-tight text-foreground">
            A sanctuary of{" "}
            <span className="italic text-primary">refined masculinity</span>{" "}
            where high-end editorial meets street-sharp culture.
          </p>
          <div
            className="mx-auto mt-20 mb-0"
            style={{ height: 1, background: "#1E1E1E", maxWidth: 480 }}
          />
        </div>
      </section>

      {/* ─── Services Preview ─────────────────────────────────────── */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-serif mb-4">Signature Services</h2>
              <p className="text-muted-foreground">Crafted for the modern gentleman.</p>
            </div>
            <Link href="/services" className="ghost-btn-gold px-6 py-3 shrink-0">
              View All Services
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {previewServices.map((service) => (
              <div
                key={service.id}
                className="bg-background border border-border p-8 hover:border-primary/50 transition-colors group cursor-pointer"
              >
                <div className="text-xs text-primary font-mono tracking-widest uppercase mb-4">
                  {service.category}
                </div>
                <h3 className="text-2xl font-serif mb-2 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <div className="flex justify-between items-center mt-8">
                  <span className="text-muted-foreground text-sm">{service.duration_minutes} MIN</span>
                  <span className="font-mono text-foreground text-lg">₹{service.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Team ─────────────────────────────────────────────────── */}
      <div style={{ height: 1, background: "#1E1E1E" }} className="w-full" />
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-serif mb-4">Master Barbers</h2>
            <div className="gold-divider w-24 mx-auto mb-6" />
            <p style={{ color: "#6B6560", maxWidth: 480, margin: "0 auto" }}>
              Our craftsmen are artists, blending classic techniques with contemporary vision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.id} className="group flex flex-col items-center text-center">
                <div className="w-full aspect-[3/4] bg-card mb-6 overflow-hidden border border-border relative">
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="font-serif text-4xl text-muted-foreground opacity-30">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent z-10 pointer-events-none" />
                </div>
                <h3 className="text-2xl font-serif mb-1 group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
                <p className="text-primary text-sm font-mono tracking-widest uppercase mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.speciality}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Gallery Strip ────────────────────────────────────────── */}
      <section className="py-24 bg-card border-y border-border overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 mb-12 flex justify-between items-end">
          <h2 className="text-4xl md:text-5xl font-serif">The Work</h2>
          <Link
            href="/gallery"
            className="text-primary hover:text-foreground transition-colors uppercase tracking-widest font-mono text-sm underline underline-offset-4 decoration-primary/50"
          >
            View Gallery
          </Link>
        </div>

        <div className="relative">
          {/* Scroll container with mask fade */}
          <div
            className="flex gap-4 px-4 md:px-8 overflow-x-auto pb-8 snap-x no-scrollbar"
            style={{ maskImage: "linear-gradient(to right, black 85%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, black 85%, transparent 100%)" }}
          >
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="min-w-[80vw] md:min-w-[400px] h-[500px] shrink-0 snap-center border border-border overflow-hidden group"
              >
                <img
                  src={img}
                  alt={`Beeba Boys Gallery ${i + 1}`}
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                />
              </div>
            ))}
          </div>

          {/* Scroll arrow */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 pointer-events-none scroll-arrow-pulse">
            <ArrowRight size={28} className="text-primary" />
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────── */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="hero-noise opacity-20" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <p
            className="text-center font-mono uppercase tracking-[0.3em] mb-16"
            style={{ fontSize: 11, color: "#C9A96E" }}
          >
            The Word
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="relative flex flex-col py-6 pl-8 pr-6"
                style={{
                  borderLeft: "1px solid #C9A96E",
                  borderTop: "1px solid #1E1E1E",
                  background: "#0F0F0F",
                }}
              >
                {/* Decorative quote mark */}
                <span
                  className="absolute top-2 left-4 font-serif leading-none select-none pointer-events-none"
                  style={{ fontSize: "5rem", color: "rgba(201,169,110,0.15)", lineHeight: 1 }}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                <p className="text-xl font-serif text-foreground leading-relaxed italic mb-8 flex-grow relative z-10">
                  "{t.text}"
                </p>
                <p className="text-muted-foreground uppercase tracking-widest text-sm font-mono">
                  — {t.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
