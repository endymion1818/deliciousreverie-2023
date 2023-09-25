import rss from '@astrojs/rss';
import { title, subtitle, siteUrl } from "../../sitedata"
import sanitizeHtml from 'sanitize-html';

export async function GET(context) {
  const postImportResult = import.meta.glob('./posts/*.md', { eager: true });
  const posts = Object.values(postImportResult);
  const items = posts.map((post) => ({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    pubDate: post.frontmatter.datePublished,
    link: `${siteUrl}${post.url}`,
  }))
  return rss({
    title,
    description: subtitle,
    site: context.site,
    items,
  });
}
