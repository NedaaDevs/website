/**
 * Pulls the latest iOS App Store release of Nedaa via iTunes Lookup at
 * build time and writes `src/data/release.json`. If the lookup fails the
 * existing checked-in JSON (or a fallback) is preserved so the build
 * doesn't crash on offline / transient errors.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lookupByBundleId } from '@/lib/api/itunes';

const BUNDLE_ID = 'dev.nedaa.app';
const ANDROID_PACKAGE = 'dev.nedaa.android';
const HUAWEI_APP_ID = 'C115223843';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'src/data/release.json');

export type Release = {
  version: string;
  releaseDate: string;
  trackId: number;
  trackName: string;
  minimumOsVersion: string;
  iosUrl: string;
  androidUrl: string;
  huaweiUrl: string;
  fetchedAt: string;
};

const FALLBACK: Release = {
  version: '2.9.1',
  releaseDate: '2026-04-21T13:54:16Z',
  trackId: 6740703900,
  trackName: 'Nedaa - Prayer Times & Athan',
  minimumOsVersion: '15.1',
  iosUrl: 'https://apps.apple.com/app/id6740703900',
  androidUrl: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`,
  huaweiUrl: `https://appgallery.huawei.com/app/${HUAWEI_APP_ID}`,
  fetchedAt: new Date().toISOString(),
};

const readExisting = async (): Promise<Release | null> => {
  try {
    return JSON.parse(await readFile(OUT, 'utf8')) as Release;
  } catch {
    return null;
  }
};

const main = async () => {
  const lookup = await lookupByBundleId(BUNDLE_ID, { timeoutMs: 5000 });

  let out: Release;
  if (lookup.ok) {
    const i = lookup.data;
    out = {
      version: i.version,
      releaseDate: i.currentVersionReleaseDate,
      trackId: i.trackId,
      trackName: i.trackName,
      minimumOsVersion: i.minimumOsVersion,
      iosUrl: i.trackViewUrl,
      androidUrl: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`,
      huaweiUrl: `https://appgallery.huawei.com/app/${HUAWEI_APP_ID}`,
      fetchedAt: new Date().toISOString(),
    };
  } else {
    const existing = await readExisting();
    out = existing ?? FALLBACK;
    console.warn(
      '[fetch-release] iTunes Lookup failed:',
      lookup.error.kind,
      `— using ${existing ? 'previous release.json' : 'hardcoded fallback'}`,
    );
  }

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`[fetch-release] ${out.version} · ${out.releaseDate}`);
};

await main();
