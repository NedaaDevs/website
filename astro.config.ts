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
  },
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro',
  },
  devToolbar: { enabled: true },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
