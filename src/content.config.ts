import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    /**
     * Each doc must be flipped to `published: true` after proofreading
     * before it shows up on the site or in the sitemap. Default is false
     * so newly-imported drafts never leak to production.
     */
    published: z.boolean().default(false),
    /**
     * `slug` and `locale` default to the file path: `<locale>/<slug>.md`.
     * Override in frontmatter only if you need a different URL or are
     * placing the file outside the locale folders.
     */
    slug: z.string().optional(),
    locale: z.enum(['en', 'ar', 'ms', 'ur']).optional(),
    last_updated: z.coerce.date().optional(),
    description: z.string().optional(),
    canonical: z.string().url().optional(),
    hreflang: z
      .array(z.object({ lang: z.string(), href: z.string().url() }))
      .optional(),
  }),
});

export const collections = { docs };
