import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";
import { FALLBACK_TEAM } from "@/lib/data";
import { Link } from "wouter";

export default function Team() {
  const [teamData, setTeamData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.from("team").select("*").eq("active", true)
      .then(({ data }) => {
        if (data) setTeamData(data);
        setIsLoading(false);
      });
  }, []);

  const team = teamData?.length ? teamData : FALLBACK_TEAM;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-6">Master Barbers</h1>
          <div className="gold-divider w-24 mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our craftsmen are true artists, blending classic techniques with a contemporary vision. Meet the team that makes Beeba Boys exceptional.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 pb-32 flex-grow">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {team.filter(m => m.active).map(member => (
              <div key={member.id} className="group flex flex-col bg-card border border-border">
                <div className="w-full aspect-[3/4] bg-muted overflow-hidden relative">
                  {member.photo_url ? (
                    <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover transition-all duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                  )}
                  {!member.photo_url && (
                     <div className="w-full h-full flex items-center justify-center">
                       <span className="font-serif text-6xl text-muted-foreground opacity-30">{member.name.charAt(0)}</span>
                     </div>
                  )}
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-3xl font-serif mb-1 group-hover:text-primary transition-colors">{member.name}</h3>
                  <p className="text-primary text-sm font-mono tracking-widest uppercase mb-4">{member.role}</p>
                  <p className="text-muted-foreground text-sm mb-6 flex-grow">{member.bio || `Specializing in ${member.speciality}. With ${member.years_experience} years of experience, ${member.name} delivers precision and style.`}</p>
                  
                  <Link href={`/book?stylist=${member.id}`} className="ghost-btn-gold px-4 py-3 text-center w-full block">
                    Book with {member.name}
                  </Link>
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
