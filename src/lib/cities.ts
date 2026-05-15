/** Default location for the marketing prayer card before the user overrides. */
export type CityRef = { city: string; lat: number; lng: number };

export const MAKKAH: CityRef = { city: 'Makkah', lat: 21.3891, lng: 39.8579 };

export const sameLocation = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) =>
  Math.abs(a.lat - b.lat) < 0.05 && Math.abs(a.lng - b.lng) < 0.05;
