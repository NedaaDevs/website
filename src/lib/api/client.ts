/**
 * Tiny fetch wrapper used by every service in `src/lib/api/`.
 * Works the same in Bun (build scripts) and the browser (Svelte islands)
 * because both expose `globalThis.fetch`.
 */

export type ApiError =
  | { kind: 'network'; message: string }
  | { kind: 'http'; status: number; message: string }
  | { kind: 'parse'; message: string }
  | { kind: 'timeout'; message: string };

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

export type RequestOpts = {
  timeoutMs?: number;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

const DEFAULT_TIMEOUT = 5000;

export const get = async <T>(url: string, opts: RequestOpts = {}): Promise<ApiResult<T>> => {
  const { timeoutMs = DEFAULT_TIMEOUT, headers, signal } = opts;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort('timeout'), timeoutMs);
  signal?.addEventListener('abort', () => ctrl.abort(signal.reason));

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json', ...headers },
      signal: ctrl.signal,
    });
    if (!res.ok) {
      return {
        ok: false,
        error: { kind: 'http', status: res.status, message: res.statusText },
      };
    }
    try {
      const data = (await res.json()) as T;
      return { ok: true, data };
    } catch (e) {
      return {
        ok: false,
        error: { kind: 'parse', message: e instanceof Error ? e.message : String(e) },
      };
    }
  } catch (e) {
    if (ctrl.signal.aborted && ctrl.signal.reason === 'timeout') {
      return { ok: false, error: { kind: 'timeout', message: `> ${timeoutMs}ms` } };
    }
    return {
      ok: false,
      error: { kind: 'network', message: e instanceof Error ? e.message : String(e) },
    };
  } finally {
    clearTimeout(timer);
  }
};
