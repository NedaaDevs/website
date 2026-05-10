import { get, type ApiResult } from '@/lib/api/client';

export type GitHubCommit = {
  sha: string;
  commit: { message: string; author: { name: string; date: string } };
  html_url: string;
};

export type GitHubRepo = {
  full_name: string;
  default_branch: string;
  stargazers_count: number;
  open_issues_count: number;
  pushed_at: string;
};

const ROOT = 'https://api.github.com';
const HEADERS = { Accept: 'application/vnd.github+json' };

export const getRepo = (full: string, opts?: { timeoutMs?: number }) =>
  get<GitHubRepo>(`${ROOT}/repos/${full}`, { ...opts, headers: HEADERS });

export const getCommits = (
  full: string,
  per_page = 5,
  opts?: { timeoutMs?: number },
): Promise<ApiResult<GitHubCommit[]>> =>
  get<GitHubCommit[]>(`${ROOT}/repos/${full}/commits?per_page=${per_page}`, {
    ...opts,
    headers: HEADERS,
  });
