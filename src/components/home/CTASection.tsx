import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Play } from "lucide-react";
import ctaBattlefield from "@/assets/cta-battlefield.jpg";

export function CTASection() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={ctaBattlefield}
          alt=""
          loading="lazy"
          width={1920}
          height={800}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
      </div>

      <div className="container-page py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.4em] text-primary">
            Embark on your adventure
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight md:text-6xl">
            <span className="text-foreground">Your throne </span>
            <span className="text-gold-gradient">awaits.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Free to play. No subscription. Centuries of adventure ready to begin.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="hero" size="xl">
              <Link to="/register">
                <Play size={18} /> Play Now
              </Link>
            </Button>
            <Button asChild variant="ghostGold" size="xl">
              <Link to="/download">
                <Download size={18} /> Download
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
