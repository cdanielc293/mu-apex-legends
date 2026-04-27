import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useData } from "@/store/DataContext";
import { Input } from "@/components/ui/input";
import { Crown, Search, Trophy } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Rankings() {
  const { rankings } = useData();
  const [q, setQ] = useState("");
  const [cls, setCls] = useState<string>("all");

  const classes = useMemo(
    () => Array.from(new Set(rankings.map((r) => r.class))).sort(),
    [rankings]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rankings.filter((r) => {
      if (cls !== "all" && r.class !== cls) return false;
      if (!needle) return true;
      return (
        r.name.toLowerCase().includes(needle) ||
        (r.guild ?? "").toLowerCase().includes(needle)
      );
    });
  }, [rankings, q, cls]);

  return (
    <SiteLayout>
      {/* Page header */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface-1 to-background">
        <div className="absolute inset-0 bg-gradient-radial-glow opacity-60" />
        <div className="container-page relative py-16 md:py-20">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.4em] text-primary">
            Hall of Legends
          </p>
          <h1 className="font-display text-4xl font-bold md:text-6xl">
            <span className="text-foreground">Top </span>
            <span className="text-gold-gradient">100 Adventurers</span>
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Real-time standings of the realm's most legendary warriors.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search adventurers or guilds..."
              className="pl-9"
            />
          </div>
          <Select value={cls} onValueChange={setCls}>
            <SelectTrigger className="sm:w-56">
              <SelectValue placeholder="All classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All classes</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="surface-card overflow-hidden rounded-sm">
          <div className="grid grid-cols-[60px_1fr_120px_80px_90px] items-center border-b border-border bg-surface-2/80 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:grid-cols-[60px_1fr_160px_120px_100px_120px]">
            <span>Rank</span>
            <span>Adventurer</span>
            <span className="hidden sm:block">Class</span>
            <span className="text-right">Level</span>
            <span className="text-right">Resets</span>
            <span className="hidden text-right sm:block">Guild</span>
          </div>

          <ul className="divide-y divide-border/60">
            {filtered.map((p) => (
              <li
                key={p.rank}
                className="grid grid-cols-[60px_1fr_120px_80px_90px] items-center px-4 py-3 transition-colors hover:bg-surface-2/60 sm:grid-cols-[60px_1fr_160px_120px_100px_120px]"
              >
                <span
                  className={`grid h-7 w-7 place-items-center rounded-sm text-xs font-bold ${
                    p.rank === 1
                      ? "bg-gradient-gold text-primary-foreground shadow-gold"
                      : p.rank <= 3
                      ? "border border-primary/60 text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {p.rank === 1 ? <Crown size={14} /> : p.rank}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground sm:hidden">
                    {p.class}
                    {p.guild ? ` · ${p.guild}` : ""}
                  </p>
                </div>
                <span className="hidden truncate text-sm text-muted-foreground sm:block">
                  {p.class}
                </span>
                <span className="text-right font-mono text-sm font-semibold text-primary">
                  {p.level}
                </span>
                <span className="text-right font-mono text-sm">{p.resets}</span>
                <span className="hidden truncate text-right text-sm text-muted-foreground sm:block">
                  {p.guild ?? "—"}
                </span>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="flex flex-col items-center justify-center gap-2 px-4 py-16 text-center">
                <Trophy size={28} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No adventurers match your search.</p>
              </li>
            )}
          </ul>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Showing {filtered.length} of {rankings.length} adventurers.
        </p>
      </section>
    </SiteLayout>
  );
}
