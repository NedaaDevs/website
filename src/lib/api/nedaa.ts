import { get, type ApiResult } from '@/lib/api/client';

export const NEDAA_API_BASE =
  (import.meta.env?.PUBLIC_NEDAA_API ?? 'https://new.nedaa.dev').replace(/\/$/, '');

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

export const getStatsSummary = (
  period: StatsPeriod = '24h',
  opts?: { timeoutMs?: number; token?: string },
): Promise<ApiResult<StatsSummary>> => {
  const headers: HeadersInit = opts?.token
    ? { Authorization: `Bearer ${opts.token}` }
    : {};
  return get<StatsSummary>(`${NEDAA_API_BASE}/v3/stats/summary?period=${period}`, {
    timeoutMs: opts?.timeoutMs,
    headers,
  });
};

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Picks today's PrayerDay row out of a PrayersResponse based on the
 * device clock. Falls back to the first day of the first month if today
 * isn't found (e.g. month boundary edge case).
 */
export const todayFrom = (resp: PrayersResponse, now: Date = new Date()): PrayerDay | null => {
  const today = now.toISOString().slice(0, 10); // YYYY-MM-DD
  for (const days of Object.values(resp.months)) {
    for (const d of days) {
      if (d.timings.fajr.startsWith(today)) return d;
    }
  }
  const firstMonth = Object.values(resp.months)[0];
  return firstMonth?.[0] ?? null;
};
