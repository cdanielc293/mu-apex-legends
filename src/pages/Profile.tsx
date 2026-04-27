import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAuth } from "@/store/AuthContext";
import { Button } from "@/components/ui/button";
import { Crown, LogOut, Shield, Swords } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <SiteLayout>
      <section className="container-page py-12 md:py-16">
        <div className="surface-card relative overflow-hidden rounded-sm p-8 md:p-12">
          <div className="absolute inset-0 bg-gradient-radial-glow opacity-50" />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center">
            <div className="grid h-20 w-20 place-items-center rounded-sm bg-gradient-gold text-primary-foreground shadow-gold-lg shadow-inset-gold">
              <span className="font-display text-3xl font-bold">
                {user.username.slice(0, 1).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.3em] text-primary">Adventurer</p>
              <h1 className="font-display text-3xl font-bold md:text-4xl">{user.username}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-sm bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                {user.role === "admin" ? <Shield size={12} /> : <Crown size={12} />} {user.role}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.role === "admin" && (
                <Button asChild variant="gold">
                  <Link to="/admin">
                    <Shield size={14} /> Admin Panel
                  </Link>
                </Button>
              )}
              <Button variant="obsidian" onClick={logout}>
                <LogOut size={14} /> Sign out
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { label: "Characters", value: 0, icon: Swords },
            { label: "Total Resets", value: 0, icon: Crown },
            { label: "Guilds", value: 0, icon: Shield },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="surface-card rounded-sm p-6">
                <Icon className="text-primary" size={20} />
                <p className="mt-3 font-display text-3xl font-bold text-gold-gradient">
                  {s.value}
                </p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Your saga begins the moment you launch the client. Visit{" "}
          <Link to="/download" className="text-primary hover:underline">
            the Download page
          </Link>{" "}
          to get started.
        </p>
      </section>
    </SiteLayout>
  );
}
