/**
 * Calculation methods supported by Aladhan. Includes the Aladhan method ID
 * so the prayer card can pass it directly to the API. Sourced from
 * https://aladhan.com/calculation-methods.
 */
import type { Locale } from '@/i18n/types';

export type CalcMethod = { id: number; en: string; ar: string };

export const CALC_METHODS: CalcMethod[] = [
  { id: 4, en: 'Umm al-Qura University, Makkah', ar: 'جامعة أمّ القرى، مكّة' },
  { id: 3, en: 'Muslim World League', ar: 'رابطة العالم الإسلامي' },
  { id: 2, en: 'Islamic Society of North America', ar: 'الجمعية الإسلامية لأمريكا الشمالية' },
  { id: 5, en: 'Egyptian General Authority of Survey', ar: 'الهيئة المصرية العامّة للمساحة' },
  { id: 1, en: 'University of Islamic Sciences, Karachi', ar: 'جامعة العلوم الإسلامية، كراتشي' },
  { id: 7, en: 'Institute of Geophysics, University of Tehran', ar: 'معهد الجيوفيزياء، جامعة طهران' },
  { id: 13, en: 'Diyanet İşleri Başkanlığı (Turkey)', ar: 'رئاسة الشؤون الدينية (تركيا)' },
  { id: 15, en: 'Moonsighting Committee Worldwide', ar: 'لجنة تحرّي الهلال العالمية' },
  { id: 9, en: 'Kuwait', ar: 'الكويت' },
  { id: 10, en: 'Qatar', ar: 'قطر' },
  { id: 11, en: 'Majlis Ugama Islam Singapura (MUIS)', ar: 'المجلس الديني الإسلامي السنغافوري (MUIS)' },
  { id: 19, en: 'Algeria (MARA)', ar: 'الجزائر (MARA)' },
  { id: 21, en: 'Morocco', ar: 'المغرب' },
  { id: 20, en: 'KEMENAG (Indonesia)', ar: 'KEMENAG (إندونيسيا)' },
  { id: 18, en: 'Tunisia', ar: 'تونس' },
  { id: 17, en: 'JAKIM (Malaysia)', ar: 'JAKIM (ماليزيا)' },
  { id: 12, en: 'Union Organization Islamic de France', ar: 'اتحاد المنظمات الإسلامية بفرنسا' },
  { id: 14, en: 'Spiritual Administration of Muslims of Russia', ar: 'الإدارة الدينية لمسلمي روسيا' },
  { id: 8, en: 'Gulf Region', ar: 'منطقة الخليج' },
  { id: 16, en: 'Dubai (experimental)', ar: 'دبي (تجريبي)' },
  { id: 22, en: 'Comunidade Islâmica de Lisboa', ar: 'الجالية الإسلامية بلشبونة' },
  { id: 23, en: 'Jordan (Ministry of Awqaf)', ar: 'الأردن (وزارة الأوقاف)' },
];

export const DEFAULT_METHOD_ID = 4; // Umm al-Qura

export const getCalcMethods = (lang: Locale): string[] =>
  CALC_METHODS.map((m) => (lang === 'ar' ? m.ar : m.en));
