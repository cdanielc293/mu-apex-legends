import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="container-page text-center">
        <div className="mx-auto mb-8 inline-block">
          <Logo size="lg" />
        </div>
        <p className="text-xs uppercase tracking-[0.4em] text-primary">Lost in the void</p>
        <h1 className="mt-2 font-display text-7xl font-bold text-gold-gradient md:text-9xl">404</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          The path you seek has been swallowed by the obsidian mists. Return to the realm.
        </p>
        <div className="mt-8">
          <Button asChild variant="gold" size="lg">
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
