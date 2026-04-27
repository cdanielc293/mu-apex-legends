/**
 * Mock auth provider.
 *
 * Replace the body of `login` / `register` / `logout` with real API calls
 * (e.g. Lovable Cloud / Supabase) — the surface area used by routes and UI
 * does not need to change.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_KEY = "mu-eternia:auth:v1";

// Demo accounts — purely client-side, swap for real auth later.
const DEMO_ACCOUNTS: { email: string; password: string; user: AuthUser }[] = [
  {
    email: "admin@mu-eternia.gg",
    password: "admin123",
    user: { id: "auth_1", username: "GameMaster", email: "admin@mu-eternia.gg", role: "admin" },
  },
  {
    email: "player@mu-eternia.gg",
    password: "player123",
    user: { id: "auth_2", username: "WanderingHero", email: "player@mu-eternia.gg", role: "user" },
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const persist = (next: AuthUser | null) => {
    if (next) localStorage.setItem(AUTH_KEY, JSON.stringify(next));
    else localStorage.removeItem(AUTH_KEY);
    setUser(next);
  };

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 350));
    const match = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    );
    if (!match) return { error: "Invalid credentials. Try admin@mu-eternia.gg / admin123." };
    persist(match.user);
    return {};
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 400));
    if (!username || !email || password.length < 6)
      return { error: "Please fill all fields. Password must be at least 6 characters." };
    const newUser: AuthUser = {
      id: `auth_${Date.now()}`,
      username,
      email,
      role: "user",
    };
    persist(newUser);
    return {};
  }, []);

  const logout = useCallback(() => persist(null), []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
