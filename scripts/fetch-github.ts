/**
 * Pulls public repo metadata + recent commits from NedaaDevs/nedaa at build
 * time. Used by the Open Source section so the website shows real activity,
 * not a mocked commit list.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getRepo, getCommits } from '@/lib/api/github';

const REPO = 'NedaaDevs/nedaa';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'src/data/github.json');

export type RepoSnapshot = {
  fullName: string;
  branch: string;
  stars: number;
  openIssues: number;
  pushedAt: string;
  commits: { sha: string; short: string; message: string; date: string; url: string }[];
  fetchedAt: string;
};

const FALLBACK: RepoSnapshot = {
  fullName: REPO,
  branch: 'main',
  stars: 0,
  openIssues: 0,
  pushedAt: new Date().toISOString(),
  commits: [],
  fetchedAt: new Date().toISOString(),
};

const readExisting = async (): Promise<RepoSnapshot | null> => {
  try {
    return JSON.parse(await readFile(OUT, 'utf8')) as RepoSnapshot;
  } catch {
    return null;
  }
};

const main = async () => {
  const [repo, commits] = await Promise.all([
    getRepo(REPO, { timeoutMs: 6000 }),
    getCommits(REPO, 5, { timeoutMs: 6000 }),
  ]);

  if (!repo.ok || !commits.ok) {
    const existing = await readExisting();
    const out = existing ?? FALLBACK;
    console.warn(
      '[fetch-github] API failed:',
      !repo.ok ? `repo=${repo.error.kind}` : `commits=${commits.ok ? '' : commits.error.kind}`,
      `— ${existing ? 'keeping previous' : 'using fallback'}`,
    );
    await mkdir(dirname(OUT), { recursive: true });
    await writeFile(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8');
    return;
  }

  const out: RepoSnapshot = {
    fullName: repo.data.full_name,
    branch: repo.data.default_branch,
    stars: repo.data.stargazers_count,
    openIssues: repo.data.open_issues_count,
    pushedAt: repo.data.pushed_at,
    commits: commits.data.map((c) => ({
      sha: c.sha,
      short: c.sha.slice(0, 7),
      message: c.commit.message.split('\n')[0]!,
      date: c.commit.author.date,
      url: c.html_url,
    })),
    fetchedAt: new Date().toISOString(),
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(
    `[fetch-github] ${out.fullName} · ${out.stars}★ · ${out.commits.length} commits`,
  );
};

await main();
