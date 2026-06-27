import { useEffect, useState } from "react";
import * as React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";

import shopInterior1 from "@assets/WhatsApp_Image_2026-06-27_at_17.30.27_1782561889400.jpeg";
import haircut1 from "@assets/WhatsApp_Image_2026-06-27_at_17.30.34_1782561889402.jpeg";
import shopInterior2 from "@assets/WhatsApp_Image_2026-06-27_at_17.30.42_1782561889403.jpeg";
import haircut2 from "@assets/WhatsApp_Image_2026-06-27_at_17.30.48_1782561889406.jpeg";
import haircut3 from "@assets/WhatsApp_Image_2026-06-27_at_17.30.55_1782561889407.jpeg";
import shopInterior3 from "@assets/WhatsApp_Image_2026-06-27_at_17.31.02_1782561889408.jpeg";

const FALLBACK_GALLERY = [
  { id: "g1", image_url: haircut1, category: "Haircut" },
  { id: "g2", image_url: shopInterior1, category: "Interior" },
  { id: "g3", image_url: haircut2, category: "Haircut" },
  { id: "g4", image_url: shopInterior2, category: "Interior" },
  { id: "g5", image_url: haircut3, category: "Haircut" },
  { id: "g6", image_url: shopInterior3, category: "Interior" },
];

export default function Gallery() {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.from("gallery").select("*").order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setImages(data);
        setIsLoading(false);
      });
  }, []);

  const gallery = images?.length ? images : FALLBACK_GALLERY;

  const [filter, setFilter] = React.useState("All");
  const [lightboxImg, setLightboxImg] = React.useState<string | null>(null);

  const categories = ["All", ...new Set(gallery.map(img => img.category))];
  const filteredGallery = filter === "All" ? gallery : gallery.filter(img => img.category === filter);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-6">The Work</h1>
          <div className="gold-divider w-24 mx-auto mb-10" />
          
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-6 py-2 border font-mono uppercase tracking-widest text-sm transition-colors ${
                  filter === c ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 pb-32 flex-grow">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div 
                key={item.id} 
                className="aspect-square border border-border overflow-hidden cursor-pointer group"
                onClick={() => setLightboxImg(item.image_url)}
              >
                <img 
                  src={item.image_url} 
                  alt={item.category} 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {lightboxImg && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur flex items-center justify-center p-4" onClick={() => setLightboxImg(null)}>
          <button className="absolute top-8 right-8 text-foreground hover:text-primary transition-colors">
            <X size={32} />
          </button>
          <img src={lightboxImg} alt="Enlarged" className="max-w-full max-h-full object-contain border border-border" />
        </div>
      )}

      <Footer />
    </div>
  );
}
