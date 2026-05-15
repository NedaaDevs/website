import en from '@/i18n/en';
import ar from '@/i18n/ar';

export const defaultLang = 'en' as const;
export const showDefaultLang = false;

export const languages = {
  en: 'English',
  ar: 'العربية',
  ms: 'Bahasa Melayu',
  ur: 'اردو',
} as const;

export type UIKey = keyof typeof en;

/**
 * Locale dicts beyond `en` may be partial — missing keys fall back to
 * English in `useTranslations`.
 */
export const ui: Record<'en' | 'ar', Partial<Record<UIKey, string>>> & {
  en: Record<UIKey, string>;
} = {
  en,
  ar,
};

export type UI = typeof ui;
