import { SiteLayout } from "@/components/site/SiteLayout";
import classKnight from "@/assets/class-knight.jpg";
import classWizard from "@/assets/class-wizard.jpg";
import classElf from "@/assets/class-elf.jpg";

const CLASSES = [
  {
    name: "Dark Knight",
    role: "Tank · Melee",
    desc: "An armored juggernaut wielding two-handed steel. Anchors every front line.",
    img: classKnight,
  },
  {
    name: "Dark Wizard",
    role: "DPS · Magic",
    desc: "Channels primal evil spirits and meteor showers from afar.",
    img: classWizard,
  },
  {
    name: "Elf",
    role: "Ranged · Support",
    desc: "Master archer and healer of the forest covenants.",
    img: classElf,
  },
  { name: "Magic Gladiator", role: "Hybrid · Melee/Magic", desc: "A relentless duelist who fuses steel and sorcery." },
  { name: "Dark Lord", role: "Summoner · Buffer", desc: "Commands raven mounts and elite guard companions." },
  { name: "Summoner", role: "DPS · Curses", desc: "Binds ancient demons to her will, weaving deadly debuffs." },
  { name: "Rage Fighter", role: "Bruiser · Melee", desc: "A monk-warrior of devastating fists and stances." },
  { name: "Grow Lancer", role: "Reach · Hybrid", desc: "A spear-wielder of disciplined precision and reach." },
  { name: "Rune Wizard", role: "DPS · Burst", desc: "Wields rune-bound staves of cataclysmic power." },
];

export default function Classes() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-gradient-to-b from-surface-1 to-background">
        <div className="container-page py-16 md:py-20">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.4em] text-primary">
            Bloodlines
          </p>
          <h1 className="font-display text-4xl font-bold md:text-6xl">
            <span className="text-foreground">Nine </span>
            <span className="text-gold-gradient">Eternal</span>
            <span className="text-foreground"> Classes</span>
          </h1>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CLASSES.map((c) => (
            <article
              key={c.name}
              className="group surface-card overflow-hidden rounded-sm transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-gold"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
                {c.img ? (
                  <img
                    src={c.img}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-gradient-to-br from-surface-2 to-surface-1">
                    <span className="font-display text-5xl text-gold-gradient">
                      {c.name.slice(0, 1)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-widest text-primary">{c.role}</p>
                <h3 className="mt-1 font-display text-xl font-bold">{c.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
