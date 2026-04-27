/**
 * Mock auth provider — speaks the production schema:
 *
 *   SELECT "Id", "LoginName", "EMail"
 *     FROM data."Account"
 *    WHERE "LoginName" = $1
 *      AND "PasswordHash" = crypt($2, "PasswordHash");  -- bcrypt in prod
 *
 * In this mock we keep a tiny credential table (DEMO_CREDENTIALS) keyed by
 * LoginName. Replace `login` / `register` bodies with a real call when wiring
 * the backend — the AuthUser shape and `useAuth()` API stay unchanged.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useData, type Account } from "@/store/DataContext";

export type AuthUser = {
  /** maps to Account.Id */
  id: string;
  /** maps to Account.LoginName */
  loginName: string;
  /** maps to Account.EMail */
  email: string;
  /** Application-level role (not in data.Account). admin = GM. */
  role: "admin" | "user";
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (loginName: string, password: string) => Promise<{ error?: string }>;
  register: (
    loginName: string,
    email: string,
    password: string
  ) => Promise<{ error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_KEY = "mu-eternia:auth:v2";

/** Demo credentials — replaced by real bcrypt verification in production. */
const DEMO_CREDENTIALS: Record<string, { password: string; role: "admin" | "user" }> = {
  gamemaster: { password: "admin123", role: "admin" },
  wanderinghero: { password: "player123", role: "user" },
};

function accountToAuthUser(a: Account, role: "admin" | "user"): AuthUser {
  return { id: a.Id, loginName: a.LoginName, email: a.EMail, role };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { accounts, updateAccount } = useData();
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

  const persist = useCallback((next: AuthUser | null) => {
    if (next) localStorage.setItem(AUTH_KEY, JSON.stringify(next));
    else localStorage.removeItem(AUTH_KEY);
    setUser(next);
  }, []);

  const login = useCallback(
    async (loginName: string, password: string) => {
      await new Promise((r) => setTimeout(r, 300));
      const key = loginName.trim().toLowerCase();
      const creds = DEMO_CREDENTIALS[key];
      if (!creds || creds.password !== password) {
        return { error: "Invalid credentials. Try gamemaster / admin123." };
      }
      const account = accounts.find((a) => a.LoginName.toLowerCase() === key);
      if (!account) return { error: "Account not found." };

      // Mark online: UPDATE data."Account" SET "State" = 1 WHERE "Id" = $1
      updateAccount(account.Id, { State: 1 });
      persist(accountToAuthUser(account, creds.role));
      return {};
    },
    [accounts, updateAccount, persist]
  );

  const register = useCallback(
    async (loginName: string, email: string, password: string) => {
      await new Promise((r) => setTimeout(r, 350));
      if (!loginName || !email || password.length < 6) {
        return {
          error:
            "Please fill all fields. Password must be at least 6 characters.",
        };
      }
      const key = loginName.trim().toLowerCase();
      if (accounts.some((a) => a.LoginName.toLowerCase() === key)) {
        return { error: "That LoginName is already taken." };
      }
      // In production this would INSERT INTO data."Account" (...) RETURNING *.
      const newUser: AuthUser = {
        id: `auth_${Date.now()}`,
        loginName: key,
        email,
        role: "user",
      };
      persist(newUser);
      return {};
    },
    [accounts, persist]
  );

  const logout = useCallback(() => {
    if (user) {
      // UPDATE data."Account" SET "State" = 0 WHERE "Id" = $1
      const acct = accounts.find((a) => a.Id === user.id);
      if (acct) updateAccount(acct.Id, { State: 0 });
    }
    persist(null);
  }, [user, accounts, updateAccount, persist]);

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
