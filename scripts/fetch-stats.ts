/**
 * Pulls the operational ledger snapshot from Nedaa's stats endpoint for
 * each supported window (24h, 7d, 30d) and writes `src/data/stats.json`.
 *
 * Authenticates with `NEDAA_ADMIN_KEY` from `.env` (local development);
 * production allows requests from the website's own origin without a key.
 *
 * Filters out scanner / probe paths (anything outside `/v3/*`) and the
 * health-check endpoint, then recomputes aggregates so totals reflect
 * user-facing traffic only.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getStatsSummary,
  type EndpointStat,
  type StatsSummary,
  type StatsPeriod,
} from '@/lib/api/nedaa';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'src/data/stats.json');

const PERIODS: StatsPeriod[] = ['24h', '7d', '30d'];

export type StatsBundle = {
  fetchedAt: string;
  windows: Record<StatsPeriod, StatsSummary>;
};

const isLegit = (e: EndpointStat): boolean =>
  e.endpoint.startsWith('/v3/') && !e.endpoint.startsWith('/v3/health');

const sanitise = (data: StatsSummary): StatsSummary => {
  const endpoints = data.endpoints.filter(isLegit).sort((a, b) => b.count - a.count);
  const totalRequests = endpoints.reduce((s, e) => s + e.count, 0);
  const errorRate =
    totalRequests > 0
      ? endpoints.reduce((s, e) => s + e.count * e.errorRate, 0) / totalRequests
      : 0;
  const avgResponseTimeMs =
    totalRequests > 0
      ? endpoints.reduce((s, e) => s + e.count * e.avgMs, 0) / totalRequests
      : 0;
  return {
    ...data,
    endpoints,
    totalRequests,
    errorRate,
    avgResponseTimeMs: Math.round(avgResponseTimeMs * 10) / 10,
  };
};

const empty = (period: StatsPeriod): StatsSummary => ({
  period,
  totalRequests: 0,
  errorRate: 0,
  avgResponseTimeMs: 0,
  endpoints: [],
  statusCodes: {},
});

const readExisting = async (): Promise<StatsBundle | null> => {
  try {
    return JSON.parse(await readFile(OUT, 'utf8')) as StatsBundle;
  } catch {
    return null;
  }
};

const main = async () => {
  const adminKey = process.env.NEDAA_ADMIN_KEY;
  const existing = await readExisting();
  const windows = {} as Record<StatsPeriod, StatsSummary>;

  for (const period of PERIODS) {
    const res = await getStatsSummary(period, { adminKey, timeoutMs: 6000 });
    if (res.ok) {
      windows[period] = sanitise(res.data);
      console.log(
        `[fetch-stats] ${period}: requests=${windows[period].totalRequests} endpoints=${windows[period].endpoints.length}`,
      );
    } else {
      windows[period] = existing?.windows?.[period] ?? empty(period);
      console.warn(
        `[fetch-stats] ${period} failed (${res.error.kind}) — ${
          existing?.windows?.[period] ? 'keeping previous' : 'using empty placeholder'
        }`,
      );
    }
  }

  const out: StatsBundle = { fetchedAt: new Date().toISOString(), windows };
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8');
};

await main();
