import { Link } from "react-router-dom";
import { useData } from "@/store/DataContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Crown, Trophy } from "lucide-react";

export function RankingsPreview() {
  const { rankings } = useData();
  const top = rankings.slice(0, 5);

  return (
    <section className="relative py-20 md:py-28">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.4em] text-primary">
              Hall of legends
            </p>
            <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
              <span className="text-foreground">Only the </span>
              <span className="text-gold-gradient">Eternal</span>
              <span className="text-foreground"> Endure</span>
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Track the top 100 adventurers in real time. Climb the ladder, claim your throne, and
              enshrine your name into the obsidian halls.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gold">
                <Link to="/rankings">
                  <Trophy size={16} /> View Full Rankings
                </Link>
              </Button>
              <Button asChild variant="ghostGold">
                <Link to="/rankings">
                  Guilds <ArrowRight size={14} />
                </Link>
              </Button>
            </div>
          </div>

          <div className="surface-card overflow-hidden rounded-sm">
            <div className="border-b border-border bg-surface-2/80 px-5 py-3">
              <h3 className="flex items-center gap-2 font-display text-sm uppercase tracking-widest text-primary">
                <Crown size={14} /> Top Adventurers
              </h3>
            </div>
            <ul className="divide-y divide-border/60">
              {top.map((p) => (
                <li
                  key={p.rank}
                  className="grid grid-cols-[36px_1fr_auto] items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface-2/60"
                >
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-sm text-xs font-bold ${
                      p.rank === 1
                        ? "bg-gradient-gold text-primary-foreground shadow-gold"
                        : p.rank <= 3
                        ? "border border-primary/60 text-primary"
                        : "border border-border text-muted-foreground"
                    }`}
                  >
                    {p.rank}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.class}
                      {p.guild ? ` · ${p.guild}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold text-primary">Lv {p.level}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {p.resets} resets
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
