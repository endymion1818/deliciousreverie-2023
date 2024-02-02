---
title: "Improving Performance on Deliciousreverie.co.uk"
description: "I can't possibly think I could get away with a post about performance when my own site wasn't as spot-on as I could get. So I've been spending a bit of time investigating how to reduce my load times. This is what I found out and how I implemented it."
tags: 
  - javascript
datePublished: 2015-10-06
---
I can't possibly think I could get away with [a post about performance](https://deliciousreverie.co.uk/post/why-performance-matters/)when my own site wasn't as spot-on as I could get. So I've been spending a bit of time investigating how to reduce my load times. This is what I found out and how I implemented it.

I built this site in December 2014 when I was on paternity leave. Now that my little bairn is finally sleeping through the night I can look at my code again through significantly less zombified eyes. I found a few things I'd like to improve on, namely:

1.  Reduce unused DOM elements
2.  Use non-blocking HTTP requests (at least on the home page)
3.  Streamline my CSS

Let's break down each of these and see what can be done to improve them.

### Reducing unused DOM elements [#](https://deliciousreverie.co.uk/posts/improving-performance-on-delicious-reverie/#reducing-unused-dom-elements)

When I built this site, I originally envisioned a main (central) content area, with sidebars of supplementary content. But at the time, I was beginning to realise [that normal people don't understand sidebars](https://deliciousreverie.co.uk/posts/normal-people-dont-understand-sidebars).

I have since decided to just focus on delivering good content in a branded experience. That's the core of what I wanted to achieve here.

So the sidebar elements are gone, along with their CSS.

### Use non-blocking HTTP requests [#](https://deliciousreverie.co.uk/posts/improving-performance-on-delicious-reverie/#use-non-blocking-http-requests)

My CSS is pretty important to the experience of the site, but I'm aware that by linking to an external stylesheet in the header was creating an extra round-trip for the browser before the content could be rendered.

Since my CSS is pretty lean on this project (119 lines, 2kb uncompressed or minified), I opted not to use a Taskrunner tool but instead use a PHP include instead:

```php
 <style><?php include 'assets/css/deliciousreverie.min.css'; ?></style>
```

I have a unique header file for the home page, so on my other pages, the header still renders via 'perch\_get\_css' as normal.

If my CSS code was much larger, I would find a tool to identify all necessary "above-the-fold" css and abstract that out into a separate CSS file for inclusion.

### 3\. Streamline CSS [#](https://deliciousreverie.co.uk/posts/improving-performance-on-delicious-reverie/#3.-streamline-css)

I have tended to use normalize.css to standardise delivery of my site across different browsers, just because I thought that's what everybody else did.

However, after having a chat to someone I admire, I realised that following the crowd in this instance was costing me in terms of performance.

When you include something like normalise.css, you're adding extra work for the browser to parse, often without rendering much of it. And you're potentially adding an extra CSS overwrite to your styles. For instance, if you want a unique checkbox input style, normalise already includes one extra style. So now we have 3 different renders: 1) The User Agent (browser) styles, 2) Normalize styles, 3) Your styles.

I've made a promise with myself to look at the source code of these libraries before I make any assumptions about what I should include in my builds in the future!

### Conclusion [#](https://deliciousreverie.co.uk/posts/improving-performance-on-delicious-reverie/#conclusion)

I've gained some great results from these excercises:

![Good results (3 A's and one B)](https://d13mv7x44wu31f.cloudfront.net/files/8laqvoo4o-straight-a.png)

Seeing this result on [Web Page Test](https://www.webpagetest.org/) was a big encouragement to me:- I had achieved much of what I wanted to.

I'm especially proud of the fact that I have no images at all on my home page. The render chart is similarly encouraging:

![Waterfall showing 5 total resources loaded in 1.1 seconds](https://d13mv7x44wu31f.cloudfront.net/files/8laqvoo3l-onesecond.png)![92.7% of bytes is font files, HTML and CSS make up the rest.](https://d13mv7x44wu31f.cloudfront.net/files/8laqvoo1x-bytesized.png)

As you can see here, I have made some huge sacrifices for including three Google fonts. On the other hand, I have had a big win with regards to images, it feels nice to splash out a bit on this form of branding.

So, great. For my next challenge I want to see what I can do to streamline Wordpress. Whilst I don't think you can ever get as good results from that CMS as Perch allows you to, I'm sure I can think of some ways of getting better results.

What results have you had from taking a closer look at the performance of your site? I'd love to hear what you come up with - please tweet me on [@muzzlehatch\_](https://twitter.com/muzzlehatch_)!"