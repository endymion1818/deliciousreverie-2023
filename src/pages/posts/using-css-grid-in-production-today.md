---
layout: ../../layouts/BlogLayout.astro
title: "Using CSS Grid In Production Today"
description: "For me, as well as a lot of others, CSS Grid is the most exciting thing to happen since CSS3 ... possibly even CSS2. But many fear using it in production. This post tackles one common use case where a Flexbox fallback provides support for Internet Explorer and Edge.
"
tags: 
  - css
datePublished: 2017-07-09
---

For me, as well as a lot of others, CSS Grid is the most exciting thing to happen since CSS3 ... possibly even CSS2. But many fear using it in production. This post tackles one common use case where a Flexbox fallback provides support for Internet Explorer and Edge.

I'm really, really excited about CSS Grid. This new technology, which allows developers to finally build a structured document layout natively without using a hack, was released in most major browsers in about March of this year.

I've been closely following the work of Jen Simmons and Rachel Andrew on this subject, and have attended other talks about the subject. But now I want to join the chorus and say with a definite certainty: yes, you can use CSS Grid in production today.

I already have.

## Why CSS Grid? [#](https://deliciousreverie.co.uk/posts/using-css-grid-in-production-today/#why-css-grid)

I imagine that many of us are quite happy with the tools we currently use to lay out our web pages. I too was pretty confident using either Bootstrap's grid, Susy, or something I custom-built, to lay out my document using floats.

I don't need to say here what's already been said, and which you've probably heard, about floats being a hack. Suffice to say, that this approach leads to increased maintenance cost over the lifetime of a project and contributes to poor performance of a website.

But floats are also a hack, just like tables were before that. CSS Grid is the hero the web needs.

## But ... It's Not Supported! [#](https://deliciousreverie.co.uk/posts/using-css-grid-in-production-today/#but-...-it's-not-supported!)

Like Rachel Andrew said in her recent blog post [(link here)](https://rachelandrew.co.uk/archives/2017/07/04/is-it-really-safe-to-start-using-css-grid-layout/) around 70% of browsers have support for Grid. That's most of the web. You might want to check your own analytics to see what you need to support for your project, however I believe I have come up with a workable solution for when you need to support IE11.

## The Scenario [#](https://deliciousreverie.co.uk/posts/using-css-grid-in-production-today/#the-scenario)

I often find myself with this UI layout in my projects: 2 repeating columns of content, inside which are elements, usually designed with dummy content of the same height. This never works in production with floats. Sooner or later I get gaps like great big ugly missing teeth everywhere.

The way I've traditionally coped with this is very convoluted:

```php
<div class="row">
<?php $count=0; foreach ($items as $item) : ?>
<?php if ($count % 2 == 0 { ?>
</div><div class="row">
<?php } ?>
<?php $count++; endforeach; ?>
</row>
```

Phew!

This assumes that 1) Your frontend developer is authorised to, and competent at, writing server-side code, 2) you don't mond doing a lot of counting, 3) you don't mind spurious markup everywhere.

This approach is messy, but it works.

## Supporting 97% of the Web [#](https://deliciousreverie.co.uk/posts/using-css-grid-in-production-today/#supporting-97percent-of-the-web)

Here's the alternative. I can support IE11, Edge, and older versions of some browsers by using flexbox instead of grid.

First, I declare the flexbox layout:

```css
@media(min-width: 768px) {
  .container {
    display: flex;
    flex-wrap: wrap;
    margin-left: -15px;
    margin-right: -15px;

    > * {
      flex: 1;
      flex-basis: 46%;
      margin: 15px;
    }
  }
}
@media(min-width: 1200px) {
  .container {

    > * {
      flex-basis: 47%;
    }
  }
}
```

Please note: this is 22 lines of code that I hope I will be able to remove from the project at some point. If not, it isn't doing any harm where it's not used.

Now, below that I use an @supports rule to scope the grid layouts:

```css
@supports (display: grid) {

  @media (min-width: 768px) {
    .container {
      display: grid;
      grid-template-columns: repeat(2, 50fr);
      grid-gap: 15px;

      > * {
        margin: 0;
      }
    }
  }
}
```

This is only 11 lines of code (not counting the lack of a <div class="row"> etc, and doesn't use hacks like negative margins. Much better.

This works in 97% of browsers today, [even Internet Explorer](https://caniuse.com/#search=flexbox).

Now, in both layouts, you get 2 columns of content, each item on a row has the same height, and they can expand to the content that you put into them.

One thing to note: I'm not replacing my floated grid in this project. I'm complementing them at this stage for when floats are inadequate.

But in the near future, I'm really looking forward to swapping out this approach for more semantic, web-native code.

I hope this little demonstratons helps you to see how CSS grid works, is faster, less costly to maintain, and great for the web."