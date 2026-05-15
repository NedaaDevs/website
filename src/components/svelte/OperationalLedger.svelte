<script lang="ts">
  import type { Locale } from '@/i18n/types';
  import {
    getStatsSummary,
    type EndpointStat,
    type StatsPeriod,
    type StatsSummary,
  } from '@/lib/api/nedaa';

  type Labels = {
    period: string;
    totalRequests: string;
    errorRate: string;
    avgResponse: string;
    endpoints: string;
    statusCodes: string;
    path: string;
    share: string;
    avg: string;
    requests: string;
    note: string;
    empty: string;
    loading: string;
    error: string;
    over: string;
    acrossEndpoints: string;
    period24h: string;
    period7d: string;
    period30d: string;
  };
  type Props = { lang: Locale; labels: Labels };

  const { lang, labels }: Props = $props();

  const PERIODS: { id: StatsPeriod; short: string }[] = [
    { id: '24h', short: labels.period24h },
    { id: '7d', short: labels.period7d },
    { id: '30d', short: labels.period30d },
  ];

  let active = $state<StatsPeriod>('24h');
  const cache = new Map<StatsPeriod, StatsSummary | 'loading' | 'error'>();
  let tick = $state(0);

  const baseLocale = lang === 'en' ? 'en-US' : `${lang}-SA`;
  const compact = new Intl.NumberFormat(baseLocale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  });
  const exact = new Intl.NumberFormat(baseLocale);
  const percent = new Intl.NumberFormat(baseLocale, {
    style: 'percent',
    maximumFractionDigits: 2,
  });

  const isLegit = (e: EndpointStat): boolean =>
    e.endpoint.startsWith('/v3/') && !e.endpoint.startsWith('/v3/health');

  const sanitise = (s: StatsSummary): StatsSummary => {
    const endpoints = s.endpoints.filter(isLegit).sort((a, b) => b.count - a.count);
    const totalRequests = endpoints.reduce((acc, e) => acc + e.count, 0);
    const errorRate =
      totalRequests > 0
        ? endpoints.reduce((acc, e) => acc + e.count * e.errorRate, 0) / totalRequests
        : 0;
    const avgResponseTimeMs =
      totalRequests > 0
        ? endpoints.reduce((acc, e) => acc + e.count * e.avgMs, 0) / totalRequests
        : 0;
    return {
      ...s,
      endpoints,
      totalRequests,
      errorRate,
      avgResponseTimeMs: Math.round(avgResponseTimeMs * 10) / 10,
    };
  };

  const load = async (period: StatsPeriod) => {
    if (cache.get(period)) return;
    cache.set(period, 'loading');
    tick += 1;
    const res = await getStatsSummary(period, { timeoutMs: 6000 });
    cache.set(period, res.ok ? sanitise(res.data) : 'error');
    tick += 1;
  };

  $effect(() => {
    void load(active);
  });

  const state = $derived.by(() => {
    void tick;
    return cache.get(active);
  });

  const stats = $derived(typeof state === 'object' ? state : null);

  const codeTone = (code: string): 'ok' | 'redir' | 'warn' | 'err' => {
    const n = Number(code);
    if (n >= 500) return 'err';
    if (n >= 400) return 'warn';
    if (n >= 300) return 'redir';
    return 'ok';
  };

  const errorTone = $derived<'ok' | 'warn' | 'err'>(
    !stats
      ? 'ok'
      : stats.errorRate < 0.01
        ? 'ok'
        : stats.errorRate < 0.05
          ? 'warn'
          : 'err',
  );

  type CodeRow = { code: string; count: number };
  const statusRows = $derived<CodeRow[]>(
    stats
      ? Object.entries(stats.statusCodes ?? {})
          .map(([code, count]) => ({ code, count: count as number }))
          .sort((a, b) => Number(a.code) - Number(b.code))
      : [],
  );
  const statusTotal = $derived(statusRows.reduce((s, r) => s + r.count, 0) || 1);
</script>

<div class="ledger-card">
  <div class="tabs" role="tablist" aria-label={labels.period}>
    {#each PERIODS as p}
      <button
        type="button"
        role="tab"
        aria-selected={active === p.id}
        class:active={active === p.id}
        onclick={() => (active = p.id)}
      >
        {p.short}
      </button>
    {/each}
  </div>

  {#if state === 'loading' || state === undefined}
    <p class="status-msg">{labels.loading}</p>
  {:else if state === 'error'}
    <p class="status-msg err">{labels.error}</p>
  {:else if stats && stats.totalRequests === 0}
    <p class="status-msg">{labels.empty}</p>
  {:else if stats}
    <div class="strip">
      <div class="metric">
        <div class="marginalia">{labels.totalRequests}</div>
        <div class="metric-num tnum">{compact.format(stats.totalRequests)}</div>
        <div class="metric-meta">{exact.format(stats.totalRequests)}</div>
      </div>
      <div class="metric">
        <div class="marginalia">{labels.errorRate}</div>
        <div class="metric-num tnum tone-{errorTone}">{percent.format(stats.errorRate)}</div>
        <div class="metric-meta">{labels.over} {PERIODS.find((p) => p.id === active)?.short}</div>
      </div>
      <div class="metric">
        <div class="marginalia">{labels.avgResponse}</div>
        <div class="metric-num tnum">{exact.format(stats.avgResponseTimeMs)} <small>ms</small></div>
        <div class="metric-meta">{labels.acrossEndpoints}</div>
      </div>
    </div>

    <div class="block">
      <div class="block-head"><span class="marginalia">{labels.endpoints}</span></div>
      <div class="ep-row ep-head">
        <span>{labels.path}</span>
        <span>{labels.share}</span>
        <span>{labels.avg}</span>
        <span>{labels.requests}</span>
      </div>
      {#each stats.endpoints as e}
        <div class="ep-row">
          <code class="path">{e.endpoint}</code>
          <div class="bar"><div class="bar-fill" style="inline-size:{(e.count / stats.totalRequests) * 100}%"></div></div>
          <span class="tnum num">{exact.format(e.avgMs)}</span>
          <span class="tnum num">{exact.format(e.count)}</span>
        </div>
      {/each}
    </div>

    {#if statusRows.length > 0}
      <div class="block">
        <div class="block-head"><span class="marginalia">{labels.statusCodes}</span></div>
        <div class="status-bar">
          {#each statusRows as s}
            <span
              class="seg seg-{codeTone(s.code)}"
              style="inline-size:{(s.count / statusTotal) * 100}%"
              title="{s.code} — {exact.format(s.count)}"
            ></span>
          {/each}
        </div>
        <ul class="legend">
          {#each statusRows as s}
            <li>
              <span class="swatch swatch-{codeTone(s.code)}" aria-hidden="true"></span>
              <span class="marginalia">{s.code}</span>
              <span class="tnum num">{exact.format(s.count)}</span>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  {/if}

  <p class="marginalia note">{labels.note}</p>
</div>

<style>
  .ledger-card { margin-top: 36px; }

  .tabs {
    display: inline-flex;
    gap: 0;
    border: 1px solid var(--outline);
    border-radius: 999px;
    background: var(--bg-2);
    padding: 4px;
  }
  .tabs button {
    border: 0;
    background: transparent;
    font-family: var(--f-mono);
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--type-2);
    padding: 6px 14px;
    border-radius: 999px;
    cursor: pointer;
  }
  .tabs button:hover { color: var(--type); }
  .tabs button.active { background: var(--primary); color: var(--type-contrast); }
  :global([data-theme='dark']) .tabs button.active { color: #1c1a12; }

  .status-msg { margin-top: 24px; color: var(--type-2); }
  .status-msg.err { color: var(--error); }

  .strip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin-top: 18px;
    background: var(--bg-2);
    border: 1px solid var(--outline);
    border-radius: 14px;
    overflow: hidden;
  }
  .metric { padding: 22px 24px; border-inline-end: 1px solid var(--outline); }
  .metric:last-child { border-inline-end: none; }
  .metric-num {
    font-family: var(--f-mono);
    font-feature-settings: 'tnum' 1;
    font-size: clamp(28px, 3.4vw, 40px);
    font-weight: 500;
    letter-spacing: -0.02em;
    margin-top: 8px;
    color: var(--type);
  }
  .metric-num small { font-size: 14px; color: var(--type-2); }
  .metric-num.tone-ok { color: var(--success); }
  .metric-num.tone-warn { color: var(--warning); }
  .metric-num.tone-err { color: var(--error); }
  .metric-meta { margin-top: 4px; color: var(--type-2); font-size: 13px; }

  .block {
    margin-top: 28px;
    background: var(--bg-2);
    border: 1px solid var(--outline);
    border-radius: 14px;
    overflow: hidden;
  }
  .block-head {
    padding: 14px 24px;
    background: var(--bg);
    border-bottom: 1px solid var(--outline);
  }
  .ep-row {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr) 72px 96px;
    gap: 16px;
    align-items: center;
    padding: 12px 24px;
    border-bottom: 1px solid var(--outline);
  }
  .ep-row:last-child { border-bottom: none; }
  .ep-head {
    background: var(--bg);
    color: var(--type-2);
    font-family: var(--f-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .ep-head > :nth-child(3),
  .ep-head > :nth-child(4),
  .num { text-align: end; }
  .path {
    font-family: var(--f-mono);
    font-size: 13px;
    color: var(--type);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bar {
    height: 6px;
    border-radius: 999px;
    background: var(--bg-muted);
    overflow: hidden;
  }
  .bar-fill { block-size: 100%; background: var(--accent); }

  .status-bar {
    display: flex;
    height: 8px;
    margin: 16px 24px 0;
    border-radius: 4px;
    overflow: hidden;
  }
  .seg { block-size: 100%; }
  .seg-ok { background: var(--success-bd); }
  .seg-redir { background: var(--info-bd); }
  .seg-warn { background: var(--warning-bd); }
  .seg-err { background: var(--error-bd); }
  .legend {
    list-style: none;
    margin: 14px 24px 18px;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  .legend li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--type);
  }
  .swatch { width: 8px; height: 8px; border-radius: 2px; display: inline-block; }
  .swatch-ok { background: var(--success-bd); }
  .swatch-redir { background: var(--info-bd); }
  .swatch-warn { background: var(--warning-bd); }
  .swatch-err { background: var(--error-bd); }

  .note { margin-top: 20px; }

  @media (max-width: 768px) {
    .strip { grid-template-columns: 1fr; }
    .metric { border-inline-end: none; border-bottom: 1px solid var(--outline); }
    .metric:last-child { border-bottom: none; }
    .ep-row { grid-template-columns: 1fr auto auto; }
    .ep-row > .bar { grid-column: 1 / -1; }
  }
</style>
