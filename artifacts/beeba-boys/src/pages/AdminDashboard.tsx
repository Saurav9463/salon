import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { 
  useListBookings, useUpdateBooking,
  useListServices, useCreateService, useUpdateService, useDeleteService,
  useListTeam, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember,
  useListMessages, useUpdateMessage, useDeleteMessage,
  useGetStats, getListBookingsQueryKey, getListServicesQueryKey, getListTeamQueryKey, getListMessagesQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, Users, Scissors, MessageSquare, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const isAdmin = localStorage.getItem("beeba_admin");
    if (!isAdmin) {
      setLocation("/admin/login");
    }
  }, [location, setLocation]);

  const handleLogout = () => {
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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-serif text-primary">BEEBA BOYS</h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-1">Admin</p>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-mono transition-colors ${
                activeTab === tab.id ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-border bg-card/50 flex items-center px-8">
          <h2 className="font-serif text-xl capitalize">{activeTab}</h2>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          {activeTab === "dashboard" && <DashboardStatsTab />}
          {activeTab === "bookings" && <BookingsTab queryClient={queryClient} />}
          {activeTab === "services" && <ServicesTab queryClient={queryClient} />}
          {activeTab === "team" && <TeamTab queryClient={queryClient} />}
          {activeTab === "messages" && <MessagesTab queryClient={queryClient} />}
        </div>
      </main>
    </div>
  );
}

function DashboardStatsTab() {
  const { data: stats, isLoading } = useGetStats();

  if (isLoading) return <div className="text-muted-foreground font-mono">Loading stats...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Bookings" value={stats?.total_bookings || 0} />
      <StatCard title="Pending" value={stats?.pending_bookings || 0} highlight />
      <StatCard title="Confirmed" value={stats?.confirmed_bookings || 0} />
      <StatCard title="Unread Messages" value={stats?.unread_messages || 0} highlight={!!stats?.unread_messages} />
      <StatCard title="Total Services" value={stats?.total_services || 0} />
      <StatCard title="Team Members" value={stats?.total_team || 0} />
    </div>
  );
}

function StatCard({ title, value, highlight = false }: { title: string, value: number, highlight?: boolean }) {
  return (
    <div className={`p-6 border ${highlight ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
      <h3 className="text-sm font-mono tracking-widest text-muted-foreground uppercase mb-2">{title}</h3>
      <p className={`text-4xl font-serif ${highlight ? 'text-primary' : 'text-foreground'}`}>{value}</p>
    </div>
  );
}

function BookingsTab({ queryClient }: { queryClient: any }) {
  const { data: bookings = [], isLoading } = useListBookings();
  const updateBooking = useUpdateBooking();

  const handleStatusChange = (id: string, status: string) => {
    updateBooking.mutate({ id, data: { status } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() })
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-card border border-border overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="text-xs font-mono uppercase tracking-widest text-muted-foreground border-b border-border bg-muted/20">
          <tr>
            <th className="px-6 py-4">Client</th>
            <th className="px-6 py-4">Service</th>
            <th className="px-6 py-4">Stylist</th>
            <th className="px-6 py-4">Date/Time</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {bookings.map(booking => (
            <tr key={booking.id} className="hover:bg-muted/10">
              <td className="px-6 py-4">
                <div className="font-serif text-base">{booking.client_name}</div>
                <div className="text-muted-foreground text-xs">{booking.client_phone}</div>
              </td>
              <td className="px-6 py-4">{booking.service_name || '-'}</td>
              <td className="px-6 py-4">{booking.stylist_name || '-'}</td>
              <td className="px-6 py-4 font-mono text-xs">
                {booking.appointment_date} <br/> {booking.appointment_time}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-mono uppercase border ${
                  booking.status === 'pending' ? 'text-yellow-500 border-yellow-500/50' : 
                  booking.status === 'confirmed' ? 'text-green-500 border-green-500/50' : 
                  'text-muted-foreground border-border'
                }`}>
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <select 
                  value={booking.status} 
                  onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                  className="bg-background border border-border text-xs p-1"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirm</option>
                  <option value="cancelled">Cancel</option>
                  <option value="completed">Complete</option>
                </select>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No bookings found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ServicesTab({ queryClient }: { queryClient: any }) {
  const { data: services = [] } = useListServices();
  const deleteService = useDeleteService();

  const handleDelete = (id: string) => {
    if(confirm("Delete this service?")) {
      deleteService.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() })
      });
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button className="bg-primary text-primary-foreground px-4 py-2 font-mono text-sm uppercase tracking-widest">Add Service</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(s => (
          <div key={s.id} className="bg-card border border-border p-6 relative group">
            <div className="text-xs text-primary font-mono uppercase mb-2">{s.category}</div>
            <h3 className="font-serif text-xl mb-1">{s.name}</h3>
            <div className="text-muted-foreground text-sm mb-4">₹{s.price} • {s.duration_minutes} min</div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button onClick={() => handleDelete(s.id)} className="text-destructive text-sm font-mono">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamTab({ queryClient }: { queryClient: any }) {
  const { data: team = [] } = useListTeam();
  const deleteTeam = useDeleteTeamMember();

  const handleDelete = (id: string) => {
    if(confirm("Delete this member?")) {
      deleteTeam.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListTeamQueryKey() })
      });
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button className="bg-primary text-primary-foreground px-4 py-2 font-mono text-sm uppercase tracking-widest">Add Member</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {team.map(m => (
          <div key={m.id} className="bg-card border border-border p-6 relative group flex items-center gap-4">
            <div className="w-16 h-16 bg-muted rounded-full overflow-hidden flex items-center justify-center shrink-0">
               {m.photo_url ? <img src={m.photo_url} className="w-full h-full object-cover"/> : <span className="font-serif">{m.name[0]}</span>}
            </div>
            <div>
              <h3 className="font-serif text-lg">{m.name}</h3>
              <div className="text-primary text-xs font-mono uppercase">{m.role}</div>
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleDelete(m.id)} className="text-destructive text-sm font-mono">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesTab({ queryClient }: { queryClient: any }) {
  const { data: messages = [] } = useListMessages();
  const updateMessage = useUpdateMessage();
  const deleteMessage = useDeleteMessage();

  const handleRead = (id: string, read: boolean) => {
    updateMessage.mutate({ id, data: { read } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey() })
    });
  };

  const handleDelete = (id: string) => {
    deleteMessage.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey() })
    });
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
            <button onClick={() => handleRead(m.id, !m.read)} className="text-xs font-mono uppercase text-primary border border-primary px-3 py-1">
              Mark {m.read ? 'Unread' : 'Read'}
            </button>
            <button onClick={() => handleDelete(m.id)} className="text-xs font-mono uppercase text-destructive border border-destructive px-3 py-1">
              Delete
            </button>
          </div>
        </div>
      ))}
      {messages.length === 0 && <div className="text-center py-12 text-muted-foreground">No messages.</div>}
    </div>
  );
}
