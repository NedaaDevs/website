import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '@/i18n/types';

export type Doc = CollectionEntry<'docs'>;

/** Derive locale + slug from `<locale>/<slug>` ids when frontmatter omits them. */
const splitId = (id: string): { locale: Locale; slug: string } => {
  const [first, ...rest] = id.split('/');
  if (first === 'en' || first === 'ar' || first === 'ms' || first === 'ur') {
    return { locale: first, slug: rest.join('/') || first };
  }
  return { locale: 'en', slug: id };
};

export const docMeta = (doc: Doc): { locale: Locale; slug: string } => {
  const fromPath = splitId(doc.id);
  return {
    locale: doc.data.locale ?? fromPath.locale,
    slug: doc.data.slug ?? fromPath.slug,
  };
};

export const getPublishedDocs = async (locale: Locale): Promise<Doc[]> => {
  const all = await getCollection('docs', ({ data }) => data.published);
  return all.filter((d) => docMeta(d).locale === locale);
};
