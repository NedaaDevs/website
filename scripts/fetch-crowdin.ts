/**
 * Pulls per-language translation progress from Crowdin at build time and writes
 * `src/data/crowdin-progress.json` for the localization section. Non-critical:
 * if the token/project id is missing or the API fails, writes an empty set so
 * the build still succeeds (the section falls back to the shipping list).
 *
 * CROWDIN_PROJECT_ID is a build arg; CROWDIN_API_TOKEN is a secret (mounted into
 * the build, never baked into the image) — both server-side only.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getLanguageProgress, type LanguageProgress } from '@/lib/api/crowdin';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'src/data/crowdin-progress.json');

export type CrowdinProgress = {
  fetchedAt: string | null;
  languages: LanguageProgress[];
};

const write = (data: CrowdinProgress) =>
  mkdir(dirname(OUT), { recursive: true }).then(() =>
    writeFile(OUT, JSON.stringify(data, null, 2) + '\n', 'utf8'),
  );

const main = async () => {
  const projectId = process.env.CROWDIN_PROJECT_ID;
  const token = process.env.CROWDIN_API_TOKEN;

  if (!projectId || !token) {
    console.warn('[fetch-crowdin] CROWDIN_PROJECT_ID/CROWDIN_API_TOKEN not set — empty set');
    await write({ fetchedAt: null, languages: [] });
    return;
  }

  const res = await getLanguageProgress(projectId, token, { timeoutMs: 8000 });
  if (!res.ok) {
    console.warn('[fetch-crowdin] Crowdin failed:', res.error.kind, '— empty set');
    await write({ fetchedAt: null, languages: [] });
    return;
  }

  const languages = res.data
    .filter((l) => l.translated > 0)
    .sort((a, b) => b.translated - a.translated);

  await write({ fetchedAt: new Date().toISOString(), languages });
  console.log(`[fetch-crowdin] ${languages.length} languages`);
};

await main();
