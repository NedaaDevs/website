import { defineConfig, fontProviders } from 'astro/config';
import { fileURLToPath } from 'node:url';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://nedaa.dev',
  output: 'static',
  integrations: [svelte(), sitemap()],
  fonts: [
    {
      // Pinned to the wght-axis latin file from the installed package. The
      // hosted providers offer either an all-axes build or every subset, and
      // this site varies only weight and renders only latin from this family.
      name: 'Asap',
      cssVariable: '--f-sans',
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            weight: '100 900',
            style: 'normal',
            src: ['@fontsource-variable/asap/files/asap-latin-wght-normal.woff2'],
            unicodeRange: [
              'U+0000-00FF',
              'U+0131',
              'U+0152-0153',
              'U+02BB-02BC',
              'U+02C6',
              'U+02DA',
              'U+02DC',
              'U+0304',
              'U+0308',
              'U+0329',
              'U+2000-206F',
              'U+20AC',
              'U+2122',
              'U+2191',
              'U+2193',
              'U+2212',
              'U+2215',
              'U+FEFF',
              'U+FFFD',
            ],
          },
        ],
      },
      fallbacks: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
    },
    {
      name: 'IBM Plex Sans Arabic',
      cssVariable: '--f-arabic',
      provider: fontProviders.fontsource(),
      weights: [500],
      styles: ['normal'],
      subsets: ['arabic'],
      fallbacks: ['Noto Sans Arabic', 'Tahoma', 'Geeza Pro', 'system-ui', 'sans-serif'],
    },
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar', 'ms', 'ur'],
    routing: { prefixDefaultLocale: false },
  },
  build: {
    inlineStylesheets: 'always',
    assets: '_astro',
  },
  // Prose wraps mid-sentence, so an inline element often starts a source line.
  // HTML-aware compression keeps the space before it; JSX rules would fuse it
  // into the preceding word.
  compressHTML: true,
  devToolbar: { enabled: true },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
