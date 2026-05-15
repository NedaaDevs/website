import { ui, defaultLang, showDefaultLang, type UIKey } from '@/i18n/ui';
import { isRTL, type Locale } from '@/i18n/types';

export { isRTL, type Locale } from '@/i18n/types';
export { defaultLang, languages } from '@/i18n/ui';

export const getLangFromUrl = (url: URL): keyof typeof ui => {
  const [, lang] = url.pathname.split('/');
  return lang in ui ? (lang as keyof typeof ui) : defaultLang;
};

export const useTranslations =
  (lang: keyof typeof ui) =>
  (key: UIKey): string =>
    ui[lang][key] ?? ui[defaultLang][key];

export const useTranslatedPath =
  (lang: Locale) =>
  (path: string, l: Locale = lang): string => {
    const clean = path.replace(/^\/+/, '');
    return !showDefaultLang && l === defaultLang ? `/${clean}` : `/${l}/${clean}`;
  };

export const dirFor = (lang: Locale): 'rtl' | 'ltr' => (isRTL(lang) ? 'rtl' : 'ltr');
