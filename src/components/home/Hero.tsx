import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Play, Sparkles } from "lucide-react";
import heroWarrior from "@/assets/hero-warrior.jpg";
import { useData } from "@/store/DataContext";

export function Hero() {
  const { settings, serverStatus } = useData();

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroWarrior}
          alt="Mu Eternia golden warrior on the obsidian battlefield"
          className="h-full w-full object-cover object-[60%_center] md:object-center"
          fetchPriority="high"
          width={1920}
          height={1080}
        />
        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,hsl(42_60%_30%/0.2),transparent_60%)]" />
      </div>

      {/* Floating embers */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute block h-1 w-1 rounded-full bg-primary/70 blur-[1px] animate-ember-float"
            style={{
              left: `${(i * 53) % 100}%`,
              bottom: `${(i * 31) % 60}%`,
              animationDelay: `${(i * 0.4) % 6}s`,
              animationDuration: `${5 + (i % 5)}s`,
            }}
          />
        ))}
      </div>

      <div className="container-page relative flex min-h-[calc(100svh-9rem)] items-center py-20 md:py-28 lg:min-h-[80vh]">
        <div className="max-w-3xl animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-sm border border-primary/30 bg-primary/5 px-3 py-1.5 backdrop-blur">
            <Sparkles size={13} className="text-primary" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              {settings.season} · Live Now
            </span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            <span className="block text-foreground">The Eternal</span>
            <span className="block text-gold-gradient drop-shadow-[0_0_30px_hsl(42_78%_55%/0.45)]">
              Continent Awaits
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Forge your legend in {settings.server_name} — a high-rate, premium dark fantasy MMORPG
            inspired by the gold-and-obsidian legacy of Mu Online. Hunt ancient relics, command
            siege guilds, and write your name into eternity.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="hero" size="xl" className="group">
              <Link to="/register">
                <Play size={18} className="transition-transform group-hover:scale-110" />
                Play Free Now
              </Link>
            </Button>
            <Button asChild variant="ghostGold" size="xl">
              <Link to="/download">
                <Download size={18} />
                Download Client
              </Link>
            </Button>
          </div>

          {/* Stat strip */}
          <div className="mt-14 grid max-w-xl grid-cols-3 divide-x divide-border/60 rounded-sm border border-border/60 bg-surface-1/60 backdrop-blur">
            {[
              { label: "Online", value: serverStatus.online_count.toLocaleString() },
              { label: "EXP Rate", value: `x${settings.exp_rate}` },
              { label: "Uptime", value: `${serverStatus.uptime_days}d` },
            ].map((s) => (
              <div key={s.label} className="px-4 py-3 text-center">
                <p className="font-display text-2xl font-bold text-gold-gradient">{s.value}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />

      {/* Scroll hint */}
      <Link
        to="/news"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-primary md:inline-flex"
      >
        Discover the world <ArrowRight size={12} />
      </Link>
    </section>
  );
}
