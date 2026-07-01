import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";
import { FALLBACK_SERVICES } from "@/lib/data";
import { Link } from "wouter";

export default function Services() {
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.from("services").select("*").eq("active", true)
      .then(({ data }) => {
        if (data) setServicesData(data);
        setIsLoading(false);
      });
  }, []);

  const services = servicesData?.length ? servicesData : FALLBACK_SERVICES;

  // Group by a normalized (trimmed, lowercased) key so that categories which
  // differ only in casing or stray whitespace (e.g. "Hair" vs "hair " saved
  // from an older version of the admin form) are merged into a single
  // section instead of rendering as two separate blocks. We keep the first
  // occurrence's original spelling/casing as the display label.
  const categoryMap = new Map<string, string>();
  services.forEach(s => {
    const norm = (s.category ?? "").trim().toLowerCase();
    if (!categoryMap.has(norm)) categoryMap.set(norm, (s.category ?? "").trim());
  });
  const categories = Array.from(categoryMap.entries()); // [normalizedKey, displayLabel][]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-6">Our Services</h1>
          <div className="gold-divider w-24 mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meticulous grooming, tailored to your personal style. We offer a full range of premium services to keep you looking your sharpest.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 pb-32 flex-grow">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid gap-20">
            {categories.map(([normKey, label]) => (
              <div key={normKey}>
                <h2 className="text-3xl font-serif mb-8 text-foreground border-b border-border pb-4">{label}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.filter(s => (s.category ?? "").trim().toLowerCase() === normKey && s.active).map(service => (
                    <div key={service.id} className="bg-card border border-border p-6 flex flex-col hover:border-primary/50 transition-colors group">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-serif group-hover:text-primary transition-colors">{service.name}</h3>
                        <span className="font-mono text-lg">₹{service.price}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-6 flex-grow">{service.description || "Premium grooming service."}</p>
                      <div className="flex justify-between items-center border-t border-border pt-4 mt-auto">
                        <span className="text-sm font-mono tracking-widest text-muted-foreground">{service.duration_minutes} MIN</span>
                        <Link href={`/book?service=${service.id}`} className="text-primary hover:text-foreground transition-colors text-sm uppercase tracking-widest font-mono">
                          Book Now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
