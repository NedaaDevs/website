import { NodeHtmlMarkdown } from 'node-html-markdown';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = 'dist';
// Routes with no agent-readable prose / not real pages.
const SKIP_DIRS = new Set(['_astro', 'og', 'og-render', 'fonts']);

const walkHtml = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => {
      const p = join(dir, e.name);
      if (e.isDirectory()) return SKIP_DIRS.has(e.name) ? [] : walkHtml(p);
      return e.name.endsWith('.html') ? [p] : [];
    }),
  );
  return nested.flat();
};

/** Inner HTML of the single <main> element, or null if the page has none. */
const mainOf = (html: string): string | null =>
  html.match(/<main[^>]*>([\s\S]*)<\/main>/i)?.[1] ?? null;

const titleOf = (html: string): string =>
  html.match(/<title>([\s\S]*?)<\/title>/i)?.[1].trim() ?? '';

const files = await walkHtml(DIST);
let count = 0;
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const main = mainOf(html);
  if (!main) continue; // e.g. utility pages without article content
  const title = titleOf(html);
  const body = NodeHtmlMarkdown.translate(main).trim();
  const md = (title ? `# ${title}\n\n` : '') + body + '\n';
  const out = file.replace(/\.html$/, '.md');
  await writeFile(out, md, 'utf8');
  count += 1;
  console.log(`md: ${relative(DIST, out)}`);
}
console.log(`Generated ${count} markdown twin(s).`);
