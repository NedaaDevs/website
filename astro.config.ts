import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://nedaa.dev',
  output: 'static',
  integrations: [svelte(), sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar', 'ms', 'ur'],
    routing: { prefixDefaultLocale: false },
    fallback: { ar: 'en', ms: 'en', ur: 'en' },
  },
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro',
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
