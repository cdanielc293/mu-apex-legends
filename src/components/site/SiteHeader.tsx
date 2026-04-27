import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { ServerStatusBadge } from "@/components/site/ServerStatusBadge";
import { useAuth } from "@/store/AuthContext";
import { LogOut, Menu, Shield, User as UserIcon, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/news", label: "News" },
  { to: "/rankings", label: "Rankings" },
  { to: "/classes", label: "Classes" },
  { to: "/download", label: "Download" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border/80 bg-background/85 backdrop-blur-xl shadow-deep"
          : "border-b border-transparent bg-gradient-to-b from-background/60 to-transparent backdrop-blur-sm"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="font-display uppercase tracking-widest text-xs">
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <ServerStatusBadge />
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="obsidian" size="sm" className="gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-sm bg-gradient-gold text-[11px] font-bold text-primary-foreground">
                    {user.username.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="hidden sm:inline max-w-[10ch] truncate">{user.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-semibold">{user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="gap-2">
                    <UserIcon size={14} /> Profile
                  </Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="gap-2 text-primary">
                      <Shield size={14} /> Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="gap-2 text-destructive">
                  <LogOut size={14} /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild variant="gold" size="sm">
                <Link to="/register">Play Free</Link>
              </Button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-sm border border-border bg-surface-1 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl transition-[max-height] duration-500 ease-smooth ${
          open ? "max-h-[28rem]" : "max-h-0"
        }`}
      >
        <nav className="container-page flex flex-col py-4">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `border-b border-border/40 py-3 font-display uppercase tracking-widest text-sm ${
                  isActive ? "text-primary" : "text-foreground"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {!user && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button asChild variant="obsidian">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild variant="gold">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between">
            <ServerStatusBadge />
          </div>
        </nav>
      </div>
    </header>
  );
}
