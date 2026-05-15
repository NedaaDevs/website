import prayerTimes from './prayer-times';
import prayerAlarm from './prayer-alarm';
import athkar from './athkar';
import qadaTracker from './qada-tracker';

export const jsonLdBySlug: Record<string, unknown> = {
  'prayer-times': prayerTimes,
  'prayer-alarm': prayerAlarm,
  athkar,
  'qada-tracker': qadaTracker,
};
