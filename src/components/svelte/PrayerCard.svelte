<script lang="ts">
  import { animate } from 'motion/mini';
  import { flattenDays, getPrayers, indexOfToday, type PrayerDay } from '@/lib/api/nedaa';
  import { detectCity, sameCity, MAKKAH, type TzCity } from '@/lib/tz-cities';
  import { hijriDate } from '@/lib/format';
  import type { Locale } from '@/i18n/types';
  import prebake from '@/data/prayers-default.json';

  type Props = { lang: Locale };
  const { lang }: Props = $props();

  const baseLocale = lang === 'en' ? 'en-US' : `${lang}-SA`;

  let city = $state<TzCity>(detectCity());
  let cityLabel = $state<string>(city.city);
  /** Only today onwards — past days are not navigable. */
  const fromToday = (all: PrayerDay[], when: Date = new Date()) =>
    all.slice(indexOfToday(all, when));
  let days = $state<PrayerDay[]>(fromToday(prebake.days));
  let provider = $state<string | null>(prebake.provider);
  let cursor = $state<number>(0);
  let now = $state<number>(Date.now());
  let error = $state<string | null>(null);
  let loading = $state<boolean>(false);
  let countdownEl: HTMLElement | undefined = $state();

  const day = $derived<PrayerDay | null>(days[cursor] ?? null);
  const isToday = $derived(cursor === 0);
  const canPrev = $derived(cursor > 0);
  const canNext = $derived(cursor < days.length - 1);

  const step = (delta: number) => {
    const target = Math.min(days.length - 1, Math.max(0, cursor + delta));
    if (target !== cursor) cursor = target;
  };
  const goToday = () => {
    cursor = 0;
  };

  type Row = { key: string; label: string; iso: string };

  const ORDER = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
  const LABEL: Record<(typeof ORDER)[number], Record<Locale, string>> = {
    fajr: { en: 'Fajr', ar: 'الفجر', ms: 'Subuh', ur: 'فجر' },
    sunrise: { en: 'Shurūq', ar: 'الشروق', ms: 'Syuruk', ur: 'طلوع' },
    dhuhr: { en: 'Dhuhr', ar: 'الظهر', ms: 'Zuhur', ur: 'ظہر' },
    asr: { en: 'ʿAṣr', ar: 'العصر', ms: 'Asar', ur: 'عصر' },
    maghrib: { en: 'Maghrib', ar: 'المغرب', ms: 'Maghrib', ur: 'مغرب' },
    isha: { en: 'ʿIshāʾ', ar: 'العشاء', ms: 'Isyak', ur: 'عشاء' },
  };

  const NEXT_LABEL = { en: 'Next prayer', ar: 'الصلاة التالية', ms: 'Solat seterusnya', ur: 'اگلی نماز' };
  const IN_LABEL = { en: 'in', ar: 'بعد', ms: 'dalam', ur: 'میں' };
  const PREV_LABEL = { en: 'Previous day', ar: 'اليوم السابق', ms: 'Sebelumnya', ur: 'پچھلا دن' };
  const NEXT_DAY_LABEL = { en: 'Next day', ar: 'اليوم التالي', ms: 'Hari seterusnya', ur: 'اگلا دن' };
  const BACK_TO_TODAY = { en: 'Back to today', ar: 'العودة إلى اليوم', ms: 'Kembali ke hari ini', ur: 'آج پر واپس' };

  const relTime = new Intl.RelativeTimeFormat(baseLocale, { numeric: 'auto' });
  const dayLabel = (i: number) =>
    i === 0 ? relTime.format(0, 'day') : relTime.format(i, 'day');
  const PROVIDER_LABEL = { en: 'Source', ar: 'المصدر', ms: 'Sumber', ur: 'ماخذ' };
  const FIRST_LABEL = { en: 'First prayer', ar: 'أول صلاة', ms: 'Solat pertama', ur: 'پہلی نماز' };

  const pad2 = new Intl.NumberFormat(baseLocale, {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const num = new Intl.NumberFormat(baseLocale, { useGrouping: false });

  const fmtTime = (iso: string) =>
    new Intl.DateTimeFormat(baseLocale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: lang === 'en',
    }).format(new Date(iso));

  const fmtGregorian = (when: Date) =>
    new Intl.DateTimeFormat(baseLocale, { dateStyle: 'long' }).format(when);

  const rows = $derived<Row[]>(
    day ? ORDER.map((k) => ({ key: k, label: LABEL[k][lang], iso: day!.timings[k] })) : [],
  );

  const next = $derived.by((): Row | null => {
    if (!day || rows.length === 0 || !isToday) return null;
    return rows.find((r) => new Date(r.iso).getTime() > now) ?? rows[0]!;
  });

  const remainingSeconds = $derived.by((): number => {
    if (!next) return 0;
    return Math.max(0, Math.floor((new Date(next.iso).getTime() - now) / 1000));
  });

  const countdown = $derived.by((): string => {
    if (remainingSeconds === 0) return '';
    const h = Math.floor(remainingSeconds / 3600);
    const m = Math.floor((remainingSeconds % 3600) / 60);
    const s = remainingSeconds % 60;
    return h > 0
      ? `${num.format(h)}:${pad2.format(m)}:${pad2.format(s)}`
      : `${pad2.format(m)}:${pad2.format(s)}`;
  });

  $effect(() => {
    countdown; // re-run on every tick
    if (countdownEl) {
      animate(countdownEl, { opacity: [0.78, 1] }, { duration: 0.18, ease: 'easeOut' });
    }
  });

  const isHeadless =
    typeof navigator !== 'undefined' &&
    (navigator.webdriver === true || /HeadlessChrome|Lighthouse/i.test(navigator.userAgent));

  $effect(() => {
    let cancelled = false;

    if (!isHeadless && !sameCity(city, MAKKAH)) {
      loading = true;
      (async () => {
        const today = new Date();
        const prayers = await getPrayers({
          lat: city.lat,
          lng: city.lng,
          year: today.getFullYear(),
          month: today.getMonth() + 1,
        });
        if (cancelled) return;
        if (!prayers.ok) {
          error = prayers.error.kind;
          loading = false;
          return;
        }
        const month = today.toISOString().slice(0, 7);
        const monthDays = flattenDays(prayers.data).filter((d) =>
          d.timings.fajr.startsWith(month),
        );
        const upcoming = fromToday(monthDays, today);
        if (upcoming.length > 0) {
          provider = prayers.data.provider;
          days = upcoming;
          cursor = 0;
          cityLabel = city.city;
        }
        loading = false;
      })();
    }

    const tick = setInterval(() => {
      now = Date.now();
    }, 1_000);

    return () => {
      cancelled = true;
      clearInterval(tick);
    };
  });
</script>

<div class="almanac">
  <div class="header">
    <span class="marginalia city">
      <span class:pulse={loading} class="city-dot" aria-hidden="true"></span>
      {cityLabel}
    </span>
    {#if day}
      {@const dayDate = new Date(day.timings.fajr)}
      <span class="marginalia stack-end">
        <span>{hijriDate(lang, dayDate)}</span>
        <span class="dim">{fmtGregorian(dayDate)}</span>
      </span>
    {/if}
  </div>
  <hr class="rule" />

  <div class="day-nav">
    <button
      type="button"
      class="nav-btn"
      onclick={() => step(-1)}
      disabled={!canPrev}
      aria-label={PREV_LABEL[lang]}
    >‹</button>
    {#if isToday}
      <span class="today-pill">{dayLabel(0)}</span>
    {:else}
      <button
        type="button"
        class="today-btn"
        onclick={goToday}
        aria-label={BACK_TO_TODAY[lang]}
      >{dayLabel(cursor)}</button>
    {/if}
    <button
      type="button"
      class="nav-btn"
      onclick={() => step(1)}
      disabled={!canNext}
      aria-label={NEXT_DAY_LABEL[lang]}
    >›</button>
  </div>

  <div class="grid">
    <div class="next-block">
      {#if isToday && next}
        <div class="marginalia accent">{NEXT_LABEL[lang]} · {next.label}</div>
        <div class="big tnum">{fmtTime(next.iso)}</div>
        <div class="muted countdown" bind:this={countdownEl}>
          {#if countdown}
            {IN_LABEL[lang]} <span class="tnum">{countdown}</span>
          {:else}
            &nbsp;
          {/if}
        </div>
      {:else if rows.length > 0}
        {@const first = rows[0]!}
        <div class="marginalia accent">{FIRST_LABEL[lang]} · {first.label}</div>
        <div class="big tnum">{fmtTime(first.iso)}</div>
        <div class="muted">&nbsp;</div>
      {/if}
    </div>

    <ul class="rows">
      {#each rows.filter((r) => !isToday || r.key !== next?.key) as r}
        <li class="row">
          <span class="label">{r.label}</span>
          <span class="time tnum">{fmtTime(r.iso)}</span>
        </li>
      {/each}
      {#if rows.length === 0}
        {#each ORDER as k}
          <li class="row skeleton" aria-hidden="true">
            <span class="bar bar-label"></span>
            <span class="bar bar-time"></span>
          </li>
        {/each}
      {/if}
    </ul>
  </div>

  <hr class="rule" />
  <div class="footer">
    <span class="marginalia">{PROVIDER_LABEL[lang]} · {provider ?? '—'}</span>
    <span class="marginalia status" class:offline={!!error}>
      <span aria-hidden="true" class="dot"></span>
      {error ? 'offline' : 'live'}
    </span>
  </div>
</div>

<style>
  .city {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .city-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--success-bd);
    flex-shrink: 0;
  }
  .city-dot.pulse {
    background: var(--accent);
    animation: pulse 1.2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    .city-dot.pulse { animation: none; opacity: 0.7; }
  }

  .day-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 12px 0 6px;
  }
  .nav-btn,
  .today-btn {
    border: 1px solid var(--outline);
    background: var(--bg-2);
    color: var(--type-2);
    border-radius: 999px;
    cursor: pointer;
    font-family: var(--f-sans);
    line-height: 1;
  }
  .nav-btn {
    width: 28px;
    height: 28px;
    font-size: 16px;
    display: grid;
    place-items: center;
  }
  .nav-btn:hover:not(:disabled),
  .today-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
  }
  .nav-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  .today-btn {
    padding: 5px 12px;
    font-size: 12px;
  }
  .today-pill {
    font-family: var(--f-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--accent);
    padding: 5px 12px;
    border: 1px solid var(--outline);
    border-radius: 999px;
  }

  .almanac {
    background: var(--bg-2);
    border: 1px solid var(--outline);
    border-radius: 16px;
    padding: 28px 28px 22px;
    min-height: 360px;
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.5) inset,
      0 18px 50px var(--shadow);
    color: var(--type);
  }
  .header,
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header {
    margin-bottom: 12px;
  }
  .footer {
    margin-top: 12px;
  }
  .grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 32px;
    padding: 18px 0;
  }
  .next-block .accent {
    color: var(--accent);
  }
  .big {
    font-size: clamp(56px, 8vw, 96px);
    font-weight: 300;
    letter-spacing: -0.04em;
    line-height: 1;
    color: var(--type);
    margin-top: 6px;
    font-variant-numeric: tabular-nums;
  }
  .muted {
    color: var(--type-2);
    font-size: 14px;
    margin-top: 8px;
  }
  .rows {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 6px 0;
    border-top: 1px solid var(--outline);
  }
  .row .label {
    font-size: 13px;
    color: var(--type-2);
  }
  .row .time {
    font-size: 14px;
    color: var(--type);
    font-family: var(--f-mono);
    font-feature-settings: 'tnum' 1;
  }
  .skeleton .bar {
    display: inline-block;
    height: 10px;
    border-radius: 4px;
    background: var(--bg-muted);
  }
  .bar-label {
    width: 60px;
  }
  .bar-time {
    width: 36px;
  }
  .stack-end {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }
  .stack-end .dim {
    color: var(--type-2);
  }
  .countdown {
    will-change: opacity, transform;
  }
  .status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .status .dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--success-bd);
  }
  .status.offline .dot {
    background: var(--error-bd);
  }
  @media (max-width: 640px) {
    .grid {
      grid-template-columns: 1fr;
      gap: 18px;
    }
  }
</style>
