import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useListServices } from "@workspace/api-client-react";
import { FALLBACK_SERVICES } from "@/lib/data";
import { Link } from "wouter";

export default function Services() {
  const { data: servicesData, isLoading } = useListServices();
  const services = servicesData?.length ? servicesData : FALLBACK_SERVICES;

  const categories = [...new Set(services.map(s => s.category))];

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
            {categories.map(category => (
              <div key={category}>
                <h2 className="text-3xl font-serif mb-8 text-foreground border-b border-border pb-4">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.filter(s => s.category === category && s.active).map(service => (
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
