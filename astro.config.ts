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
      weights: [500, 600],
      styles: ['normal'],
      subsets: ['arabic'],
      display: 'optional',
      fallbacks: ['Noto Sans Arabic', 'system-ui', 'sans-serif'],
    },
  ],
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
