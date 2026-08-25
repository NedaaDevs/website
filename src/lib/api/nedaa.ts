import { get, type ApiResult } from '@/lib/api/client';

type RuntimeConfig = { apiBase?: string; statsUrl?: string };

declare global {
  interface Window {
    __NEDAA__?: RuntimeConfig;
  }
}

/**
 * Read at call time, never at module scope. These values come from
 * /runtime-config.js, which the container rewrites on start — reading them
 * eagerly would bake them into a content-hashed bundle whose filename does not
 * change when the value does, so a CDN would serve the first copy forever.
 */
const config = (): RuntimeConfig =>
  (typeof window === 'undefined' ? undefined : window.__NEDAA__) ?? {};

export const apiBase = (): string => (config().apiBase ?? '').replace(/\/$/, '');
export const statsUrl = (): string => config().statsUrl ?? '';

// ── Prayer times ────────────────────────────────────────────────────────────

export type PrayerTimings = {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  sunset: string;
  maghrib: string;
  isha: string;
  imsak: string;
  midnight: string;
  firstthird: string;
  lastthird: string;
};

export type PrayerDay = {
  /** Unix epoch (seconds) as a string. */
  date: string;
  timings: PrayerTimings;
};

export type PrayerMonths = Record<string, PrayerDay[]>;

export type PrayersResponse = {
  timezone: string;
  coordinates: { lat: number; lng: number };
  provider: string;
  months: PrayerMonths;
};

export type PrayersQuery = {
  lat: number;
  lng: number;
  year?: number;
  month?: number;
  provider?: string;
};

export const getPrayers = (q: PrayersQuery, opts?: { timeoutMs?: number }) => {
  const params = new URLSearchParams({ lat: String(q.lat), lng: String(q.lng) });
  if (q.year) params.set('year', String(q.year));
  if (q.month) params.set('month', String(q.month));
  if (q.provider) params.set('provider', q.provider);
  return get<PrayersResponse>(`${apiBase()}/v3/prayers/?${params}`, opts);
};

export type PrayerProvider = {
  id: string;
  name: string;
  website?: string;
  description?: string;
  supportedParams?: string[];
};

export const getPrayerProviders = (opts?: { timeoutMs?: number }) =>
  get<PrayerProvider[]>(`${apiBase()}/v3/prayers/providers`, opts);

// ── Reverse geocode ─────────────────────────────────────────────────────────

export type ReverseGeocode = {
  countryName: string;
  city: string;
  timezone: string;
};

export const getReverseGeocode = (
  q: { lat: number; lng: number; locale: 'en' | 'ar' | 'ms' | 'ur' },
  opts?: { timeoutMs?: number },
): Promise<ApiResult<ReverseGeocode>> => {
  const params = new URLSearchParams({
    lat: String(q.lat),
    lng: String(q.lng),
    locale: q.locale,
  });
  return get<ReverseGeocode>(`${apiBase()}/v3/locations/reverse-geocode?${params}`, opts);
};

// ── Stats ───────────────────────────────────────────────────────────────────

export type StatsPeriodKey = '24h' | '7d' | '30d';

export type StatsPeriodStats = {
  requests: number;
  /** Whole percent, e.g. `99.95` — not a 0–1 fraction. */
  availabilityPct: number;
  p50Ms: number;
  p95Ms: number;
};

export type StatsCounts = { day: number; week: number; month: number; year: number; all: number };

export type StatsSnapshot = {
  generatedAt: string;
  periods: Record<StatsPeriodKey, StatsPeriodStats>;
  lifetimeRequests: number;
  catalog: { reciters: number; recitations: number; audioGB: number };
  topRecitations: {
    recitationId: string;
    /** Optional: older snapshots predate name enrichment, so fall back to the id. */
    nameEn?: string;
    nameAr?: string;
    style?: string;
    plays: StatsCounts;
  }[];
  /** Mushaf editions installed, keyed by the edition's QCF version (`v1`, `v2`, `v4`). */
  editionDownloads: { version: string; downloads: StatsCounts }[];
  requestsByModule: Record<string, number>;
  intrusionAttempts: number;
};

/**
 * Static snapshot served by a Cloudflare Worker — no auth, no headers.
 * Resolves to a network error when the URL is unset so callers render their
 * error state instead of a zeroed panel.
 */
export const getStatsSnapshot = (opts?: {
  timeoutMs?: number;
}): Promise<ApiResult<StatsSnapshot>> =>
  statsUrl()
    ? get<StatsSnapshot>(statsUrl(), opts)
    : Promise.resolve({
        ok: false,
        error: { kind: 'network', message: 'PUBLIC_STATS_URL is not set' },
      });

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Flattens `PrayersResponse.months` into a chronologically ordered list
 * of PrayerDay rows. The API keys months by epoch-seconds-as-string and
 * returns each day with ISO timestamps, so we can sort by the fajr ISO.
 */
export const flattenDays = (resp: PrayersResponse): PrayerDay[] =>
  Object.values(resp.months)
    .flat()
    .sort((a, b) => a.timings.fajr.localeCompare(b.timings.fajr));

const yyyymmdd = (d: Date): string => d.toISOString().slice(0, 10);

/** Index of today's row inside a flattened day list, or 0 if not found. */
export const indexOfToday = (days: PrayerDay[], now: Date = new Date()): number => {
  const today = yyyymmdd(now);
  const i = days.findIndex((d) => d.timings.fajr.startsWith(today));
  return i >= 0 ? i : 0;
};

export const todayFrom = (resp: PrayersResponse, now: Date = new Date()): PrayerDay | null => {
  const days = flattenDays(resp);
  return days[indexOfToday(days, now)] ?? null;
};
