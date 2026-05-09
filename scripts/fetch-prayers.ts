/**
 * Pulls today's prayer-times for the default city (Makkah) at build time
 * and writes `src/data/prayers-default.json`. The hero PrayerCard renders
 * this immediately on first paint, so visitors see real timings without
 * a runtime API request — and Lighthouse audits don't trigger 429s during
 * rapid CI runs.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPrayers, todayFrom, type PrayerDay } from '@/lib/api/nedaa';
import { MAKKAH } from '@/lib/tz-cities';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'src/data/prayers-default.json');

export type DefaultPrayers = {
  city: string;
  lat: number;
  lng: number;
  provider: string;
  day: PrayerDay;
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
  const res = await getPrayers(
    {
      lat: MAKKAH.lat,
      lng: MAKKAH.lng,
      year: today.getFullYear(),
      month: today.getMonth() + 1,
    },
    { timeoutMs: 8000 },
  );

  if (!res.ok) {
    const existing = await readExisting();
    console.warn(
      '[fetch-prayers] API failed:',
      res.error.kind,
      `— ${existing ? 'keeping previous' : 'no fallback available'}`,
    );
    if (!existing) process.exit(1);
    return;
  }

  const day = todayFrom(res.data, today);
  if (!day) {
    console.warn("[fetch-prayers] couldn't locate today's row in API response");
    process.exit(1);
  }

  const out: DefaultPrayers = {
    city: MAKKAH.city,
    lat: MAKKAH.lat,
    lng: MAKKAH.lng,
    provider: res.data.provider,
    day,
    fetchedAt: today.toISOString(),
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`[fetch-prayers] ${out.city} · provider=${out.provider}`);
};

await main();
