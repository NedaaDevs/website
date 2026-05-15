// Single source of truth for OG images. Consumed by:
//   1. src/pages/og-render/[...slug].astro — dev-only HTML page per entry
//   2. scripts/gen-og.ts                   — Playwright screenshots → public/og/
//   3. src/layouts/Layout.astro            — looks up og:image URL for current route

import en from '@/i18n/en';
import ar from '@/i18n/ar';

export type OgTheme = 'light' | 'dark';

export type OgEntry = {
  // Path key (no leading slash) → output file path/og/<slug>.png
  // and lookup key for Layout.astro.
  slug: string;
  locale: 'en' | 'ar';
  theme: OgTheme;
  title?: string;
  subtitle?: string;
};

type PageDef = {
  slug: string;
  theme: OgTheme;
  en?: { title?: keyof typeof en; subtitle?: keyof typeof en };
  ar?: { title?: keyof typeof ar; subtitle?: keyof typeof ar };
};

const PAGES: PageDef[] = [
  // Home — dark, brand showcase
  {
    slug: 'index',
    theme: 'dark',
    en: { title: 'hero.title', subtitle: 'hero.title2' },
    ar: { title: 'pp.title', subtitle: 'pp.title2' },
  },
  {
    slug: 'download',
    theme: 'light',
    en: { title: 'dl.title', subtitle: 'dl.title2' },
    ar: { title: 'dl.title', subtitle: 'dl.title2' },
  },
  {
    slug: 'open',
    theme: 'dark',
    en: { title: 'os.title' },
    ar: { title: 'os.title' },
  },
  {
    slug: 'privacy-stance',
    theme: 'dark',
    en: { title: 'pp.title', subtitle: 'pp.title2' },
    ar: { title: 'pp.title', subtitle: 'pp.title2' },
  },
  {
    slug: 'privacy',
    theme: 'light',
    en: { title: 'priv.title' },
    ar: { title: 'priv.title' },
  },
];

const buildEntries = (): OgEntry[] => {
  const out: OgEntry[] = [];
  for (const p of PAGES) {
    out.push({
      slug: `en/${p.slug}`,
      locale: 'en',
      theme: p.theme,
      title: p.en?.title ? (en[p.en.title] as string) : undefined,
      subtitle: p.en?.subtitle ? (en[p.en.subtitle] as string) : undefined,
    });
    out.push({
      slug: `ar/${p.slug}`,
      locale: 'ar',
      theme: p.theme,
      title: p.ar?.title ? (ar[p.ar.title] as string) : undefined,
      subtitle: p.ar?.subtitle ? (ar[p.ar.subtitle] as string) : undefined,
    });
  }
  return out;
};

export const OG_MANIFEST: OgEntry[] = buildEntries();

// Look up the public OG path for a given site path. Falls back to /og/en/index.png.
export const ogPathFor = (sitePath: string, locale: 'en' | 'ar' | 'ms' | 'ur'): string => {
  const lang: 'en' | 'ar' = locale === 'ar' ? 'ar' : 'en';
  const cleaned = sitePath.replace(/^\/(ar|ms|ur)\//, '/').replace(/\/$/, '').replace(/^\//, '');
  const slug = cleaned === '' ? 'index' : cleaned;
  const key = `${lang}/${slug}`;
  const exists = OG_MANIFEST.some((e) => e.slug === key);
  return `/og/${exists ? key : `${lang}/index`}.png`;
};
