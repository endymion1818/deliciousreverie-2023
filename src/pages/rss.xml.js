import rss from '@astrojs/rss';
import { title, subtitle, siteUrl } from "../../sitedata"
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import { getCollection } from 'astro:content';
const parser = new MarkdownIt();

export async function GET(context) {
  const postImportResult = getCollection('posts');
  const posts = Object.values(postImportResult);
  const items = posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.datePublished,
    link: `${siteUrl}${post.url}`,
    content: sanitizeHtml(`${parser.render(post.body)}<hr><p>Thanks for reading this via RSS. Let me know what you thought by <a href="re: ${post.data.title}">sending me an email</a></p>`),
  }))
  return rss({
    title,
    description: subtitle,
    site: context.site,
    items,
  });
}
