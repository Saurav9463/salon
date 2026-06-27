import { useState } from "react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@beebaboys.com" && password === "admin123") {
      localStorage.setItem("beeba_admin", "true");
      setLocation("/admin");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative p-4">
      <div className="hero-noise opacity-30" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif text-primary mb-2">BEEBA BOYS</h1>
          <p className="text-muted-foreground font-mono tracking-widest text-xs uppercase">Admin Portal</p>
        </div>

        <div className="bg-card border border-border p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/50 text-destructive p-3 text-sm text-center font-mono">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-background border border-border p-3 text-foreground focus:border-primary focus:outline-none transition-colors font-mono"
              />
            </div>
            
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-background border border-border p-3 text-foreground focus:border-primary focus:outline-none transition-colors font-mono"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground font-mono uppercase tracking-widest text-sm py-4 hover:bg-primary/90 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
