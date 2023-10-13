import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://deliciousreverie.co.uk',
  integrations: [
    tailwind(),
    sitemap()
  ]
});
