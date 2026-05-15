/**
 * Direct browser → Aladhan client for the marketing prayer card.
 * Coordinates are rounded to a 1-decimal grid (~11 km) before sending,
 * matching the app's privacy stance on location precision.
 */
import { get, type ApiResult } from '@/lib/api/client';
import type { PrayerDay } from '@/lib/api/nedaa';

export const ALADHAN_API_BASE = 'https://api.aladhan.com/v1';

export type AladhanQuery = {
  lat: number;
  lng: number;
  year: number;
  month: number;
  /** Calculation method ID. Default 4 = Umm al-Qura. */
  method?: number;
  /** Asr madhhab. 0 = Standard, 1 = Hanafi. Default 0. */
  school?: 0 | 1;
};

type AladhanDay = {
  timings: Record<string, string>;
  date: { timestamp: string };
};

type AladhanCalendarResponse = {
  code: number;
  status: string;
  data: AladhanDay[];
};

/** Round to 1 decimal (~11 km grid) — privacy-preserving precision. */
export const roundCoord = (n: number): number => Math.round(n * 10) / 10;

const normalize = (day: AladhanDay): PrayerDay => {
  const t = day.timings;
  return {
    date: day.date.timestamp,
    timings: {
      fajr: t.Fajr!,
      sunrise: t.Sunrise!,
      dhuhr: t.Dhuhr!,
      asr: t.Asr!,
      sunset: t.Sunset!,
      maghrib: t.Maghrib!,
      isha: t.Isha!,
      imsak: t.Imsak!,
      midnight: t.Midnight!,
      firstthird: t.Firstthird!,
      lastthird: t.Lastthird!,
    },
  };
};

export const getAladhanCalendar = async (
  q: AladhanQuery,
  opts?: { timeoutMs?: number },
): Promise<ApiResult<PrayerDay[]>> => {
  const params = new URLSearchParams({
    latitude: String(roundCoord(q.lat)),
    longitude: String(roundCoord(q.lng)),
    method: String(q.method ?? 4),
    school: String(q.school ?? 0),
    iso8601: 'true',
  });
  const url = `${ALADHAN_API_BASE}/calendar/${q.year}/${q.month}?${params}`;
  const res = await get<AladhanCalendarResponse>(url, opts);
  if (!res.ok) return res;
  // Guard against malformed responses (rare; Aladhan can return code≠200 with 200 HTTP).
  if (!Array.isArray(res.data.data) || res.data.data.length === 0) {
    return { ok: false, error: { kind: 'parse', message: 'empty calendar' } };
  }
  return { ok: true, data: res.data.data.map(normalize) };
};
