/**
 * Calculation methods supported by the Nedaa app via the aladhan provider.
 * Sourced from https://aladhan.com/calculation-methods. Plus a custom option
 * for masjids that follow their own conventions.
 */
import type { Locale } from '@/i18n/types';

const en = [
  'Umm al-Qura University, Makkah',
  'Muslim World League',
  'Islamic Society of North America',
  'Egyptian General Authority of Survey',
  'University of Islamic Sciences, Karachi',
  'Institute of Geophysics, University of Tehran',
  'Diyanet İşleri Başkanlığı (Turkey)',
  'Moonsighting Committee Worldwide',
  'Kuwait',
  'Qatar',
  'Majlis Ugama Islam Singapura (MUIS)',
  'Algeria (MARA)',
  'Morocco',
  'KEMENAG (Indonesia)',
  'Tunisia',
  'JAKIM (Malaysia)',
  'Union Organization Islamic de France',
  'Spiritual Administration of Muslims of Russia',
  'Gulf Region',
  'Dubai (experimental)',
  'Comunidade Islâmica de Lisboa',
  'Jordan (Ministry of Awqaf)',
  'Shia Ithna-Ashari, Leva Institute',
  'Custom (your own imam)',
];

const ar = [
  'جامعة أمّ القرى، مكّة',
  'رابطة العالم الإسلامي',
  'الجمعية الإسلامية لأمريكا الشمالية',
  'الهيئة المصرية العامّة للمساحة',
  'جامعة العلوم الإسلامية، كراتشي',
  'معهد الجيوفيزياء، جامعة طهران',
  'رئاسة الشؤون الدينية (تركيا)',
  'لجنة تحرّي الهلال العالمية',
  'الكويت',
  'قطر',
  'المجلس الديني الإسلامي السنغافوري (MUIS)',
  'الجزائر (MARA)',
  'المغرب',
  'KEMENAG (إندونيسيا)',
  'تونس',
  'JAKIM (ماليزيا)',
  'اتحاد المنظمات الإسلامية بفرنسا',
  'الإدارة الدينية لمسلمي روسيا',
  'منطقة الخليج',
  'دبي (تجريبي)',
  'الجالية الإسلامية بلشبونة',
  'الأردن (وزارة الأوقاف)',
  'الشيعة الاثنا عشرية، معهد ليفا',
  'مخصّص (إعدادات إمامك)',
];

export const getCalcMethods = (lang: Locale): string[] => (lang === 'ar' ? ar : en);
