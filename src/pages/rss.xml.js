import rss, { pagesGlobToRssItems } from '@astrojs/rss';import { title, siteLanguage, subtitle, siteUrl } from "../../sitedata"

export async function GET(context) {
  return rss({
  title: title,
  description: subtitle,
  site:  siteUrl,
  items: await pagesGlobToRssItems(
    import.meta.glob("./src/pages/**/*.md")
  ),
  customData: `<language>${siteLanguage}</language>`,
  })
}
