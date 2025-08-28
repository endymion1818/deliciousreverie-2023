import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pagefind from "astro-pagefind";

export default defineConfig({
  site: 'https://deliciousreverie.co.uk',
  image: {
    domains: ['d3720zlxyfesv8.cloudfront.net', 'd3129htoztmcjy.cloudfront.net/']
  },
  integrations: [
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
