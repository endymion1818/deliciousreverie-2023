---
title: "Is Gatsby in decline?"
description: "I'm sure I was one of the earliest users of Gatsby. But is it in decline? The title is a bit click-baity because I don't really feel that it is. Rather, I think it's well on it's way to finding it's niche."
tags: 
  - javascript
  - gatsby
datePublished: 2022-08-13
---
Recently I encountered a Reddit thread along the lines of "is Gatsby dead?", and even some colleagues I respect were agreeing that yes, Gatsby is in decline, suggesting there are better technologies out there.

Whilst there are a good range of frameworks we can use these days, I don't necessarily agree that Gatsby is in decline and people should avoid using it.

I'd like to explain why.

## In decline? [#](https://deliciousreverie.co.uk/posts/is-gatsby-decline/#in-decline)

I feel sure I was one of the earlier users of Gatsby. I was introduced to it and Netlify before v1 was released, and started experimenting with fetching data from a content source pretty soon after that.

I've since had a chance to work extensively with both Gatsby and Next.js, and can see why people like the Next.js lower-level API. I agree that for a lot of use cases, Next.js is a great tool to use. I particularly like how easy [getServerSideProps()](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props) is to build an isomorphic application that runs in a container.

However, when I need to build an application, there's always going to be some assessment in my head about which tool is better.

## Gatsby's strengths [#](https://deliciousreverie.co.uk/posts/is-gatsby-decline/#gatsby's-strengths)

Where Gatsby's niche might be in the future is one of these, or possibly all of them:

### 1\. Developers who want to leverage the plugin ecosystem [#](https://deliciousreverie.co.uk/posts/is-gatsby-decline/#1.-developers-who-want-to-leverage-the-plugin-ecosystem)

There are a lot of developers who don't have the luxury of doing things in the best way possible themselves. Usually this is because of tight, perhaps unreasonable, deadlines. The plugin ecosystem doesn't always mean faster development, but it is easy to configure without having to learn APIs deeply first.

This might also benefit newer users to the JavaScript ecosystem, who need a way of learning React and friends.

### 2\. Applications that source from many different APIs [#](https://deliciousreverie.co.uk/posts/is-gatsby-decline/#2.-applications-that-source-from-many-different-apis)

Where Gatsby does particularly well is with the "content mesh". You might have heard this referred to as "composable commerce" or something similar. But Gatsby had the concept very early on. The idea is that you source data from a variety of APIs which are then compiled into a [single GraphQL API](https://www.gatsbyjs.com/docs/tutorial/part-4/) which you can then use to build up components, then pages, and built into a website.

Gatsby really excels at this. I can confidently fetch loads data from REST and GraphQL backends, query the rest in pages, components or templates, and chuck away the data I don't want when the application is built.

### 3\. Applications that don't need specialist environments [#](https://deliciousreverie.co.uk/posts/is-gatsby-decline/#3.-applications-that-don't-need-specialist-environments)

Gatsby has the [gatsby-ssr.js](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/) and [gatsby-browser.js](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/) files that both wrap the application, one that runs at build time and one on the client, as the names suggest). I think this is far superior separation of concerns than Next.js' [\_App.js](https://nextjs.org/docs/advanced-features/custom-app).

It also leverages the open source react router, instead of including it's own. Next.js has admittedly [made strides in this direction](https://nextjs.org/blog/layouts-rfc) but until recently I had real issues when trying to render components on nested routes in a Next.js application.

Also, I find the [Gatsby <Image /> element](https://www.gatsbyjs.com/plugins/gatsby-image/) superior to Next.js, because it works statically, whereas you again need [specialist infrastructure (or a containerized application)](https://nextjs.org/docs/advanced-features/static-html-export#unsupported-features) for Next.js' to work.

### 4\. Where you need custom data in headers, footers etc [#](https://deliciousreverie.co.uk/posts/is-gatsby-decline/#4.-where-you-need-custom-data-in-headers-footers-etc)

Ever tried fetching data from an API at build time (or on a server) in a component with Next.js? You either need a context object or prop drilling, which isn't always possible or desireable.

Gatsby's [staticQuery()](https://www.gatsbyjs.com/docs/how-to/querying-data/static-query/) on the other hand works in components and makes this really easy.

## Conclusion [#](https://deliciousreverie.co.uk/posts/is-gatsby-decline/#conclusion)

Don't get me wrong, there's a huge amount going for Next.js, and I love building stuff with it. But I'm still not always going to reach for it.

If I need an application that requires React or a heavy amount of client-side JavaScript, I'll assess whether Gatsby is best or Next.js is.

All in all, I think there was an explosion in users when Gatsby first launched, and although there are other great tools like Next.js and Astro, I think it still has a valuable place in a JavaScript developers' toolbox."