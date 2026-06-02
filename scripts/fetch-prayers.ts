/**
 * Pulls today's prayer-times for the default city (Makkah) at build time from
 * Aladhan and writes `src/data/prayers-default.json`. The hero PrayerCard renders
 * this immediately on first paint, so visitors see real timings without a runtime
 * API request — and Lighthouse audits don't trigger 429s during rapid CI runs.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAladhanCalendar } from '@/lib/api/aladhan';
import type { PrayerDay } from '@/lib/api/nedaa';
import { DEFAULT_METHOD_ID, DEFAULT_SCHOOL } from '@/data/calc-methods';
import { MAKKAH } from '@/lib/cities';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'src/data/prayers-default.json');

export type DefaultPrayers = {
  city: string;
  lat: number;
  lng: number;
  provider: string;
  /** Chronologically sorted PrayerDay rows for the current month. */
  days: PrayerDay[];
  fetchedAt: string;
};

const readExisting = async (): Promise<DefaultPrayers | null> => {
  try {
    return JSON.parse(await readFile(OUT, 'utf8')) as DefaultPrayers;
  } catch {
    return null;
  }
};

const main = async () => {
  const today = new Date();
  const res = await getAladhanCalendar(
    {
      lat: MAKKAH.lat,
      lng: MAKKAH.lng,
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      method: DEFAULT_METHOD_ID,
      school: DEFAULT_SCHOOL,
    },
    { timeoutMs: 8000 },
  );

  if (!res.ok) {
    const existing = await readExisting();
    console.warn(
      '[fetch-prayers] Aladhan failed:',
      res.error.kind,
      `— ${existing ? 'keeping previous' : 'no fallback available'}`,
    );
    if (!existing) process.exit(1);
    return;
  }

  const month = today.toISOString().slice(0, 7); // YYYY-MM
  const days = res.data.filter((d) => d.timings.fajr.startsWith(month));
  if (days.length === 0) {
    console.warn('[fetch-prayers] response had no days for current month');
    process.exit(1);
  }

  const out: DefaultPrayers = {
    city: MAKKAH.city,
    lat: MAKKAH.lat,
    lng: MAKKAH.lng,
    provider: 'aladhan',
    days,
    fetchedAt: today.toISOString(),
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`[fetch-prayers] ${out.city} · ${days.length} days · provider=${out.provider}`);
};

await main();
