import { get, type ApiResult } from '@/lib/api/client';

export const NEDAA_API_BASE = (import.meta.env.PUBLIC_NEDAA_API ?? '').replace(/\/$/, '');

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
  return get<PrayersResponse>(`${NEDAA_API_BASE}/v3/prayers/?${params}`, opts);
};

export type PrayerProvider = {
  id: string;
  name: string;
  website?: string;
  description?: string;
  supportedParams?: string[];
};

export const getPrayerProviders = (opts?: { timeoutMs?: number }) =>
  get<PrayerProvider[]>(`${NEDAA_API_BASE}/v3/prayers/providers`, opts);

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
  return get<ReverseGeocode>(`${NEDAA_API_BASE}/v3/locations/reverse-geocode?${params}`, opts);
};

// ── Stats ───────────────────────────────────────────────────────────────────

export type StatsPeriod = '24h' | '7d' | '30d';

export type EndpointStat = {
  endpoint: string;
  count: number;
  avgMs: number;
  errorRate: number;
};

export type StatsSummary = {
  period: string;
  totalRequests: number;
  errorRate: number;
  avgResponseTimeMs: number;
  endpoints: EndpointStat[];
  statusCodes: Record<string, number>;
};

/**
 * Called from the browser. The API authorises by `Origin`, which the
 * browser sets automatically when the site is served from nedaa.dev — so
 * no token is needed in production. In local dev (origin=localhost) the
 * request is rejected with 401, which the caller surfaces as an error
 * state.
 */
export const getStatsSummary = (period: StatsPeriod = '24h', opts?: { timeoutMs?: number }) =>
  get<StatsSummary>(`${NEDAA_API_BASE}/v3/stats/summary?period=${period}`, opts);

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
