import { SiteLayout } from "@/components/site/SiteLayout";
import { useData } from "@/store/DataContext";
import { Button } from "@/components/ui/button";
import { Download as DownloadIcon, ExternalLink, ShieldCheck } from "lucide-react";

export default function Download() {
  const { settings } = useData();

  const requirements = [
    { label: "OS", min: "Windows 10 64-bit", rec: "Windows 11 64-bit" },
    { label: "CPU", min: "Intel i3 / Ryzen 3", rec: "Intel i7 / Ryzen 7" },
    { label: "RAM", min: "4 GB", rec: "16 GB" },
    { label: "GPU", min: "GTX 750 / RX 460", rec: "RTX 2060 / RX 5700" },
    { label: "Storage", min: "8 GB free", rec: "16 GB SSD" },
  ];

  return (
    <SiteLayout>
      <section className="border-b border-border bg-gradient-to-b from-surface-1 to-background">
        <div className="container-page py-16 md:py-20">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.4em] text-primary">
            Get the Game
          </p>
          <h1 className="font-display text-4xl font-bold md:text-6xl">
            <span className="text-foreground">Download </span>
            <span className="text-gold-gradient">{settings.server_name}</span>
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Choose your preferred mirror. Verified, virus-scanned, and ready to launch.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-8 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-3">
          {settings.download_links.map((link) => (
            <div
              key={link.title}
              className="surface-card flex flex-col gap-3 rounded-sm p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-sm bg-gradient-gold-soft text-primary shadow-inset-gold">
                  <DownloadIcon size={20} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold">{link.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    Size: {link.size ?? "—"} · Verified mirror
                  </p>
                </div>
              </div>
              <Button asChild variant="gold">
                <a href={link.url} target="_blank" rel="noreferrer">
                  Download <ExternalLink size={14} />
                </a>
              </Button>
            </div>
          ))}

          <div className="surface-card rounded-sm border-primary/30 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-primary" size={18} />
              <div>
                <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
                  Safety Notice
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Always download from official mirrors. We never ask for your password — game
                  masters communicate exclusively through the in-game system.
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="surface-card rounded-sm p-6">
          <h3 className="font-display text-sm uppercase tracking-widest text-primary">
            System Requirements
          </h3>
          <div className="ornate-divider my-4" />
          <div className="grid grid-cols-[80px_1fr_1fr] gap-y-3 text-sm">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Spec
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Min
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Recommended
            </span>
            {requirements.map((r) => (
              <div key={r.label} className="contents">
                <span className="font-semibold">{r.label}</span>
                <span className="text-muted-foreground">{r.min}</span>
                <span className="text-foreground">{r.rec}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}
