---
title: "First steps with Sveltekit"
description: "SvelteKit is great for one reason: performance. And it's this above everything else (except accessibility) that I'm excited about."
tags: 
  - javascript
  - svelte
datePublished: 2021-05-27
---
Svelte is a new framework for JavaScript ... hear me out! It does seem to some people that there's a new JavaScript framework out every day. And there are a lot of new ones at the minute. But SvelteKit is great for one reason: performance. And it's this above everything else (except accessibility) that I'm excited about.

Svelte does have a lot of things going for it. It's as nice (if not nicer) to develop with than React, and getting started is a lot, lot quicker.

These days, if you're going to build a site with React, you either go with the slightly walled garden of create-react-app, or something like Next or Gatsby. Vue has it's own set of these problems too.

However Svelte ... isn't just a framework. It's a compiler too. This facilitates much smaller bundle sizes:

React is 42.2kb including react-dom. By comparison, Preact is 4kb. By contrast, Svelte is 1.6kb. That blows my mind.

In our day of multi-megabyte downloads for some websites (that I've seen), Svelte could really turn the tide.

## Developer experience [#](https://deliciousreverie.co.uk/posts/first-steps-with-sveltekit/#developer-experience)

The other thing I want to talk about is the developer experience of Svelte. It's very pleasant to work with. Writing components feels a lot more like writing native HTML and CSS. There were certainly some unusual (to me) augmentations, for example writing conditional blocks has an unusual syntax, with { #if } and { /if} either side of the condition.

I have to say, I do kinda prefer React's slightly more JavaScript-y approach.

```javascript
{condition && <div>conditional item</div>;}
```

However, when it comes to rendering HTML content, it's much more succinct.

```javascript
{@html htmlContent}
```

Don't get me wrong, that reminder is pretty useful. However once you're familiar with the concept, it's not exactly a big deal any more.

## SvelteKit vs NextJS vs Gatsby [#](https://deliciousreverie.co.uk/posts/first-steps-with-sveltekit/#sveltekit-vs-nextjs-vs-gatsby)

SvelteKit is definitely going more the route of NextJS rather than Gatsby. Gatsby is a little more prescriptive and great for newer developers (or those short on time), but NextJS allows much more freedom.

Similar to NextJS, SvelteKit will have options for rendering with SSG / SSR or on the client, and different adapters for interfacing with serverless functions from different providers.

This means you have to fetch data your own way, either on the client or server, and that means you have to be a bit more aware of the performance costs involved.

However, I couldn't find any reference to how you build a NextJS that compiles at build time, that doesn't send any JavaScript to the client. Yet, that's one of the excellent things about SvelteKit: I easily configured my site to send exactly no clientside javascript to the browser, and it works perfectly!

## My project [#](https://deliciousreverie.co.uk/posts/first-steps-with-sveltekit/#my-project)

You can take a look at my live project at [https://promatt.co.uk](https://promatt.co.uk/).

I wrote this small site using a starter built by [Scott Spence](https://scottspence.com/posts/graphcms-svelte-starter). It fetches data from \[Hygraph\](: [https://hygraph.com/](https://hygraph.com/)) and is hosted on [Vercel](https://vercel.com/). I've used [Formspree](https://formspree.io/) to forward emails from the /contact page to my friend's email address, but I could have just as easily done that with a serverless function.

## Conclusion [#](https://deliciousreverie.co.uk/posts/first-steps-with-sveltekit/#conclusion)

There's one other project I've got my eye on that will trump SvelteKit for my tool of choice. I think it's a great challenge to other frameworks, and I really hope it starts some kind of "performance war" where the performance costs of frameworks are driven down by competition in the space.

Even if that doesn't happen, SvelteKit is a wonderful addition to the JavaScript developers' tool belt."