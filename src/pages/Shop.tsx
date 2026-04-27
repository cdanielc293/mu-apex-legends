import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useData } from "@/store/DataContext";
import { shopImageFor } from "@/lib/shopImages";
import { Button } from "@/components/ui/button";
import { Coins, Search, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Shop() {
  const { shopItems } = useData();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(shopItems.map((s) => s.category))).sort()],
    [shopItems]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return shopItems.filter((s) => {
      if (cat !== "all" && s.category !== cat) return false;
      if (!needle) return true;
      return (
        s.name.toLowerCase().includes(needle) ||
        s.description.toLowerCase().includes(needle)
      );
    });
  }, [shopItems, q, cat]);

  return (
    <SiteLayout>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface-1 to-background">
        <div className="absolute inset-0 bg-gradient-radial-glow opacity-60" />
        <div className="container-page relative py-16 md:py-20">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.4em] text-primary">
            Web Shop
          </p>
          <h1 className="font-display text-4xl font-bold md:text-6xl">
            <span className="text-foreground">The </span>
            <span className="text-gold-gradient">Obsidian Bazaar</span>
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Spend your loyalty points on relics, mounts, and mythic gear. All purchases are
            delivered in-game instantly.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="container-page py-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search items..."
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-sm border px-3 py-1.5 text-xs font-display uppercase tracking-widest transition-colors ${
                  cat === c
                    ? "border-primary/70 bg-primary/15 text-primary"
                    : "border-border bg-surface-1 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group surface-card flex flex-col overflow-hidden rounded-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/60 hover:shadow-gold-lg"
            >
              <div className="relative aspect-square overflow-hidden bg-surface-2">
                <img
                  src={shopImageFor(item.image_key)}
                  alt={item.name}
                  loading="lazy"
                  width={512}
                  height={512}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-sm bg-background/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur">
                  {item.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-semibold leading-tight">{item.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-display text-xl font-bold text-gold-gradient">
                    <Coins size={16} className="text-primary" />
                    {item.price_points.toLocaleString()}
                  </span>
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() =>
                      toast.success(`${item.name} reserved`, {
                        description: "Sign in and visit your dashboard to complete the purchase.",
                      })
                    }
                  >
                    Buy
                  </Button>
                </div>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center gap-2 py-20 text-center">
              <ShoppingBag size={28} className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No items match your search.</p>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
