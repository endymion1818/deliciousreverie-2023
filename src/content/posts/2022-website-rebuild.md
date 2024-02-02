---
title: "2022 Website Rebuild"
description: "I've just relaunched my website with an entirely new stack, here's what it consists of and why I've made these technical decisions."
tags: 
  - personal
  - webiny
datePublished: 2022-11-25
---
Around a year ago I rebuilt this website using [Eleventy](https://www.11ty.dev), the static site generator. I did this because my existing site was using [Gatsby](https://www.gatsbyjs.com) but was [using a plugin which removed the JavaScript in a way that caused errors on the site](https://www.gatsbyjs.com/plugins/gatsby-plugin-no-javascript/\). I didn't want to put the JavaScript-heavy build back, but the broken links were causing errors in the console and I knew it  wasn't the best approach to a JavaScript-less Gatsby site, but at the time there was no alternative.

Eleventy is quite a unique tool. Whilst I can see it's appeal for some, I found the way it consumes data and then injects it back in at build time a bit of a black box. At the time I rebuilt it, I was hoping to use the revolutionary plugin Slinkity to provide client-side JavaScript so I build build back features such as animations and search. However, by the time I launched my site, the author of Slinkity had moved to Astro, and development had slowed.

## Rebuilding in Astro

I had determined that I would rebuild the site a second time in [Astro](https://astro.build), but it was early days for that tool as well, so I've sat on it for the time being. However, in recent weeks I've really needed to make some serious changes to the site so I could showcase some of my recent work at Webiny, and Astro had reached v1, so it seemed a good time to switch.

Therefore, the frontend is built in Astro. As yet there's no JavaScript, but I'm planning to use [Svelte](https://svelte.dev) because of it's developer experience and unique approach to providing interactivity. However, I could very easily add components that are built in other frontend frameworks. This agnostic use of frontend rendering libraries is a powerful enabler, and one I want to leverage.

## Styling with Tailwind (and others)

I've used [Tailwind](https://tailwindcss.com) with [DaisyUI](https://daisyui.com) for the most part because of the way it compiles away unused CSS. At most I've used 4 Tailwind classes on an element. My reasoning for this was that if I'm using a lot of classes, I'm probably doing Tailwind wrong. I've got more to say on this subject so I'll save it for a separate article. But suffice to say for now that using Tailwind with DaisyUI is a great combination because you have access to a library without being tied to semantic elements and which are also tree-shakeable. DaisyUI is a Tailwind plugin, so elements are only compiled into the CSS bundle when you use them, same as Tailwind.

I haven't exclusively used Tailwind and Daisy, because I think every system is at some point going to fall short of what you need; in my case it was the ability to [underline links that are inline in the content](https://github.com/endymion1818/personal-frontends-monorepo/blob/535a0c7b02f59bf9a60da95820b1418ff58be267/libs/rich-text-renderer/src/lib/RichTextRenderer.astro#L64).

Big shoutout to Salma ([@whitep4nth3r](https://twitter.com/whitep4nth3r?s=21&t=fuSkdsKWbtIpZBQwn-mKrg)) for "roasting" my site on her Twitch stream which identified loads of layout, typography and spacing issues.

## Webiny for the Content Store

I'm pleased to use Webiny to store content. I manually moved all of my articles over to my new [Webiny](https://www.webiny.com) instance which is deployed on AWS using Webiny's [Pulumi](https://www.pulumi.com) integration. Webiny is an eminently hackable CMS which is why I like it. Because it uses [EditorJS](https://github.com/editor-js) in the backend, I was able to customize it by [adding a plugin for code blocks](https://github.com/editor-js/code). Unfortunately there seems to be a problem using some of the other plugins (embeds and inline code blocks) which I want to investigate.

It was tricky to figure out how to render this content in Astro. Rather than using Prism,  I opted for [Shiki](https://shiki.matsu.io) because it's native to Astro and would mean adding one less dependency.

Actually I really like Shiki's API:

```javascript
import shiki from 'shiki'

const { code } = Astro.props

let codeOutput

await shiki.getHighlighter({
  theme: 'monokai',
}).then(highlighter => {
  codeOutput = highlighter.codeToHtml(code, { lang: 'jsx' })
})
```

This is using Astro's top-level await. Unfortunately the EditorJS plugin doesn't allow you to store a language by default. This is something I might try to change soon.

![Webiny's content editing interface<div><br></div>](https://d13mv7x44wu31f.cloudfront.net/files/8laz4f6vl-ScreenShot2022-11-27at08.49.57.png)

Although Webiny's editing interface isn't as nice to use as others, it's a great tool that can scale with the content I produce. Since all of the blogs I look after only have around 100-200 records, I'm planning to use one Webiny instance for all of them. I think that will ultimately mean I need to migrate from the current implementation (DynamoDB only) to one which uses ElasticSearch to index and retrieve records. I also may need to pay for a license to use the multisite feature, but I'll worry about that later.

  
Also, I've been very lazy about retrieving records in my frontends. Instead of utilizing the built-in cursor based pagination from the GraphQL API, I've just increased the limit of retrieved articles to 200 and grabbed all of them in one API call. I realize I shouldn't really do this so I've [added something to the codebase that will case builds to fail if there are over 200 records](https://github.com/endymion1818/personal-frontends-monorepo/blob/535a0c7b02f59bf9a60da95820b1418ff58be267/apps/deliciousreverie/src/pages/posts/index.astro#L42).

I have found that writing in Markdown isn't fun anymore either. I'm hoping using this interface will therefore encourage me to write more often.

## Code Management

One of my objectives with this rebuild was to consolidate all of my content-heavy websites. I manage and write content for [https://freebabylon5.com](https://freebabylon5.com) and [https://www.discovermikeoldfield.info](https://www.discovermikeoldfield.info), and I want to build some more sites soon. However, each of these sites is built on different technologies. I was a hoping that I could consolidate all of these into one monorepo using [Nx](https://nx.dev) so I could re-use the setup and different shared elements, like the header, footer and rich text renderer. I [followed this tutorial to set up Netlify deploys from the monorepo](https://www.netlify.com/blog/2020/04/21/deploying-nx-monorepos-to-netlify/), but as yet I haven't tested it with a seconds site, so I'm not sure how that might go.

This means there will be one monorepo for frontend code, one for the backend code, and I can iterate on the two as I go along. This setup is pleasing from a code re-use perspective as well as saving me time that I can spend with my family, whilst at the same time allowing me to enjoy my hobby of writing.

## The future

I'm hoping to add some features in the near future

1.  Search with Lunr.JS
2.  Add back the wistful animations
3.  Inline embeds and Code blocks
4.  Fetching data from GitHub
5.  Fetching and rendering the latest video from my YouTube channel
6.  Rendering previous & next links on articles
7.  Using a self-hosted alternative to Calendly
8.  Using self-hosted analytics

In addition to this, as I mentioned, I want to scale out this stack to provide unique experiences for each of my websites.

Also I've just discovered that creating a new build on Netlify is cached by Nx, so when I want to publish a new article (which doesn't involve any code changes), I need to alter the build settings to include the skip Nx Cache command.  that's something I need to dig into as well as setting up a CI-CD pipeline for the backend.

![Build settings in Netlify with the build command and flag to skip nx cache so new content is fetched](https://d13mv7x44wu31f.cloudfront.net/files/8lazg2ckc-ScreenShot2022-11-27at14.15.48.png)

Both the [frontend](https://github.com/endymion1818/personal-frontends-monorepo) and the [backend](https://github.com/endymion1818/backends-webiny) repos are public, so feel free to follow along as I add more features.

Another shoutout goes to Swapnil ([@swapnilmmane](https://twitter.com/swapnilmmane?s=21&t=fuSkdsKWbtIpZBQwn-mKrg)) for waking me up by saying "I don’t know what your site is about, it’s a black box" which prompted me to redesign my home page to have more focus on what I do."