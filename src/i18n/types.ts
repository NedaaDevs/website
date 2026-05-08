export type Locale = 'en' | 'ar' | 'ms' | 'ur';
export const LOCALES: Locale[] = ['en', 'ar', 'ms', 'ur'];
export const RTL_LOCALES: Locale[] = ['ar', 'ur'];

export const isRTL = (l: Locale) => RTL_LOCALES.includes(l);
