import { Link } from "react-router-dom";
import { useData } from "@/store/DataContext";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import sectionCathedral from "@/assets/section-cathedral.jpg";

export function NewsSection() {
  const { news } = useData();
  const featured = news[0];
  const rest = news.slice(1, 4);

  if (!featured) return null;

  return (
    <section className="relative py-20 md:py-28">
      <div className="container-page">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.4em] text-primary">
              Latest from the realm
            </p>
            <h2 className="font-display text-4xl font-bold md:text-5xl">
              <span className="text-foreground">Chronicles &amp; </span>
              <span className="text-gold-gradient">Updates</span>
            </h2>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/news">
              All news <ArrowRight size={14} />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Featured */}
          <Link
            to="/news"
            className="group relative isolate col-span-1 overflow-hidden rounded-sm border border-border lg:col-span-3"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={sectionCathedral}
                alt="Featured news cover"
                loading="lazy"
                width={1600}
                height={900}
                className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <span className="inline-block rounded-sm bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                {featured.category}
              </span>
              <h3 className="mt-3 font-display text-2xl font-bold leading-tight md:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                {featured.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar size={12} /> {new Date(featured.date).toLocaleDateString()}
              </div>
            </div>
          </Link>

          {/* Side list */}
          <div className="col-span-1 flex flex-col gap-4 lg:col-span-2">
            {rest.map((n) => (
              <Link
                key={n.id}
                to="/news"
                className="group surface-card flex flex-col gap-2 rounded-sm p-5 transition-all hover:border-primary/50 hover:shadow-gold"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-sm bg-primary/10 px-2 py-0.5 font-bold uppercase tracking-widest text-primary">
                    {n.category}
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(n.date).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-display text-lg font-semibold leading-snug transition-colors group-hover:text-primary">
                  {n.title}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{n.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 sm:hidden">
          <Button asChild variant="ghostGold" className="w-full">
            <Link to="/news">
              All news <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
