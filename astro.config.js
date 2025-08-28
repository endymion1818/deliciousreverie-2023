import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import pagefind from "astro-pagefind";

export default defineConfig({
  site: 'https://deliciousreverie.co.uk',
  image: {
    domains: ['d3720zlxyfesv8.cloudfront.net', 'd3129htoztmcjy.cloudfront.net/']
  },
  integrations: [
    tailwind(),
    pagefind(),
    sitemap({
      serialize(item) {
        return {
          ...item,
        };
      }
    })
  ]
});
