/**
 * Centralized data store contexts.
 *
 * NOTE: This file mirrors a real API client. Today, all reads come from
 * /src/data/*.json mock files, and writes are kept in React state.
 * To swap to a real backend later, replace the initializers and the
 * `update*` functions with fetch/mutation calls — components stay unchanged.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import settingsData from "@/data/settings.json";
import newsData from "@/data/news.json";
import usersData from "@/data/users.json";
import rankingsData from "@/data/rankings.json";
import statusData from "@/data/server_status.json";

// ---------- Types ----------
export type DownloadLink = { title: string; url: string; size?: string };

export type Settings = {
  server_name: string;
  season: string;
  version: string;
  exp_rate: number;
  drop_rate: number;
  max_level: number;
  max_resets: number;
  discord_url: string;
  maintenance_mode: boolean;
  maintenance_message: string;
  download_links: DownloadLink[];
};

export type NewsItem = {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string;
};

export type MockUser = {
  id: string;
  username: string;
  email: string;
  role: "admin" | "moderator" | "user";
  status: "active" | "banned" | "suspended";
  created_at: string;
  last_login: string;
};

export type RankingEntry = {
  rank: number;
  name: string;
  level: number;
  resets: number;
  class: string;
  guild: string | null;
  score: number;
};

export type ServerStatus = {
  online_count: number;
  max_capacity: number;
  status: "online" | "offline" | "maintenance";
  uptime_days: number;
  last_restart: string;
  regions: { name: string; online: number; status: string }[];
};

// ---------- Context ----------
type DataContextValue = {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;

  news: NewsItem[];
  createNews: (item: Omit<NewsItem, "id">) => void;
  updateNews: (id: number, patch: Partial<NewsItem>) => void;
  deleteNews: (id: number) => void;

  users: MockUser[];
  updateUser: (id: string, patch: Partial<MockUser>) => void;
  deleteUser: (id: string) => void;

  rankings: RankingEntry[];
  serverStatus: ServerStatus;
};

const DataContext = createContext<DataContextValue | null>(null);

const STORAGE_KEY = "mu-eternia:data:v1";

type Persisted = {
  settings: Settings;
  news: NewsItem[];
  users: MockUser[];
};

function loadPersisted(): Persisted | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Persisted;
  } catch {
    return null;
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const initial = loadPersisted();

  const [settings, setSettings] = useState<Settings>(
    initial?.settings ?? (settingsData as Settings)
  );
  const [news, setNews] = useState<NewsItem[]>(
    initial?.news ?? (newsData as { items: NewsItem[] }).items
  );
  const [users, setUsers] = useState<MockUser[]>(
    initial?.users ?? (usersData as { items: MockUser[] }).items
  );

  const rankings = useMemo(
    () => (rankingsData as { items: RankingEntry[] }).items,
    []
  );
  const serverStatus = useMemo(() => statusData as ServerStatus, []);

  // Persist admin edits across reloads (mock "save").
  useEffect(() => {
    const payload: Persisted = { settings, news, users };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [settings, news, users]);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  const createNews = useCallback((item: Omit<NewsItem, "id">) => {
    setNews((list) => {
      const id = (list.reduce((m, n) => Math.max(m, n.id), 0) || 0) + 1;
      return [{ ...item, id }, ...list];
    });
  }, []);

  const updateNews = useCallback((id: number, patch: Partial<NewsItem>) => {
    setNews((list) => list.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  }, []);

  const deleteNews = useCallback((id: number) => {
    setNews((list) => list.filter((n) => n.id !== id));
  }, []);

  const updateUser = useCallback((id: string, patch: Partial<MockUser>) => {
    setUsers((list) => list.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  }, []);

  const deleteUser = useCallback((id: string) => {
    setUsers((list) => list.filter((u) => u.id !== id));
  }, []);

  const value: DataContextValue = {
    settings,
    updateSettings,
    news,
    createNews,
    updateNews,
    deleteNews,
    users,
    updateUser,
    deleteUser,
    rankings,
    serverStatus,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
