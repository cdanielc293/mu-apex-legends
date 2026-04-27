/**
 * Live API client for the Mu Eternia game server.
 *
 * Base URL is configurable via VITE_GAME_API_URL. Falls back to the production
 * server provided by the operator. All functions return typed, normalised data
 * so the rest of the app can stay schema-stable.
 */

export const GAME_API_BASE_URL =
  (import.meta.env.VITE_GAME_API_URL as string | undefined) ??
  "http://213.57.181.98:35000";

/** Raw row as returned by GET /api/rankings */
export type ApiRankingRow = {
  Name: string;
  /** API returns a stringified bigint */
  Experience: string | number;
};

/** Raw payload returned by GET /api/stats */
export type ApiStats = {
  /** API returns a stringified integer */
  onlineCount: string | number;
};

async function getJson<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${GAME_API_BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    // The upstream server is plain HTTP — no credentials required.
    ...init,
  });
  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export function fetchRankings(signal?: AbortSignal): Promise<ApiRankingRow[]> {
  return getJson<ApiRankingRow[]>("/api/rankings", { signal });
}

export function fetchStats(signal?: AbortSignal): Promise<ApiStats> {
  return getJson<ApiStats>("/api/stats", { signal });
}

// ============================================================
// Domain helpers
// ============================================================

/**
 * Standard MU Online level curve (matches the OpenMU reference implementation):
 *   xp(level) = ((level + 8) * (level - 1) * level) * 10
 * We invert it numerically (monotonic) via a tight binary search over [1, 1500].
 */
const MAX_LEVEL_CAP = 1500;

export function levelFromExperience(exp: number | string): number {
  const xp = typeof exp === "string" ? Number(exp) : exp;
  if (!Number.isFinite(xp) || xp <= 0) return 1;

  const xpForLevel = (lvl: number) => ((lvl + 8) * (lvl - 1) * lvl) * 10;

  let lo = 1;
  let hi = MAX_LEVEL_CAP;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (xpForLevel(mid) <= xp) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/**
 * The /api/rankings endpoint does not return the character class. We infer it
 * from the conventional MU naming suffix (Dk, Dw, Elf, Mg, Dl, Sum, Rf, Lan, Rw).
 * Falls back to "Adventurer" when nothing matches.
 */
const CLASS_SUFFIXES: { suffix: string; name: string }[] = [
  { suffix: "Lan", name: "Grow Lancer" },
  { suffix: "Sum", name: "Summoner" },
  { suffix: "Elf", name: "Elf" },
  { suffix: "Rf", name: "Rage Fighter" },
  { suffix: "Rw", name: "Rune Wizard" },
  { suffix: "Mg", name: "Magic Gladiator" },
  { suffix: "Dl", name: "Dark Lord" },
  { suffix: "Dw", name: "Dark Wizard" },
  { suffix: "Dk", name: "Dark Knight" },
];

export function classNameFromCharacterName(name: string): string {
  for (const { suffix, name: cls } of CLASS_SUFFIXES) {
    const re = new RegExp(`${suffix}$`, "i");
    if (re.test(name)) return cls;
  }
  return "Adventurer";
}
