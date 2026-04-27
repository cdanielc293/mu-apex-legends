/**
 * Data layer mirroring the production PostgreSQL schema.
 *
 * Tables exposed (SQL → TS):
 *   data.Account                      → accounts        (Account[])
 *   data.Character                    → characters      (Character[])
 *   data.CharacterClass               → characterClasses
 *   config.GameServerConfiguration    → gameServerConfig
 *   public.shop_items                 → shopItems       (mock until backend exists)
 *
 * App-level data (news, settings, server status) is kept here as well.
 *
 * NOTE: All reads come from /src/data/*.json. Writes are stored in React state
 * + localStorage. Each `update*` function maps 1:1 to a future SQL UPDATE so
 * that swapping in a real client (Lovable Cloud / Supabase) is a drop-in.
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
import statusData from "@/data/server_status.json";
import accountsData from "@/data/accounts.json";
import charactersData from "@/data/characters.json";
import classesData from "@/data/character_classes.json";
import gameServerConfigData from "@/data/game_server_configuration.json";
import shopItemsData from "@/data/shop_items.json";

// ============================================================
// SQL-shaped types
// ============================================================

/** data.Account — PascalCase to match SQL columns */
export type Account = {
  Id: string; // uuid
  LoginName: string;
  PasswordHash: string;
  EMail: string;
  /** 0 = offline, >=1 = online */
  State: number;
  RegistrationDate: string; // ISO timestamp
};

/** data.Character */
export type Character = {
  Id: string;
  AccountId: string;
  Name: string;
  Level: number;
  Experience: number; // bigint -> number for client; swap to bigint when wiring real API
  PlayerKillCount: number;
  CharacterClassId: string;
};

/** data.CharacterClass (lookup) */
export type CharacterClass = {
  Id: string;
  Name: string;
};

/** config.GameServerConfiguration */
export type GameServerConfiguration = {
  MaximumPlayers: number;
};

/** Web Shop catalog (mock table). image_key maps to a bundled asset. */
export type ShopItem = {
  id: string;
  name: string;
  description: string;
  price_points: number;
  category: string;
  image_key: string;
};

// ============================================================
// Local-only types (UI/CMS data not in production SQL)
// ============================================================

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

export type ServerStatus = {
  online_count: number;
  max_capacity: number;
  status: "online" | "offline" | "maintenance";
  uptime_days: number;
  last_restart: string;
  regions: { name: string; online: number; status: string }[];
};

// ============================================================
// Ranking projection (joins data.Character + data.CharacterClass + data.Account)
// SQL equivalent:
//   SELECT c."Name", c."Level", c."Experience", c."PlayerKillCount",
//          cc."Name" AS "ClassName", a."LoginName"
//     FROM data."Character" c
//     JOIN data."CharacterClass" cc ON cc."Id" = c."CharacterClassId"
//     JOIN data."Account" a         ON a."Id"  = c."AccountId"
//    ORDER BY c."Experience" DESC
//    LIMIT 100;
// ============================================================
export type RankingRow = {
  rank: number;
  CharacterId: string;
  Name: string;
  Level: number;
  Experience: number;
  PlayerKillCount: number;
  ClassName: string;
  LoginName: string;
};

// ============================================================
// Context
// ============================================================
type DataContextValue = {
  // Tables
  accounts: Account[];
  characters: Character[];
  characterClasses: CharacterClass[];
  gameServerConfig: GameServerConfiguration;
  shopItems: ShopItem[];

  // CMS / app data
  settings: Settings;
  news: NewsItem[];
  serverStatus: ServerStatus;

  // Derived
  rankings: RankingRow[];
  /** Live count: COUNT(*) FROM data."Account" WHERE "State" > 0 */
  onlinePlayerCount: number;

  // Lookups
  getCharacterClassName: (id: string) => string;

  // Mutations — Account
  updateAccount: (id: string, patch: Partial<Account>) => void;
  deleteAccount: (id: string) => void;

  // Mutations — GameServerConfiguration
  updateGameServerConfig: (patch: Partial<GameServerConfiguration>) => void;

  // Mutations — ShopItem
  createShopItem: (item: Omit<ShopItem, "id">) => void;
  updateShopItem: (id: string, patch: Partial<ShopItem>) => void;
  deleteShopItem: (id: string) => void;

  // Mutations — News
  createNews: (item: Omit<NewsItem, "id">) => void;
  updateNews: (id: number, patch: Partial<NewsItem>) => void;
  deleteNews: (id: number) => void;

  // Mutations — Settings (CMS)
  updateSettings: (patch: Partial<Settings>) => void;
};

const DataContext = createContext<DataContextValue | null>(null);

const STORAGE_KEY = "mu-eternia:data:v2";

type Persisted = {
  settings: Settings;
  news: NewsItem[];
  accounts: Account[];
  gameServerConfig: GameServerConfiguration;
  shopItems: ShopItem[];
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

  // Mutable state
  const [settings, setSettings] = useState<Settings>(
    initial?.settings ?? (settingsData as Settings)
  );
  const [news, setNews] = useState<NewsItem[]>(
    initial?.news ?? (newsData as { items: NewsItem[] }).items
  );
  const [accounts, setAccounts] = useState<Account[]>(
    initial?.accounts ?? (accountsData as { items: Account[] }).items
  );
  const [gameServerConfig, setGameServerConfig] = useState<GameServerConfiguration>(
    initial?.gameServerConfig ?? (gameServerConfigData as GameServerConfiguration)
  );
  const [shopItems, setShopItems] = useState<ShopItem[]>(
    initial?.shopItems ?? (shopItemsData as { items: ShopItem[] }).items
  );

  // Static (would also be fetched in production)
  const characters = useMemo(
    () => (charactersData as { items: Character[] }).items,
    []
  );
  const characterClasses = useMemo(
    () => (classesData as { items: CharacterClass[] }).items,
    []
  );
  const baseStatus = useMemo(() => statusData as ServerStatus, []);

  // Persist mutable slices
  useEffect(() => {
    const payload: Persisted = {
      settings,
      news,
      accounts,
      gameServerConfig,
      shopItems,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [settings, news, accounts, gameServerConfig, shopItems]);

  // ------- Derived selectors (mirror SQL views) -------

  const classNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of characterClasses) m.set(c.Id, c.Name);
    return m;
  }, [characterClasses]);

  const accountById = useMemo(() => {
    const m = new Map<string, Account>();
    for (const a of accounts) m.set(a.Id, a);
    return m;
  }, [accounts]);

  /** ORDER BY "Experience" DESC LIMIT 100 */
  const rankings = useMemo<RankingRow[]>(() => {
    const sorted = [...characters].sort((a, b) => b.Experience - a.Experience).slice(0, 100);
    return sorted.map((c, i) => ({
      rank: i + 1,
      CharacterId: c.Id,
      Name: c.Name,
      Level: c.Level,
      Experience: c.Experience,
      PlayerKillCount: c.PlayerKillCount,
      ClassName: classNameById.get(c.CharacterClassId) ?? "Unknown",
      LoginName: accountById.get(c.AccountId)?.LoginName ?? "—",
    }));
  }, [characters, classNameById, accountById]);

  /** Live: SELECT COUNT(*) FROM data."Account" WHERE "State" > 0 */
  const onlinePlayerCount = useMemo(
    () => accounts.reduce((n, a) => (a.State > 0 ? n + 1 : n), 0),
    [accounts]
  );

  // Recompose serverStatus so consumers reading `serverStatus.online_count`
  // also get the live SQL-derived value (and respect MaximumPlayers).
  const serverStatus = useMemo<ServerStatus>(
    () => ({
      ...baseStatus,
      online_count: onlinePlayerCount,
      max_capacity: gameServerConfig.MaximumPlayers,
    }),
    [baseStatus, onlinePlayerCount, gameServerConfig.MaximumPlayers]
  );

  // ------- Mutations -------

  const updateAccount = useCallback((id: string, patch: Partial<Account>) => {
    setAccounts((list) => list.map((a) => (a.Id === id ? { ...a, ...patch } : a)));
  }, []);

  const deleteAccount = useCallback((id: string) => {
    setAccounts((list) => list.filter((a) => a.Id !== id));
  }, []);

  const updateGameServerConfig = useCallback(
    (patch: Partial<GameServerConfiguration>) => {
      setGameServerConfig((c) => ({ ...c, ...patch }));
    },
    []
  );

  const createShopItem = useCallback((item: Omit<ShopItem, "id">) => {
    setShopItems((list) => [
      { ...item, id: `itm_${Date.now().toString(36)}` },
      ...list,
    ]);
  }, []);
  const updateShopItem = useCallback((id: string, patch: Partial<ShopItem>) => {
    setShopItems((list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);
  const deleteShopItem = useCallback((id: string) => {
    setShopItems((list) => list.filter((s) => s.id !== id));
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

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  const getCharacterClassName = useCallback(
    (id: string) => classNameById.get(id) ?? "Unknown",
    [classNameById]
  );

  const value: DataContextValue = {
    accounts,
    characters,
    characterClasses,
    gameServerConfig,
    shopItems,
    settings,
    news,
    serverStatus,
    rankings,
    onlinePlayerCount,
    getCharacterClassName,
    updateAccount,
    deleteAccount,
    updateGameServerConfig,
    createShopItem,
    updateShopItem,
    deleteShopItem,
    createNews,
    updateNews,
    deleteNews,
    updateSettings,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
