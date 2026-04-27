import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import heroWarrior from "@/assets/hero-warrior.jpg";

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      {/* Form side */}
      <div className="flex flex-col bg-background">
        <header className="container-page flex h-20 items-center">
          <Logo />
        </header>
        <div className="container-page flex flex-1 items-center py-8">
          <div className="mx-auto w-full max-w-md">
            <h1 className="font-display text-3xl font-bold md:text-4xl">
              <span className="text-foreground">{title.split(" ")[0]} </span>
              <span className="text-gold-gradient">{title.split(" ").slice(1).join(" ")}</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
        <footer className="container-page py-6 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            ← Return to the realm
          </Link>
        </footer>
      </div>

      {/* Visual side */}
      <div className="relative isolate hidden overflow-hidden lg:block">
        <img
          src={heroWarrior}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/30 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

        <div className="relative flex h-full flex-col justify-end p-12">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Mu Eternia</p>
          <p className="mt-2 max-w-md font-display text-3xl font-bold leading-tight">
            "The continent does not remember the cautious — only the eternal."
          </p>
        </div>
      </div>
    </div>
  );
}
