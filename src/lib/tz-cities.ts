/**
 * TZ → approximate city + lat/lng table. Used by the live prayer-card island
 * to call the Nedaa prayers API without prompting for geolocation.
 *
 * Coverage prioritises Muslim-majority and high-traffic timezones; everything
 * else falls back to the default (Riyadh).
 */
export type TzCity = { city: string; lat: number; lng: number };

const TABLE: Record<string, TzCity> = {
  // Gulf / Levant / North Africa
  'Asia/Riyadh': { city: 'Riyadh', lat: 24.7136, lng: 46.6753 },
  'Asia/Dubai': { city: 'Dubai', lat: 25.2048, lng: 55.2708 },
  'Asia/Qatar': { city: 'Doha', lat: 25.2854, lng: 51.531 },
  'Asia/Kuwait': { city: 'Kuwait City', lat: 29.3759, lng: 47.9774 },
  'Asia/Bahrain': { city: 'Manama', lat: 26.2285, lng: 50.586 },
  'Asia/Muscat': { city: 'Muscat', lat: 23.588, lng: 58.3829 },
  'Asia/Baghdad': { city: 'Baghdad', lat: 33.3152, lng: 44.3661 },
  'Asia/Damascus': { city: 'Damascus', lat: 33.5138, lng: 36.2765 },
  'Asia/Beirut': { city: 'Beirut', lat: 33.8938, lng: 35.5018 },
  'Asia/Amman': { city: 'Amman', lat: 31.9454, lng: 35.9284 },
  'Asia/Jerusalem': { city: 'Jerusalem', lat: 31.7683, lng: 35.2137 },
  'Asia/Hebron': { city: 'Hebron', lat: 31.5326, lng: 35.0998 },
  'Asia/Gaza': { city: 'Gaza', lat: 31.5017, lng: 34.4668 },
  'Asia/Aden': { city: "Sana'a", lat: 15.3694, lng: 44.191 },
  'Africa/Cairo': { city: 'Cairo', lat: 30.0444, lng: 31.2357 },
  'Africa/Khartoum': { city: 'Khartoum', lat: 15.5007, lng: 32.5599 },
  'Africa/Algiers': { city: 'Algiers', lat: 36.7372, lng: 3.0863 },
  'Africa/Tunis': { city: 'Tunis', lat: 36.8065, lng: 10.1815 },
  'Africa/Tripoli': { city: 'Tripoli', lat: 32.8872, lng: 13.1913 },
  'Africa/Casablanca': { city: 'Casablanca', lat: 33.5731, lng: -7.5898 },
  'Africa/Lagos': { city: 'Lagos', lat: 6.5244, lng: 3.3792 },
  // South + Southeast Asia
  'Asia/Karachi': { city: 'Karachi', lat: 24.8607, lng: 67.0011 },
  'Asia/Tehran': { city: 'Tehran', lat: 35.6892, lng: 51.389 },
  'Asia/Kabul': { city: 'Kabul', lat: 34.5553, lng: 69.2075 },
  'Asia/Kolkata': { city: 'Delhi', lat: 28.6139, lng: 77.209 },
  'Asia/Dhaka': { city: 'Dhaka', lat: 23.8103, lng: 90.4125 },
  'Asia/Kathmandu': { city: 'Kathmandu', lat: 27.7172, lng: 85.324 },
  'Asia/Kuala_Lumpur': { city: 'Kuala Lumpur', lat: 3.139, lng: 101.6869 },
  'Asia/Singapore': { city: 'Singapore', lat: 1.3521, lng: 103.8198 },
  'Asia/Jakarta': { city: 'Jakarta', lat: -6.2088, lng: 106.8456 },
  'Asia/Manila': { city: 'Manila', lat: 14.5995, lng: 120.9842 },
  'Asia/Bangkok': { city: 'Bangkok', lat: 13.7563, lng: 100.5018 },
  // Turkey + Central Asia
  'Europe/Istanbul': { city: 'Istanbul', lat: 41.0082, lng: 28.9784 },
  'Asia/Tashkent': { city: 'Tashkent', lat: 41.2995, lng: 69.2401 },
  'Asia/Almaty': { city: 'Almaty', lat: 43.222, lng: 76.8512 },
  // Europe
  'Europe/London': { city: 'London', lat: 51.5072, lng: -0.1276 },
  'Europe/Paris': { city: 'Paris', lat: 48.8566, lng: 2.3522 },
  'Europe/Berlin': { city: 'Berlin', lat: 52.52, lng: 13.405 },
  'Europe/Madrid': { city: 'Madrid', lat: 40.4168, lng: -3.7038 },
  'Europe/Rome': { city: 'Rome', lat: 41.9028, lng: 12.4964 },
  'Europe/Amsterdam': { city: 'Amsterdam', lat: 52.3676, lng: 4.9041 },
  // Americas
  'America/New_York': { city: 'New York', lat: 40.7128, lng: -74.006 },
  'America/Chicago': { city: 'Chicago', lat: 41.8781, lng: -87.6298 },
  'America/Denver': { city: 'Denver', lat: 39.7392, lng: -104.9903 },
  'America/Los_Angeles': { city: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  'America/Toronto': { city: 'Toronto', lat: 43.6532, lng: -79.3832 },
  // Oceania
  'Australia/Sydney': { city: 'Sydney', lat: -33.8688, lng: 151.2093 },
  'Australia/Melbourne': { city: 'Melbourne', lat: -37.8136, lng: 144.9631 },
};

export const DEFAULT_CITY: TzCity = TABLE['Asia/Riyadh']!;

export const cityForTz = (tz: string): TzCity => TABLE[tz] ?? DEFAULT_CITY;

export const detectCity = (): TzCity => {
  if (typeof Intl === 'undefined') return DEFAULT_CITY;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return cityForTz(tz);
};
