import prayerTimes from './prayer-times';
import prayerAlarm from './prayer-alarm';
import athkar from './athkar';
import qadaTracker from './qada-tracker';
import comparison from './comparison-privacy-ads-openness';
import alarmReliability from './alarm-reliability-methodology';
import athkarBenchmark from './athkar-dataset-benchmark';

export const jsonLdBySlug: Record<string, unknown> = {
  'prayer-times': prayerTimes,
  'prayer-alarm': prayerAlarm,
  athkar,
  'qada-tracker': qadaTracker,
  'comparison-privacy-ads-openness': comparison,
  'alarm-reliability-methodology': alarmReliability,
  'athkar-dataset-benchmark': athkarBenchmark,
};
