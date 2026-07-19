<script lang="ts">
  import type { Locale } from '@/i18n/types';
  import {
    getStatsSnapshot,
    statsUrl,
    type StatsPeriodKey,
    type StatsSnapshot,
  } from '@/lib/api/nedaa';

  type Labels = {
    period: string;
    totalRequests: string;
    availability: string;
    responseTime: string;
    percentiles: string;
    modules: string;
    module: string;
    topReciters: string;
    reciter: string;
    plays: string;
    share: string;
    percent: string;
    requests: string;
    lifetime: string;
    reciters: string;
    recitations: string;
    audio: string;
    intrusions: string;
    asOf: string;
    note: string;
    empty: string;
    loading: string;
    error: string;
    over: string;
    period24h: string;
    period7d: string;
    period30d: string;
  };
  type Props = { lang: Locale; labels: Labels };

  const { lang, labels }: Props = $props();

  const PERIODS = $derived<{ id: StatsPeriodKey; short: string }[]>([
    { id: '24h', short: labels.period24h },
    { id: '7d', short: labels.period7d },
    { id: '30d', short: labels.period30d },
  ]);

  let active = $state<StatsPeriodKey>('24h');
  let status = $state<'loading' | 'ok' | 'error'>('loading');
  let snapshot = $state<StatsSnapshot | null>(null);

  const baseLocale = $derived(lang === 'en' ? 'en-US' : `${lang}-SA`);
  const compact = $derived(
    new Intl.NumberFormat(baseLocale, { notation: 'compact', maximumFractionDigits: 1 }),
  );
  const exact = $derived(new Intl.NumberFormat(baseLocale));
  const percent = $derived(
    new Intl.NumberFormat(baseLocale, { style: 'percent', maximumFractionDigits: 2 }),
  );
  const share = $derived(
    new Intl.NumberFormat(baseLocale, { style: 'percent', maximumFractionDigits: 1 }),
  );
  const stamp = $derived(
    new Intl.DateTimeFormat(baseLocale, { dateStyle: 'medium', timeStyle: 'short' }),
  );

  let root: HTMLElement | undefined = $state();

  // The parent <section> ships hidden; reveal it only once we know stats can
  // actually load, so an unconfigured deploy renders nothing rather than a dead
  // panel. The %% guard catches a container that never ran the config rewrite.
  const url = statsUrl();
  const configured = Boolean(url) && !url.startsWith('%%');

  // The snapshot carries every window at once — tabs switch a field, not a fetch.
  $effect(() => {
    if (!configured) return;
    root?.closest('section.ledger')?.removeAttribute('hidden');

    void (async () => {
      const res = await getStatsSnapshot({ timeoutMs: 6000 });
      snapshot = res.ok ? res.data : null;
      status = res.ok ? 'ok' : 'error';
    })();
  });

  const stats = $derived(snapshot?.periods?.[active] ?? null);

  const availabilityTone = $derived<'ok' | 'warn' | 'err'>(
    !stats
      ? 'ok'
      : stats.availabilityPct >= 99.9
        ? 'ok'
        : stats.availabilityPct >= 99
          ? 'warn'
          : 'err',
  );

  type ModuleRow = { name: string; count: number };
  const moduleRows = $derived<ModuleRow[]>(
    Object.entries(snapshot?.requestsByModule ?? {})
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
  );
  const moduleTotal = $derived(moduleRows.reduce((s, r) => s + r.count, 0) || 1);

  type ReciterRow = { name: string; plays: number };
  // Grouped by reciter, not recitation: one reciter can have several recitations
  // (e.g. ayah- and surah-granularity of the same murattal) which would otherwise
  // render as indistinguishable duplicate rows. Ranked on lifetime plays, which
  // is what the API ranks on — the per-window counts use calendar buckets that
  // don't line up with this card's rolling 24h/7d/30d tabs.
  const reciterRows = $derived.by<ReciterRow[]>(() => {
    const byName = new Map<string, number>();
    for (const r of snapshot?.topRecitations ?? []) {
      const name = (lang === 'ar' ? r.nameAr : r.nameEn) || r.recitationId;
      byName.set(name, (byName.get(name) ?? 0) + r.plays.all);
    }
    return [...byName]
      .map(([name, plays]) => ({ name, plays }))
      .sort((a, b) => b.plays - a.plays);
  });
  const reciterTotal = $derived(reciterRows.reduce((s, r) => s + r.plays, 0) || 1);

  const generatedAt = $derived.by(() => {
    const raw = snapshot?.generatedAt;
    if (!raw) return null;
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : stamp.format(d);
  });
</script>

<div class="ledger-card" bind:this={root}>
  <div class="tabs" role="tablist" aria-label={labels.period}>
    {#each PERIODS as p (p.id)}
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

  {#if status === 'loading'}
    <p class="status-msg">{labels.loading}</p>
  {:else if status === 'error' || !stats}
    <p class="status-msg err">{labels.error}</p>
  {:else if stats.requests === 0}
    <p class="status-msg">{labels.empty}</p>
  {:else}
    <div class="strip">
      <div class="metric">
        <div class="marginalia">{labels.totalRequests}</div>
        <div class="metric-num tnum">{compact.format(stats.requests)}</div>
        <div class="metric-meta">{exact.format(stats.requests)}</div>
      </div>
      <div class="metric">
        <div class="marginalia">{labels.availability}</div>
        <div class="metric-num tnum tone-{availabilityTone}">
          {percent.format(stats.availabilityPct / 100)}
        </div>
        <div class="metric-meta">{labels.over} {PERIODS.find((p) => p.id === active)?.short}</div>
      </div>
      <div class="metric">
        <div class="marginalia">{labels.responseTime}</div>
        <div class="metric-num tnum">
          {exact.format(stats.p50Ms)} / {exact.format(stats.p95Ms)} <small>ms</small>
        </div>
        <div class="metric-meta">{labels.percentiles}</div>
      </div>
    </div>

    {#if moduleRows.length > 0}
      <div class="block">
        <div class="block-head"><span class="marginalia">{labels.modules}</span></div>
        <div class="ep-row ep-head">
          <span>{labels.module}</span>
          <span>{labels.share}</span>
          <span>{labels.percent}</span>
          <span>{labels.requests}</span>
        </div>
        {#each moduleRows as m (m.name)}
          <div class="ep-row">
            <span class="mod">{m.name}</span>
            <div class="bar">
              <div class="bar-fill" style="inline-size:{(m.count / moduleTotal) * 100}%"></div>
            </div>
            <span class="tnum num">{share.format(m.count / moduleTotal)}</span>
            <span class="tnum num">{exact.format(m.count)}</span>
          </div>
        {/each}
      </div>
    {/if}

    {#if reciterRows.length > 0}
      <div class="block">
        <div class="block-head"><span class="marginalia">{labels.topReciters}</span></div>
        <div class="ep-row ep-head">
          <span>{labels.reciter}</span>
          <span>{labels.share}</span>
          <span>{labels.percent}</span>
          <span>{labels.plays}</span>
        </div>
        {#each reciterRows as r (r.name)}
          <div class="ep-row">
            <span class="mod">{r.name}</span>
            <div class="bar">
              <div class="bar-fill" style="inline-size:{(r.plays / reciterTotal) * 100}%"></div>
            </div>
            <span class="tnum num">{share.format(r.plays / reciterTotal)}</span>
            <span class="tnum num">{exact.format(r.plays)}</span>
          </div>
        {/each}
      </div>
    {/if}

    {#if snapshot}
      <ul class="facts">
        <li>
          <span class="marginalia">{labels.lifetime}</span>
          <span class="tnum fact-num">{exact.format(snapshot.lifetimeRequests)}</span>
        </li>
        <li>
          <span class="marginalia">{labels.reciters}</span>
          <span class="tnum fact-num">{exact.format(snapshot.catalog.reciters)}</span>
        </li>
        <li>
          <span class="marginalia">{labels.recitations}</span>
          <span class="tnum fact-num">{exact.format(snapshot.catalog.recitations)}</span>
        </li>
        <li>
          <span class="marginalia">{labels.audio}</span>
          <span class="tnum fact-num">
            {exact.format(snapshot.catalog.audioGB)} <small>GB</small>
          </span>
        </li>
        <li>
          <span class="marginalia">{labels.intrusions}</span>
          <span class="tnum fact-num">{exact.format(snapshot.intrusionAttempts)}</span>
        </li>
      </ul>
    {/if}

    {#if generatedAt}
      <p class="marginalia as-of">{labels.asOf} {generatedAt}</p>
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
  .mod {
    font-family: var(--f-mono);
    font-size: 13px;
    color: var(--type);
    text-transform: capitalize;
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

  .facts {
    list-style: none;
    margin: 28px 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    background: var(--bg-2);
    border: 1px solid var(--outline);
    border-radius: 14px;
    overflow: hidden;
  }
  .facts li {
    padding: 16px 20px;
    border-inline-end: 1px solid var(--outline);
  }
  .facts li:last-child { border-inline-end: none; }
  .fact-num {
    display: block;
    margin-top: 6px;
    font-family: var(--f-mono);
    font-feature-settings: 'tnum' 1;
    font-size: 20px;
    color: var(--type);
  }
  .fact-num small { font-size: 12px; color: var(--type-2); }

  .as-of { margin-top: 16px; }
  .note { margin-top: 20px; }

  @media (max-width: 768px) {
    .strip { grid-template-columns: 1fr; }
    .metric { border-inline-end: none; border-bottom: 1px solid var(--outline); }
    .metric:last-child { border-bottom: none; }
    .ep-row { grid-template-columns: 1fr auto auto; }
    .ep-row > .bar { grid-column: 1 / -1; }
    .facts li { border-inline-end: none; border-bottom: 1px solid var(--outline); }
    .facts li:last-child { border-bottom: none; }
  }
</style>
