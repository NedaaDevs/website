<script lang="ts">
  import { animate } from 'motion/mini';
  import { indexOfToday, type PrayerDay } from '@/lib/api/nedaa';
  import { getAladhanCalendar, roundCoord } from '@/lib/api/aladhan';
  import { MAKKAH, sameLocation, type CityRef } from '@/lib/cities';
  import { hijriDate } from '@/lib/format';
  import type { Locale } from '@/i18n/types';
  import prebake from '@/data/prayers-default.json';
  import { CALC_METHODS, DEFAULT_METHOD_ID, DEFAULT_SCHOOL } from '@/data/calc-methods';

  type Props = { lang: Locale };
  const { lang }: Props = $props();

  const baseLocale = lang === 'en' ? 'en-US' : `${lang}-SA`;

  const LOC_KEY = 'nedaa:prayer-card:location';
  const SET_KEY = 'nedaa:prayer-card:settings';

  type Settings = { methodId: number; school: 0 | 1 };
  const DEFAULT_SETTINGS: Settings = { methodId: DEFAULT_METHOD_ID, school: DEFAULT_SCHOOL };

  const loadSavedLocation = (): CityRef | null => {
    if (typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem(LOC_KEY);
      return raw ? (JSON.parse(raw) as CityRef) : null;
    } catch {
      return null;
    }
  };

  const loadSavedSettings = (): Settings => {
    if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
    try {
      const raw = localStorage.getItem(SET_KEY);
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  };

  let city = $state<CityRef>(loadSavedLocation() ?? MAKKAH);
  let settings = $state<Settings>(loadSavedSettings());
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

  const STATUS_LIVE = { en: 'live', ar: 'مباشر', ms: 'langsung', ur: 'لائیو' };
  const STATUS_OFFLINE = { en: 'offline', ar: 'غير متّصل', ms: 'luar talian', ur: 'آف لائن' };
  const USE_LOCATION = {
    en: '📍 Use my location',
    ar: '📍 استخدم موقعي',
    ms: '📍 Gunakan lokasi saya',
    ur: '📍 میری لوکیشن استعمال کریں',
  };
  const LOCATING = { en: 'Locating…', ar: 'جارٍ التحديد…', ms: 'Mencari…', ur: 'تلاش جاری ہے…' };
  const MY_LOCATION = { en: 'My location', ar: 'موقعي', ms: 'Lokasi saya', ur: 'میری لوکیشن' };
  const CITY_TRANSLATIONS: Record<string, Record<Locale, string>> = {
    Makkah: { en: 'Makkah', ar: 'مكة', ms: 'Makkah', ur: 'مکہ' },
    'My location': MY_LOCATION,
  };
  const localizeCity = (label: string): string =>
    CITY_TRANSLATIONS[label]?.[lang] ?? label;
  const SETTINGS_LABEL = { en: 'Settings', ar: 'الإعدادات', ms: 'Tetapan', ur: 'ترتیبات' };
  const METHOD_LABEL = { en: 'Method', ar: 'طريقة الحساب', ms: 'Kaedah', ur: 'طریقہ' };
  const MADHHAB_LABEL = { en: 'Madhhab', ar: 'المذهب', ms: 'Mazhab', ur: 'مذہب' };
  const STANDARD_LABEL = { en: 'Standard', ar: 'الجمهور', ms: 'Standard', ur: 'معیاری' };
  const HANAFI_LABEL = { en: 'Hanafi', ar: 'الحنفي', ms: 'Hanafi', ur: 'حنفی' };
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

  const fetchFor = async (target: CityRef): Promise<void> => {
    if (isHeadless) return;
    loading = true;
    error = null;
    const today = new Date();
    const res = await getAladhanCalendar({
      lat: target.lat,
      lng: target.lng,
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      method: settings.methodId,
      school: settings.school,
    });
    if (!res.ok) {
      error = res.error.kind;
      loading = false;
      return;
    }
    const month = today.toISOString().slice(0, 7);
    const monthDays = res.data.filter((d) => d.timings.fajr.startsWith(month));
    const upcoming = fromToday(monthDays, today);
    if (upcoming.length > 0) {
      provider = 'aladhan';
      days = upcoming;
      cursor = 0;
      cityLabel = target.city;
    }
    loading = false;
  };

  let locating = $state(false);

  const useMyLocation = async () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;
    locating = true;
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10_000,
          maximumAge: 600_000,
        }),
      );
      const next: CityRef = {
        city: 'My location',
        lat: roundCoord(pos.coords.latitude),
        lng: roundCoord(pos.coords.longitude),
      };
      city = next;
      try {
        localStorage.setItem(LOC_KEY, JSON.stringify(next));
      } catch {
        /* storage may be disabled */
      }
      await fetchFor(next);
    } catch {
      /* permission denied or timeout — keep current */
    } finally {
      locating = false;
    }
  };

  const onSettingsChange = async () => {
    try {
      localStorage.setItem(SET_KEY, JSON.stringify(settings));
    } catch {
      /* storage may be disabled */
    }
    await fetchFor(city);
  };

  $effect(() => {
    let cancelled = false;

    // Re-fetch if non-default location OR non-default settings on mount.
    const needsFetch =
      !sameLocation(city, MAKKAH) ||
      settings.methodId !== DEFAULT_SETTINGS.methodId ||
      settings.school !== DEFAULT_SETTINGS.school;

    if (needsFetch) {
      (async () => {
        await fetchFor(city);
        if (cancelled) return;
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
      {localizeCity(cityLabel)}
      <button
        type="button"
        class="locate-btn"
        onclick={useMyLocation}
        disabled={locating}
        title={USE_LOCATION[lang]}
      >
        {locating ? LOCATING[lang] : USE_LOCATION[lang]}
      </button>
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
  <details class="settings">
    <summary class="marginalia">{SETTINGS_LABEL[lang]}</summary>
    <div class="settings-grid">
      <label class="setting">
        <span class="setting-label marginalia">{METHOD_LABEL[lang]}</span>
        <select
          value={String(settings.methodId)}
          onchange={(e) => {
            settings = { ...settings, methodId: Number((e.currentTarget as HTMLSelectElement).value) };
            void onSettingsChange();
          }}
        >
          {#each CALC_METHODS as m}
            <option value={String(m.id)}>{lang === 'ar' ? m.ar : m.en}</option>
          {/each}
        </select>
      </label>
      <label class="setting">
        <span class="setting-label marginalia">{MADHHAB_LABEL[lang]}</span>
        <select
          value={String(settings.school)}
          onchange={(e) => {
            const v = Number((e.currentTarget as HTMLSelectElement).value);
            settings = { ...settings, school: v === 1 ? 1 : 0 };
            void onSettingsChange();
          }}
        >
          <option value="0">{STANDARD_LABEL[lang]}</option>
          <option value="1">{HANAFI_LABEL[lang]}</option>
        </select>
      </label>
    </div>
  </details>
  <hr class="rule" />
  <div class="footer">
    <span class="marginalia">{PROVIDER_LABEL[lang]} · {provider ?? '—'}</span>
    <span class="marginalia status" class:offline={!!error}>
      <span aria-hidden="true" class="dot"></span>
      {error ? STATUS_OFFLINE[lang] : STATUS_LIVE[lang]}
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
  .locate-btn {
    background: transparent;
    border: 0;
    padding: 0;
    margin-inline-start: 4px;
    font: inherit;
    color: var(--type-2);
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .locate-btn:hover:not(:disabled) {
    color: var(--accent);
  }
  .locate-btn:disabled {
    cursor: default;
    opacity: 0.6;
  }
  .settings {
    margin: 0;
  }
  .settings > summary {
    cursor: pointer;
    list-style: none;
    padding: 4px 0;
    user-select: none;
  }
  .settings > summary::-webkit-details-marker {
    display: none;
  }
  .settings > summary::before {
    content: '▸';
    display: inline-block;
    margin-inline-end: 6px;
    transition: transform 0.15s ease;
  }
  .settings[open] > summary::before {
    transform: rotate(90deg);
  }
  [dir='rtl'] .settings > summary::before {
    content: '◂';
  }
  [dir='rtl'] .settings[open] > summary::before {
    transform: rotate(-90deg);
  }
  .settings-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 8px;
  }
  .setting {
    display: grid;
    grid-template-columns: 80px 1fr;
    align-items: center;
    gap: 12px;
  }
  .setting select {
    font: inherit;
    font-size: 13px;
    padding: 6px 8px;
    border: 1px solid var(--outline);
    border-radius: 6px;
    background: var(--bg-2);
    color: var(--type);
    width: 100%;
  }
  .setting select:focus {
    outline: 2px solid var(--accent);
    outline-offset: -1px;
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
