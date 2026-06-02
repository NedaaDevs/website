/**
 * Build-time Crowdin client — per-language translation progress for the
 * localization section. Server-side only (needs an API token passed in by the
 * fetch script); never import this from client code.
 */
import { get, type ApiResult } from '@/lib/api/client';

const API_BASE = 'https://api.crowdin.com/api/v2';

export type LanguageProgress = {
  id: string;
  name: string;
  translated: number;
  approved: number;
};

type ProgressItem = {
  data: {
    languageId: string;
    translationProgress: number;
    approvalProgress: number;
    language: { id: string; name: string };
  };
};

export const getLanguageProgress = async (
  projectId: string,
  token: string,
  opts?: { timeoutMs?: number },
): Promise<ApiResult<LanguageProgress[]>> => {
  const url = `${API_BASE}/projects/${projectId}/languages/progress?limit=500`;
  const res = await get<{ data: ProgressItem[] }>(url, {
    ...opts,
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return res;
  if (!Array.isArray(res.data.data)) {
    return { ok: false, error: { kind: 'parse', message: 'unexpected progress shape' } };
  }
  const languages = res.data.data.map(({ data }) => ({
    id: data.languageId,
    name: data.language?.name ?? data.languageId,
    translated: data.translationProgress,
    approved: data.approvalProgress,
  }));
  return { ok: true, data: languages };
};
