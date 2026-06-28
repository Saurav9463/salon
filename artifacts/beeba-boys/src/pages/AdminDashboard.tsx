import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Calendar, Users, Scissors, MessageSquare, LogOut, LayoutDashboard, X, CalendarX, Menu } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("beeba_admin");
    if (!isAdmin) {
      setLocation("/admin/login");
    }
  }, [location, setLocation]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("beeba_admin");
    setLocation("/admin/login");
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "services", label: "Services", icon: Scissors },
    { id: "team", label: "Team", icon: Users },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          style={{ touchAction: "none" }}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-60 bg-card border-r border-border
        flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}>
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-serif text-primary">BEEBA BOYS</h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-1">Admin</p>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-mono transition-all duration-200"
                style={isActive ? {
                  background: "rgba(201,169,110,0.10)",
                  color: "#C9A96E",
                  borderLeft: "2px solid #C9A96E",
                  paddingLeft: "14px",
                } : {
                  color: "#6B6560",
                  borderLeft: "2px solid transparent",
                }}
                onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = "#161616"; (e.currentTarget as HTMLElement).style.color = "#C9A96E"; } }}
                onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#6B6560"; } }}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-mono text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="w-full min-w-0 overflow-x-hidden md:ml-60 min-h-screen flex flex-col transition-all duration-300">
        <header className="h-16 border-b border-border bg-card/50 flex items-center px-4 md:px-8 gap-4">
          <button
            className="md:hidden p-2 text-foreground z-50"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h2 className="font-serif text-xl capitalize">{activeTab}</h2>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {activeTab === "dashboard" && <DashboardStatsTab />}
          {activeTab === "bookings" && <BookingsTab />}
          {activeTab === "services" && <ServicesTab />}
          {activeTab === "team" && <TeamTab />}
          {activeTab === "messages" && <MessagesTab />}
        </div>
      </main>
    </div>
  );
}

function DashboardStatsTab() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { data: allBookings, error: e1 },
        { data: pendingBookings, error: e2 },
        { data: confirmedBookings, error: e3 },
        { data: unreadMessages, error: e4 },
        { data: allServices, error: e5 },
        { data: allTeam, error: e6 },
      ] = await Promise.all([
        supabase.from("bookings").select("id"),
        supabase.from("bookings").select("id").ilike("status", "pending"),
        supabase.from("bookings").select("id").ilike("status", "confirmed"),
        supabase.from("messages").select("id").eq("read", false),
        supabase.from("services").select("id").eq("active", true),
        supabase.from("team").select("id").eq("active", true),
      ]);
      if (e1) console.error("Bookings stats error:", e1);
      if (e2) console.error("Pending bookings error:", e2);
      if (e3) console.error("Confirmed bookings error:", e3);
      if (e4) console.error("Unread messages error:", e4);
      if (e5) console.error("Services stats error:", e5);
      if (e6) console.error("Team stats error:", e6);
      setStats({
        totalBookings: allBookings?.length ?? 0,
        pending: pendingBookings?.length ?? 0,
        confirmed: confirmedBookings?.length ?? 0,
        unreadMessages: unreadMessages?.length ?? 0,
        totalServices: allServices?.length ?? 0,
        teamMembers: allTeam?.length ?? 0,
      });
      setIsLoading(false);
    };
    fetchStats();
  }, []);

  if (isLoading) return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-4 md:p-6 border border-border bg-card animate-pulse h-28 md:h-32" />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <StatCard title="Total Bookings" value={stats?.totalBookings ?? 0} />
      <StatCard title="Pending" value={stats?.pending ?? 0} highlight={(stats?.pending ?? 0) > 0} />
      <StatCard title="Confirmed" value={stats?.confirmed ?? 0} />
      <StatCard title="Unread Messages" value={stats?.unreadMessages ?? 0} highlight={(stats?.unreadMessages ?? 0) > 0} />
      <StatCard title="Total Services" value={stats?.totalServices ?? 0} />
      <StatCard title="Team Members" value={stats?.teamMembers ?? 0} />
    </div>
  );
}

function StatCard({ title, value, highlight = false }: { title: string, value: number, highlight?: boolean }) {
  return (
    <div className={`p-4 md:p-6 border ${highlight ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
      <h3 className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-3">{title}</h3>
      <p
        className="text-3xl md:text-5xl font-light tabular-nums mt-2"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          color: highlight ? 'hsl(var(--primary))' : '#F5F0EB',
          fontWeight: 300,
        }}
      >
        {value}
      </p>
    </div>
  );
}

function BookingsTab() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    supabase
      .from("bookings")
      .select(`*, service:services ( name ), stylist:team ( name )`)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error("Bookings error:", error);
        setBookings(data ?? []);
        setIsLoading(false);
      });
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    fetchBookings();
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    return `${hour > 12 ? hour - 12 : hour || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  if (isLoading) return <div className="text-muted-foreground font-mono text-sm">Loading bookings...</div>;

  return (
    <div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-left bg-card border border-border table-fixed">
          <thead className="text-xs font-mono uppercase tracking-widest text-muted-foreground border-b border-border bg-muted/20">
            <tr>
              <th className="px-3 py-3 w-[20%]">Client</th>
              <th className="px-3 py-3 w-[18%]">Service</th>
              <th className="px-3 py-3 w-[13%]">Stylist</th>
              <th className="px-3 py-3 w-[18%]">Date/Time</th>
              <th className="px-3 py-3 w-[13%]">Status</th>
              <th className="px-3 py-3 w-[18%]">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, idx) => (
              <tr
                key={booking.id}
                className="border-b border-border transition-colors duration-150"
                style={{ background: idx % 2 === 1 ? "#0D0D0D" : "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#141414")}
                onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 1 ? "#0D0D0D" : "transparent")}
              >
                <td className="px-3 py-3 w-[20%]">
                  <div className="font-medium text-sm truncate">{booking.client_name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{booking.client_phone}</div>
                </td>
                <td className="px-3 py-3 w-[18%] truncate">{booking.service?.name ?? '—'}</td>
                <td className="px-3 py-3 w-[13%] truncate">{booking.stylist?.name ?? '—'}</td>
                <td className="px-3 py-3 w-[18%] font-mono text-xs">
                  {booking.appointment_date ? formatDate(booking.appointment_date) : '—'}
                  <br />
                  {booking.appointment_time ? formatTime(booking.appointment_time) : ''}
                </td>
                <td className="px-3 py-3 w-[13%]">
                  <span className={`px-2 py-1 text-xs font-mono uppercase border ${
                    booking.status?.toLowerCase() === 'pending'   ? 'text-yellow-500 border-yellow-500/50' :
                    booking.status?.toLowerCase() === 'confirmed' ? 'text-green-500 border-green-500/50' :
                    booking.status?.toLowerCase() === 'completed' ? 'text-blue-400 border-blue-400/50' :
                    'text-muted-foreground border-border'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-3 py-3 w-[18%]">
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    className="w-full max-w-[130px] bg-background border border-border text-foreground text-sm px-2 py-1 outline-none focus:border-primary"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <CalendarX size={40} style={{ color: "#1E1E1E" }} />
                    <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#6B6560", fontSize: "0.9rem" }}>
                      No bookings yet
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddServiceModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ name: "", category: "Hair", description: "", duration_minutes: "30", price: "" });
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    const { error } = await supabase.from("services").insert([{
      name: form.name,
      category: form.category,
      description: form.description || undefined,
      duration_minutes: parseInt(form.duration_minutes),
      price: form.price,
      active: true,
    }]);
    if (error) console.error("Add service error:", error);
    setIsPending(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-card border border-border w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={20} /></button>
        <h2 className="font-serif text-2xl mb-6">Add Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Service Name">
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="admin-input" />
          </Field>
          <Field label="Category">
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="admin-input">
              <option>Hair</option>
              <option>Beard</option>
              <option>Skin</option>
              <option>Spa & Wellness</option>
            </select>
          </Field>
          <Field label="Description">
            <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="admin-input" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Duration (min)">
              <input type="number" required value={form.duration_minutes} onChange={e => setForm({...form, duration_minutes: e.target.value})} className="admin-input" />
            </Field>
            <Field label="Price (₹)">
              <input type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="admin-input" />
            </Field>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-border py-3 font-mono text-sm text-muted-foreground hover:text-foreground">Cancel</button>
            <button type="submit" disabled={isPending} className="flex-1 bg-primary text-primary-foreground py-3 font-mono text-sm uppercase tracking-widest disabled:opacity-60">
              {isPending ? "Saving..." : "Add Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddMemberModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ name: "", role: "Barber", bio: "", speciality: "", years_experience: "1", photo_url: "" });
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    const { error } = await supabase.from("team").insert([{
      name: form.name,
      role: form.role,
      bio: form.bio || undefined,
      speciality: form.speciality || undefined,
      years_experience: parseInt(form.years_experience),
      photo_url: form.photo_url || undefined,
      active: true,
    }]);
    if (error) console.error("Add team member error:", error);
    setIsPending(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-card border border-border w-full max-w-md p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={20} /></button>
        <h2 className="font-serif text-2xl mb-6">Add Team Member</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Name">
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="admin-input" />
          </Field>
          <Field label="Role">
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="admin-input">
              <option>Master Barber</option>
              <option>Senior Barber</option>
              <option>Barber</option>
              <option>Skin Specialist</option>
              <option>Spa Therapist</option>
            </select>
          </Field>
          <Field label="Speciality">
            <input value={form.speciality} onChange={e => setForm({...form, speciality: e.target.value})} className="admin-input" placeholder="e.g. Fades & Beard Design" />
          </Field>
          <Field label="Years Experience">
            <input type="number" value={form.years_experience} onChange={e => setForm({...form, years_experience: e.target.value})} className="admin-input" />
          </Field>
          <Field label="Bio">
            <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="admin-input resize-none" rows={3} />
          </Field>
          <Field label="Photo URL (optional)">
            <input type="url" value={form.photo_url} onChange={e => setForm({...form, photo_url: e.target.value})} className="admin-input" placeholder="https://..." />
          </Field>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-border py-3 font-mono text-sm text-muted-foreground hover:text-foreground">Cancel</button>
            <button type="submit" disabled={isPending} className="flex-1 bg-primary text-primary-foreground py-3 font-mono text-sm uppercase tracking-widest disabled:opacity-60">
              {isPending ? "Saving..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono tracking-widest uppercase text-muted-foreground mb-1">{label}</label>
      {children}
    </div>
  );
}

function ServicesTab() {
  const [services, setServices] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const fetchServices = async () => {
    supabase
      .from("services")
      .select("*")
      .order("category", { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error("Services error:", error);
        setServices(data ?? []);
      });
  };

  useEffect(() => { fetchServices(); }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Delete this service?")) {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) console.error("Delete service error:", error);
      fetchServices();
    }
  };

  const handleEdit = (service: any) => setEditingService(service);

  const handleSaveEdit = async () => {
    const { error } = await supabase
      .from("services")
      .update({
        name: editingService.name,
        category: editingService.category,
        description: editingService.description,
        price: editingService.price,
        duration_minutes: editingService.duration_minutes,
        active: editingService.active,
      })
      .eq("id", editingService.id);
    if (!error) {
      setServices(services.map(s => s.id === editingService.id ? editingService : s));
      setEditingService(null);
    } else {
      console.error("Update error:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  return (
    <div className="min-w-0">
      {showAdd && (
        <AddServiceModal
          onClose={() => setShowAdd(false)}
          onSuccess={fetchServices}
        />
      )}

      {editingService && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif">Edit Service</h2>
              <button onClick={() => setEditingService(null)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 block">Service Name</label>
                <input
                  className="w-full bg-background border border-border px-4 py-3 text-foreground focus:border-primary outline-none"
                  value={editingService.name}
                  onChange={e => setEditingService({ ...editingService, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 block">Category</label>
                <select
                  className="w-full bg-background border border-border px-4 py-3 text-foreground focus:border-primary outline-none"
                  value={editingService.category}
                  onChange={e => setEditingService({ ...editingService, category: e.target.value })}
                >
                  <option value="Hair">Hair</option>
                  <option value="Beard">Beard</option>
                  <option value="Skin">Skin</option>
                  <option value="Spa & Wellness">Spa & Wellness</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 block">Description</label>
                <textarea
                  className="w-full bg-background border border-border px-4 py-3 text-foreground focus:border-primary outline-none resize-none h-20"
                  value={editingService.description ?? ""}
                  onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 block">Price (₹)</label>
                  <input
                    type="number"
                    className="w-full bg-background border border-border px-4 py-3 text-foreground focus:border-primary outline-none"
                    value={editingService.price}
                    onChange={e => setEditingService({ ...editingService, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 block">Duration (min)</label>
                  <input
                    type="number"
                    className="w-full bg-background border border-border px-4 py-3 text-foreground focus:border-primary outline-none"
                    value={editingService.duration_minutes}
                    onChange={e => setEditingService({ ...editingService, duration_minutes: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="checkbox"
                  id="svc-active"
                  checked={editingService.active}
                  onChange={e => setEditingService({ ...editingService, active: e.target.checked })}
                  className="accent-primary"
                />
                <label htmlFor="svc-active" className="text-sm font-mono uppercase tracking-widest">
                  Active (visible on public site)
                </label>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-primary text-background font-mono uppercase tracking-widest py-3 hover:opacity-90 transition-opacity"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingService(null)}
                className="flex-1 border border-border font-mono uppercase tracking-widest py-3 hover:border-primary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 flex justify-end">
        <button onClick={() => setShowAdd(true)} className="bg-primary text-primary-foreground px-6 py-3 font-mono text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors">
          + Add Service
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map(s => (
          <div key={s.id} className="bg-card border border-border p-6 relative group">
            <div className="text-xs text-primary font-mono uppercase mb-2">{s.category}</div>
            <h3 className="font-serif text-xl mb-1">{s.name}</h3>
            <div className="text-muted-foreground text-sm mb-2">₹{s.price} · {s.duration_minutes} min</div>
            {!s.active && <div className="text-xs font-mono text-muted-foreground mb-2 uppercase">[Inactive]</div>}
            {s.description && <p className="text-muted-foreground text-xs">{s.description}</p>}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(s)}
                className="text-xs font-mono tracking-widest uppercase border border-primary text-primary px-3 py-1 hover:bg-primary hover:text-background transition-colors"
              >
                Edit
              </button>
              <button onClick={() => handleDelete(s.id)} className="text-destructive text-xs font-mono border border-destructive/50 px-2 py-1">Delete</button>
            </div>
          </div>
        ))}
        {services.length === 0 && <div className="col-span-3 text-center py-8 text-muted-foreground">No services yet.</div>}
      </div>
    </div>
  );
}

function TeamTab() {
  const [team, setTeam] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  const fetchTeam = async () => {
    supabase
      .from("team")
      .select("*")
      .order("name", { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error("Team error:", error);
        setTeam(data ?? []);
      });
  };

  useEffect(() => { fetchTeam(); }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Delete this team member?")) {
      const { error } = await supabase.from("team").delete().eq("id", id);
      if (error) console.error("Delete team error:", error);
      fetchTeam();
    }
  };

  return (
    <div>
      {showAdd && (
        <AddMemberModal
          onClose={() => setShowAdd(false)}
          onSuccess={fetchTeam}
        />
      )}
      <div className="mb-6 flex justify-end">
        <button onClick={() => setShowAdd(true)} className="bg-primary text-primary-foreground px-6 py-3 font-mono text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors">
          + Add Member
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {team.map(m => (
          <div key={m.id} className="bg-card border border-border p-6 relative group flex items-center gap-4">
            <div className="w-16 h-16 bg-muted rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-border">
               {m.photo_url
                 ? <img src={m.photo_url} className="w-full h-full object-cover" alt={m.name} />
                 : <span className="font-serif text-xl text-muted-foreground">{m.name[0]}</span>
               }
            </div>
            <div>
              <h3 className="font-serif text-lg">{m.name}</h3>
              <div className="text-primary text-xs font-mono uppercase">{m.role}</div>
              {m.years_experience && <div className="text-muted-foreground text-xs mt-1">{m.years_experience} yrs exp</div>}
              {!m.active && <div className="text-xs font-mono text-muted-foreground uppercase">[Inactive]</div>}
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleDelete(m.id)} className="text-destructive text-xs font-mono border border-destructive/50 px-2 py-1">Delete</button>
            </div>
          </div>
        ))}
        {team.length === 0 && <div className="col-span-3 text-center py-8 text-muted-foreground">No team members yet.</div>}
      </div>
    </div>
  );
}

function MessagesTab() {
  const [messages, setMessages] = useState<any[]>([]);

  const fetchMessages = async () => {
    supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error("Messages error:", error);
        setMessages(data ?? []);
      });
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleRead = async (id: string, read: boolean) => {
    const { error } = await supabase.from("messages").update({ read }).eq("id", id);
    if (error) console.error("Update message error:", error);
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) console.error("Delete message error:", error);
    fetchMessages();
  };

  return (
    <div className="space-y-4">
      {messages.map(m => (
        <div key={m.id} className={`p-6 border ${m.read ? 'bg-card border-border' : 'bg-primary/5 border-primary/30'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-serif text-lg">{m.name}</h3>
              <p className="text-muted-foreground text-sm">{m.email}</p>
            </div>
            <div className="text-xs font-mono text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
          </div>
          <p className="text-foreground text-sm mb-6">{m.message}</p>
          <div className="flex gap-4">
            <button onClick={() => handleRead(m.id, !m.read)} className="text-xs font-mono uppercase text-primary border border-primary px-3 py-1 hover:bg-primary/10 transition-colors">
              Mark {m.read ? 'Unread' : 'Read'}
            </button>
            <button onClick={() => handleDelete(m.id)} className="text-xs font-mono uppercase text-destructive border border-destructive px-3 py-1 hover:bg-destructive/10 transition-colors">
              Delete
            </button>
          </div>
        </div>
      ))}
      {messages.length === 0 && <div className="text-center py-12 text-muted-foreground font-mono">No messages yet.</div>}
    </div>
  );
}
