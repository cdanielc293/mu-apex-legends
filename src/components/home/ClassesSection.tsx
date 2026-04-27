import { Link } from "react-router-dom";
import classKnight from "@/assets/class-knight.jpg";
import classWizard from "@/assets/class-wizard.jpg";
import classElf from "@/assets/class-elf.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CLASSES = [
  {
    name: "Dark Knight",
    tagline: "Stalwart Vanguard",
    desc: "Heavy plate, brutal greatswords, and unwavering will. The first line of every siege.",
    img: classKnight,
  },
  {
    name: "Dark Wizard",
    tagline: "Arcane Storm",
    desc: "Master of evil spirits and meteor strikes. Glass cannons that shape battles from afar.",
    img: classWizard,
  },
  {
    name: "Elf",
    tagline: "Silent Hunter",
    desc: "Precision archery and nature magic. Tip the scales with every well-placed arrow.",
    img: classElf,
  },
];

export function ClassesSection() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="container-page">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.4em] text-primary">
            Choose your path
          </p>
          <h2 className="font-display text-4xl font-bold md:text-5xl">
            <span className="text-foreground">Legends Are </span>
            <span className="text-gold-gradient">Forged</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Nine ancient bloodlines, each with its own destiny. Pick wisely — the continent
            remembers every blow struck in its name.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {CLASSES.map((c, i) => (
            <article
              key={c.name}
              className="group relative isolate overflow-hidden rounded-sm border border-border bg-surface-1 transition-all duration-500 hover:-translate-y-1 hover:border-primary/60 hover:shadow-gold-lg"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={c.img}
                  alt={`${c.name} portrait`}
                  loading="lazy"
                  width={800}
                  height={1024}
                  className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-primary">{c.tagline}</p>
                <h3 className="mt-1 font-display text-2xl font-bold">{c.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              </div>

              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="ghostGold">
            <Link to="/classes">
              View all 9 classes <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
