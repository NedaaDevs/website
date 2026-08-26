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
      name: 'Asap',
      cssVariable: '--f-sans',
      provider: fontProviders.fontsource(),
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin'],
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
