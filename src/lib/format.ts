import type { Locale } from '@/i18n/types';

const bcp47 = (lang: Locale): string =>
  ({ en: 'en-US', ar: 'ar-SA', ms: 'ms-MY', ur: 'ur-PK' })[lang];

export const relativeDays = (lang: Locale, isoDate: string, now: Date = new Date()): string => {
  const ms = now.getTime() - new Date(isoDate).getTime();
  const days = Math.round(ms / 86_400_000);
  const rtf = new Intl.RelativeTimeFormat(bcp47(lang), { numeric: 'auto' });
  return rtf.format(-days, 'day');
};

export const hijriDate = (lang: Locale, when: Date = new Date()): string => {
  const fmt = new Intl.DateTimeFormat(`${bcp47(lang)}-u-ca-islamic-umalqura`, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return fmt.format(when);
};

export const gregorianShort = (lang: Locale, when: Date = new Date()): string => {
  const fmt = new Intl.DateTimeFormat(bcp47(lang), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return fmt.format(when);
};
