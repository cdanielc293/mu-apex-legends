import { Link } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { useData } from "@/store/DataContext";
import { Facebook, Instagram, MessageCircle, Twitch, Youtube } from "lucide-react";

const COLS = [
  {
    title: "Game",
    links: [
      { label: "News", to: "/news" },
      { label: "Rankings", to: "/rankings" },
      { label: "Classes", to: "/classes" },
      { label: "Download", to: "/download" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", to: "/login" },
      { label: "Register", to: "/register" },
      { label: "Profile", to: "/profile" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Discord", to: "/" },
      { label: "Rules", to: "/" },
      { label: "Privacy Policy", to: "/" },
      { label: "Terms of Service", to: "/" },
    ],
  },
];

export function SiteFooter() {
  const { settings } = useData();
  return (
    <footer className="relative mt-24 border-t border-border bg-gradient-obsidian">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Forge your legend in the eternal continent. {settings.server_name} is a premium dark
              fantasy MMO experience built for veterans and adventurers alike.
            </p>
            <div className="flex items-center gap-2 pt-2">
              {[Facebook, Youtube, Twitch, MessageCircle, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-sm border border-border bg-surface-1 text-muted-foreground transition-all hover:border-primary/60 hover:text-primary hover:shadow-gold"
                  aria-label="Social link"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 font-display text-sm uppercase tracking-widest text-primary">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="ornate-divider my-10" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.server_name} · {settings.season} · v
            {settings.version}
          </p>
          <p>
            All artwork is fan-made and used under fair-use. {settings.server_name} is not
            affiliated with Webzen.
          </p>
        </div>
      </div>
    </footer>
  );
}
