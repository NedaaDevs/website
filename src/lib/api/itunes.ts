import { get, type ApiResult } from '@/lib/api/client';

export type ItunesLookupResult = {
  trackId: number;
  trackName: string;
  bundleId: string;
  version: string;
  currentVersionReleaseDate: string;
  minimumOsVersion: string;
  trackViewUrl: string;
  sellerName: string;
};

type LookupEnvelope = { resultCount: number; results: ItunesLookupResult[] };

export const lookupByBundleId = async (
  bundleId: string,
  opts?: { timeoutMs?: number },
): Promise<ApiResult<ItunesLookupResult>> => {
  const url = `https://itunes.apple.com/lookup?bundleId=${encodeURIComponent(bundleId)}`;
  const res = await get<LookupEnvelope>(url, opts);
  if (!res.ok) return res;
  const item = res.data.results[0];
  if (!item) {
    return { ok: false, error: { kind: 'parse', message: `no result for ${bundleId}` } };
  }
  return { ok: true, data: item };
};
