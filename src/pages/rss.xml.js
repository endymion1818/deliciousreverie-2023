import rss, { pagesGlobToRssItems } from '@astrojs/rss';
import { title, subtitle } from "../../sitedata"

export async function GET(context) {
  return rss({
    title,
    description: subtitle,
    site: context.site,
    items: await pagesGlobToRssItems(
      import.meta.glob('./src/pages/posts/*.{md}'),
    ),
  });
}
