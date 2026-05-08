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

export const ui = { en, ar } as const;

export type UI = typeof ui;
export type UIKey = keyof typeof en;
