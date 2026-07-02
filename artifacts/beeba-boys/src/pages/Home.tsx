import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";
import { FALLBACK_SERVICES, FALLBACK_TEAM, TESTIMONIALS } from "@/lib/data";
import { ArrowRight, ArrowLeft } from "lucide-react";

import shopInterior2 from "@assets/WhatsApp_Image_2026-06-27_at_17.30.42_1782561889403.jpeg";
import haircut1 from "@assets/WhatsApp_Image_2026-06-27_at_17.30.34_1782561889402.jpeg";
import haircut2 from "@assets/WhatsApp_Image_2026-06-27_at_17.30.48_1782561889406.jpeg";
import haircut3 from "@assets/WhatsApp_Image_2026-06-27_at_17.30.55_1782561889407.jpeg";

export default function Home() {
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [teamData, setTeamData] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("services").select("*").eq("active", true)
      .then(({ data }) => { if (data) setServicesData(data); });
    supabase.from("team").select("*").eq("active", true)
      .then(({ data }) => { if (data) setTeamData(data); });
  }, []);

  const services = servicesData?.length ? servicesData : FALLBACK_SERVICES;
  const team = teamData?.length ? teamData : FALLBACK_TEAM;

  const previewServices = services.slice(0, 4);
  const galleryImages = [haircut1, haircut2, haircut3];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="hero-noise opacity-40" />
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: `url(${shopInterior2})` }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <p
            className="font-mono uppercase mb-4 tracking-[0.15em] md:tracking-[0.25em] text-center px-4"
            style={{ fontSize: 11, color: "rgba(201,169,110,0.70)" }}
          >
            Established · Jalandhar · Punjab
          </p>
          <div className="gold-divider w-[120px] mx-auto mb-8" />
          <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-serif text-foreground mb-6 tracking-tight leading-none">
            BEEBA <span className="text-primary italic">BOYS</span>
          </h1>
          <p className="text-base md:text-2xl text-muted-foreground uppercase tracking-[0.15em] md:tracking-[0.2em] mb-12">
            Where Precision Meets Style
          </p>
          <Link href="/book" className="ghost-btn-gold px-8 py-4 text-sm md:text-lg">
            Book Appointment
          </Link>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1">
          <div className="scroll-line" />
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 md:py-20 px-4 bg-background relative">
        <div className="container mx-auto max-w-4xl text-center">
          <p
            className="font-mono uppercase mb-6 tracking-[0.3em]"
            style={{ fontSize: 11, color: "#C9A96E" }}
          >
            Our Philosophy
          </p>
          <div className="gold-divider w-[80px] mx-auto mb-8" />
          <p className="text-2xl md:text-5xl font-serif leading-tight text-foreground">
            A sanctuary of{" "}
            <span className="italic text-primary">refined masculinity</span>{" "}
            where high-end editorial meets street-sharp culture.
          </p>
          <div
            className="mx-auto mt-12 md:mt-20 mb-0"
            style={{ height: 1, background: "#1E1E1E", maxWidth: 480 }}
          />
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 md:py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-4">
            <div>
              <h2 className="text-3xl md:text-6xl font-serif mb-3 md:mb-4">Signature Services</h2>
              <p className="text-muted-foreground text-sm md:text-base">Crafted for the modern gentleman.</p>
            </div>
            <Link href="/services" className="ghost-btn-gold px-6 py-3 shrink-0 text-sm">
              View All Services
            </Link>
          </div>

          {/* Mobile: vertical stack, Desktop: grid */}
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {previewServices.map((service) => (
              <div
                key={service.id}
                className="bg-background border border-border p-6 md:p-8 hover:border-primary/50 transition-colors group cursor-pointer"
              >
                <div className="text-xs text-primary font-mono tracking-widest uppercase mb-3 md:mb-4">
                  {service.category}
                </div>
                <h3 className="text-xl md:text-2xl font-serif mb-2 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <div className="flex justify-between items-center mt-4 md:mt-8">
                  <span className="text-muted-foreground text-sm">{service.duration_minutes} MIN</span>
                  <span className="font-mono text-foreground text-base md:text-lg">₹{service.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <div style={{ height: 1, background: "#1E1E1E" }} className="w-full" />
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-6xl font-serif mb-4">Master Barbers</h2>
            <div className="gold-divider w-24 mx-auto mb-6" />
            <p style={{ color: "#6B6560", maxWidth: 480, margin: "0 auto" }} className="text-sm md:text-base">
              Our craftsmen are artists, blending classic techniques with contemporary vision.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {team.map((member) => (
              <div key={member.id} className="group flex flex-col items-center text-center">
                {/* Fixed height photo — no more full-screen on mobile */}
                <div className="w-full h-[200px] sm:h-[260px] md:h-[340px] lg:aspect-[3/4] lg:h-auto bg-card mb-4 md:mb-6 overflow-hidden border border-border relative">
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      className="w-full h-full object-cover object-top transition-all duration-500"
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
                <h3 className="text-lg md:text-2xl font-serif mb-1 group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
                <p className="text-primary text-xs font-mono tracking-widest uppercase mb-2 md:mb-3">{member.role}</p>
                <p className="text-muted-foreground text-xs md:text-sm hidden md:block">{member.speciality}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Strip */}
      <section className="py-16 md:py-24 bg-card border-y border-border overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 mb-8 md:mb-12 flex justify-between items-end">
          <h2 className="text-2xl md:text-5xl font-serif">The Work</h2>
          <Link
            href="/gallery"
            className="text-primary hover:text-foreground transition-colors uppercase tracking-widest font-mono text-xs md:text-sm underline underline-offset-4 decoration-primary/50"
          >
            View Gallery
          </Link>
        </div>

        <WorkGalleryCarousel images={galleryImages} />
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 bg-background relative overflow-hidden">
        <div className="hero-noise opacity-20" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <p
            className="text-center font-mono uppercase tracking-[0.3em] mb-12 md:mb-16"
            style={{ fontSize: 11, color: "#C9A96E" }}
          >
            The Word
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="relative flex flex-col py-6 pl-6 md:pl-8 pr-4 md:pr-6"
                style={{
                  borderLeft: "1px solid #C9A96E",
                  borderTop: "1px solid #1E1E1E",
                  background: "#0F0F0F",
                }}
              >
                <span
                  className="absolute top-2 left-4 font-serif leading-none select-none pointer-events-none"
                  style={{ fontSize: "4rem", color: "rgba(201,169,110,0.15)", lineHeight: 1 }}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                <p className="text-base md:text-xl font-serif text-foreground leading-relaxed italic mb-6 md:mb-8 flex-grow relative z-10">
                  "{t.text}"
                </p>
                <p className="text-muted-foreground uppercase tracking-widest text-xs md:text-sm font-mono">
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

// Single-frame "The Work" carousel.
//
// Previously this used native horizontal scroll-snap. On real devices the
// browser was free to rest the scroll position anywhere between snap
// points (including the trailing padding after the last card), which is
// what produced the empty near-black frame after swiping -- the section
// background (near-black in this theme) showing through with no image
// on top of it.
//
// This version drives the carousel entirely from React state instead of
// relying on native scroll physics: a flex "track" is translated by
// exactly `-index * 100%`, so the visible frame is always precisely one
// full slide -- never a sliver, gap, or in-between position. Prev/Next
// wrap around, and the same index powers touch-swipe, the arrow buttons,
// and the dot indicators, so all three stay in sync.
//
// Images use object-cover inside a fixed-aspect frame so every photo
// fills the frame edge-to-edge with no letterboxing or black bars,
// regardless of its original dimensions.
function WorkGalleryCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const total = images.length;

  // Tracks which slides have actually finished downloading. On a slow
  // connection an image can still be mid-download the moment someone
  // swipes to it -- previously that showed as a flat black frame (the
  // near-black theme background showing through an empty <img>), which
  // reads as broken even though it's really just "still loading". Now we
  // show a small spinner over the same dark frame until the image's
  // onLoad fires, so a not-yet-loaded slide reads as "loading", not
  // "broken".
  const [loaded, setLoaded] = useState<boolean[]>(() => images.map(() => false));
  const [failed, setFailed] = useState<boolean[]>(() => images.map(() => false));
  const imgRefs = useRef<Array<HTMLImageElement | null>>([]);
  const markLoaded = (i: number) =>
    setLoaded((prev) => {
      if (prev[i]) return prev;
      const next = [...prev];
      next[i] = true;
      return next;
    });
  const markFailed = (i: number) =>
    setFailed((prev) => {
      if (prev[i]) return prev;
      const next = [...prev];
      next[i] = true;
      return next;
    });

  // Cache-hit safety net: if an image is already in the browser cache it
  // can finish loading (img.complete) before React ever attaches the
  // onLoad listener below, which would otherwise leave that slide stuck
  // showing the spinner forever. Sweep once after mount and mark any
  // already-complete images as loaded.
  useEffect(() => {
    imgRefs.current.forEach((el, i) => {
      if (el && el.complete && el.naturalWidth > 0) markLoaded(i);
    });
  }, []);

  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const goTo = (i: number) => {
    if (total === 0) return;
    setIndex(((i % total) + total) % total);
  };
  const goNext = () => goTo(index + 1);
  const goPrev = () => goTo(index - 1);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd = () => {
    const delta = touchDeltaX.current;
    touchStartX.current = null;
    touchDeltaX.current = 0;
    const SWIPE_THRESHOLD = 40;
    if (delta > SWIPE_THRESHOLD) goPrev();
    else if (delta < -SWIPE_THRESHOLD) goNext();
  };

  if (total === 0) return null;

  return (
    <div className="relative px-4 md:px-8">
      <div
        className="relative w-full h-[260px] sm:h-[380px] md:h-[520px] overflow-hidden border border-border bg-card select-none touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)`, width: `${total * 100}%` }}
        >
          {images.map((img, i) => (
            <div key={i} className="relative h-full shrink-0 bg-card" style={{ width: `${100 / total}%` }}>
              {/* Spinner placeholder, visible until this slide's image has loaded (and hasn't errored) */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                  loaded[i] || failed[i] ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
                aria-hidden={loaded[i] || failed[i]}
              >
                <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              </div>

              {/* Visible fallback if the image genuinely fails to load (e.g. a bad URL),
                  so a broken asset reads as "unavailable", never as an empty black box. */}
              {failed[i] && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 16l5-5 4 4 5-5 4 4" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                  </svg>
                  <span className="text-xs font-mono uppercase tracking-widest">Image unavailable</span>
                </div>
              )}

              <img
                ref={(el) => { imgRefs.current[i] = el; }}
                src={img}
                alt={`Beeba Boys Gallery ${i + 1}`}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  loaded[i] && !failed[i] ? "opacity-100" : "opacity-0"
                }`}
                draggable={false}
                loading="eager"
                decoding="async"
                // @ts-ignore -- fetchPriority is valid HTML but not yet in older React DOM typings
                fetchpriority={i === 0 ? "high" : "auto"}
                onLoad={() => markLoaded(i)}
                onError={() => markFailed(i)}
              />
            </div>
          ))}
        </div>
      </div>

      {total > 1 && (
        <>
          {/* Prev arrow */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className="flex absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/80 border border-primary/40 text-primary hover:bg-primary hover:text-background transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Next arrow */}
          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="flex absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/80 border border-primary/40 text-primary hover:bg-primary hover:text-background transition-colors"
          >
            <ArrowRight size={20} />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4 md:mt-6">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
