#!/usr/bin/env bun
// Generate one PNG per OG manifest entry into public/og/<slug>.png.
//
// Spawns `astro dev`, navigates Playwright to /og-render/<slug>/, screenshots
// the .og element at 1200x630, saves to public/og/. Run when titles change:
//   bun run og:gen

import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';
import { OG_MANIFEST } from '../src/lib/og-manifest';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const OUT = resolve(ROOT, 'public', 'og');

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const startDev = (): Promise<{ url: string; stop: () => void }> =>
  new Promise((accept, reject) => {
    const port = 4400 + Math.floor(Math.random() * 200);
    const proc = spawn('bun', ['run', 'astro', 'dev', '--port', String(port)], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, OG_GEN: '1' },
    });
    let resolved = false;
    const onLine = (chunk: Buffer) => {
      const out = chunk.toString();
      if (!resolved && /Local\s+http:\/\/localhost:/.test(out)) {
        resolved = true;
        accept({
          url: `http://localhost:${port}`,
          stop: () => proc.kill('SIGTERM'),
        });
      }
    };
    proc.stdout!.on('data', onLine);
    proc.stderr!.on('data', onLine);
    proc.on('exit', (code) => {
      if (!resolved) reject(new Error(`astro dev exited with code ${code}`));
    });
    setTimeout(() => {
      if (!resolved) reject(new Error('astro dev startup timed out'));
    }, 30_000);
  });

const main = async () => {
  await mkdir(OUT, { recursive: true });

  console.log('Starting astro dev…');
  const { url, stop } = await startDev();
  await wait(800);
  console.log(`  ready at ${url}`);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();

  let i = 0;
  for (const entry of OG_MANIFEST) {
    i++;
    const target = `${url}/og-render/${entry.slug}/`;
    process.stdout.write(`  [${i}/${OG_MANIFEST.length}] ${entry.slug} … `);
    await page.goto(target, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await page.evaluate(() => (document as any).fonts?.ready);
    await wait(150);
    const out = resolve(OUT, `${entry.slug}.png`);
    await mkdir(dirname(out), { recursive: true });
    await page.locator('.og').first().screenshot({ path: out });
    console.log('ok');
  }

  await browser.close();
  stop();
  await wait(200);
  console.log(`\n${OG_MANIFEST.length} OG images written to public/og/`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
