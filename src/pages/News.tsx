import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useData } from "@/store/DataContext";
import { Calendar, ChevronRight } from "lucide-react";
import sectionCathedral from "@/assets/section-cathedral.jpg";

export default function News() {
  const { news } = useData();
  const [activeId, setActiveId] = useState<number | null>(news[0]?.id ?? null);
  const active = news.find((n) => n.id === activeId) ?? news[0];

  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={sectionCathedral}
          alt=""
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        <div className="container-page py-16 md:py-20">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.4em] text-primary">
            News &amp; Updates
          </p>
          <h1 className="font-display text-4xl font-bold md:text-6xl">
            <span className="text-foreground">Chronicles of </span>
            <span className="text-gold-gradient">Eternia</span>
          </h1>
        </div>
      </section>

      <section className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_2fr]">
        {/* List */}
        <aside className="space-y-3">
          {news.map((n) => {
            const isActive = n.id === active?.id;
            return (
              <button
                key={n.id}
                onClick={() => setActiveId(n.id)}
                className={`group w-full rounded-sm border p-4 text-left transition-all ${
                  isActive
                    ? "border-primary/60 bg-surface-2 shadow-gold"
                    : "border-border bg-surface-1 hover:border-primary/40 hover:bg-surface-2"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-sm bg-primary/10 px-2 py-0.5 font-bold uppercase tracking-widest text-primary">
                    {n.category}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar size={11} /> {new Date(n.date).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-base font-semibold leading-snug">
                  {n.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{n.excerpt}</p>
                <div className="mt-2 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Read <ChevronRight size={12} />
                </div>
              </button>
            );
          })}
        </aside>

        {/* Article */}
        {active && (
          <article className="surface-card rounded-sm p-6 md:p-10">
            <span className="rounded-sm bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
              {active.category}
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl">
              {active.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {new Date(active.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <div className="ornate-divider my-6" />
            <p className="text-base text-muted-foreground">{active.excerpt}</p>
            <div className="mt-6 whitespace-pre-line leading-relaxed text-foreground/90">
              {active.content}
            </div>
          </article>
        )}
      </section>
    </SiteLayout>
  );
}
