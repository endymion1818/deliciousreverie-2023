import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

import { title, subtitle } from '../../sitedata.js';

const composeContent = (body, title) => sanitizeHtml(`
  ${parser.render(body)}
  <hr>
  <footer>
  <p>Thanks for reading this article via RSS. Let me know what you think by <a href="mailto:endymion1818@gmail.com?subject=re:${title}">sending me an email.</a></p></footer>
`) 

export async function GET(context) {
  const blog = await getCollection('posts');
  return rss({
    title,
    description: subtitle,
    site: context.site,
    items: blog.map((post) => ({
      link: `/posts/${post.slug}/`,
      pubDate: post.data.datePublished,
      title: post.data.title,
      description: `${post.data.description}`,
      content: composeContent(post.body, post.data.title),
    })),
  });
}