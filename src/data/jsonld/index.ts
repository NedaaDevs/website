import prayerTimes from './prayer-times';
import prayerAlarm from './prayer-alarm';
import athkar from './athkar';
import qadaTracker from './qada-tracker';
import comparison from './comparison-privacy-ads-openness';
import muslimProAlternative from './muslim-pro-alternative';
import alarmReliability from './alarm-reliability-methodology';
import athkarBenchmark from './athkar-dataset-benchmark';
import quranReader from './quran-reader';
import islamicTypography from './islamic-typography';
import buildingAQuranApp from './building-a-quran-app';

export const jsonLdBySlug: Record<string, unknown> = {
  'prayer-times': prayerTimes,
  'prayer-alarm': prayerAlarm,
  athkar,
  'qada-tracker': qadaTracker,
  'comparison-privacy-ads-openness': comparison,
  'muslim-pro-alternative': muslimProAlternative,
  'alarm-reliability-methodology': alarmReliability,
  'athkar-dataset-benchmark': athkarBenchmark,
  'quran-reader': quranReader,
  'islamic-typography': islamicTypography,
  'building-a-quran-app': buildingAQuranApp,
};
