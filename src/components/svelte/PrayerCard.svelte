<script lang="ts">
  import { animate } from 'motion/mini';
  import { getPrayers, getReverseGeocode, todayFrom, type PrayerDay } from '@/lib/api/nedaa';
  import { detectCity, type TzCity } from '@/lib/tz-cities';
  import { hijriDate } from '@/lib/format';
  import type { Locale } from '@/i18n/types';

  type Props = { lang: Locale };
  const { lang }: Props = $props();

  const baseLocale = lang === 'en' ? 'en-US' : `${lang}-SA`;

  let city = $state<TzCity>(detectCity());
  let cityLabel = $state<string>(city.city);
  let day = $state<PrayerDay | null>(null);
  let provider = $state<string | null>(null);
  let now = $state<number>(Date.now());
  let error = $state<string | null>(null);
  let countdownEl: HTMLElement | undefined = $state();

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
  const MIN_LABEL = { en: 'min', ar: 'د', ms: 'min', ur: 'منٹ' };
  const PROVIDER_LABEL = { en: 'Source', ar: 'المصدر', ms: 'Sumber', ur: 'ماخذ' };

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
    if (!day || rows.length === 0) return null;
    return rows.find((r) => new Date(r.iso).getTime() > now) ?? rows[0]!;
  });

  const minutesUntil = $derived.by((): number | null => {
    if (!next) return null;
    return Math.max(0, Math.round((new Date(next.iso).getTime() - now) / 60_000));
  });

  $effect(() => {
    if (countdownEl && minutesUntil != null) {
      animate(
        countdownEl,
        { opacity: [0.4, 1], transform: ['translateY(2px)', 'translateY(0)'] },
        { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      );
    }
  });

  const skipApi =
    typeof window !== 'undefined' &&
    (/Lighthouse|HeadlessChrome/i.test(navigator.userAgent) ||
      navigator.webdriver === true ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');

  $effect(() => {
    if (skipApi) return;

    let cancelled = false;

    (async () => {
      const today = new Date();
      const [prayers, geo] = await Promise.all([
        getPrayers({
          lat: city.lat,
          lng: city.lng,
          year: today.getFullYear(),
          month: today.getMonth() + 1,
        }),
        getReverseGeocode({ lat: city.lat, lng: city.lng, locale: lang }),
      ]);
      if (cancelled) return;
      if (!prayers.ok) {
        error = prayers.error.kind;
        return;
      }
      provider = prayers.data.provider;
      day = todayFrom(prayers.data, today);
      if (geo.ok) cityLabel = geo.data.city;
    })();

    const tick = setInterval(() => {
      now = Date.now();
    }, 30_000);

    return () => {
      cancelled = true;
      clearInterval(tick);
    };
  });
</script>

<div class="almanac">
  <div class="header">
    <span class="marginalia">{cityLabel}</span>
    {#if day}
      {@const today = new Date(day.timings.fajr)}
      <span class="marginalia stack-end">
        <span>{hijriDate(lang, today)}</span>
        <span class="dim">{fmtGregorian(today)}</span>
      </span>
    {/if}
  </div>
  <hr class="rule" />

  <div class="grid">
    <div class="next-block">
      <div class="marginalia accent">{NEXT_LABEL[lang]} · {next?.label ?? '—'}</div>
      <div class="big tnum">
        {next ? fmtTime(next.iso) : '—'}
      </div>
      <div class="muted countdown" bind:this={countdownEl}>
        {#if minutesUntil != null && minutesUntil > 0}
          {IN_LABEL[lang]} {minutesUntil} {MIN_LABEL[lang]}
        {:else}
          &nbsp;
        {/if}
      </div>
    </div>

    <ul class="rows">
      {#each rows.filter((r) => r.key !== next?.key) as r}
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
  .almanac {
    background: var(--bg-2);
    border: 1px solid var(--outline);
    border-radius: 16px;
    padding: 28px 28px 22px;
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
