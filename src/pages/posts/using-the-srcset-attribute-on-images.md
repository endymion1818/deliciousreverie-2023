title: "Using the Srcset attribute on images - Delicious Reverie"
description: "So, I've been using the relatively new (and somewhat confusing) srcset attribute to serve a couple of interesting use cases lately. This spec is really, really useful in certain circumstances, two of which I'd like to share with you here.
"
categories:
datePublished: 2016-01-15
canonicalLink: "https://deliciousreverie.co.uk/posts/using-the-srcset-attribute-on-images/
---
# Using the Srcset attribute on images

Published on Friday, 15 January 2016

So, I've been using the relatively new (and somewhat confusing) srcset attribute to serve a couple of interesting use cases lately. This spec is really, really useful in certain circumstances, two of which I'd like to share with you here.

### Situation 1: You want to use SVGs, but need to support browsers that don't [#](https://deliciousreverie.co.uk/posts/using-the-srcset-attribute-on-images/#situation-1:-you-want-to-use-svgs-but-need-to-support-browsers-that-don't)

SVG support is fairly advanced across the browser spectrum (above), but srcset is supported less, especially by legacy IE browsers (below). This allows us to use the srcset attribute to specify an SVG image (or WebP for that matter), allowing newer browsers to download the Srcset image in preference, and older browsers to use the fallback .png file (or whatever else).

I can't claim to have thought of this myself, Sara Soueidan covered this concept [on her blog in February 2015](https://sarasoueidan.com/blog/svg-picture/).

The markup for this could actually be quite minimal:

```
<img src="logo.png"	srcset="logo.svg"	alt="alt text goes here" />
```

The browsers that recognise srcset will download that asset, so you'll get a nice crisp SVG, otherwise older browsers (which don't have support for svg either) will get the image.

I routinely add dimensions to my srcsets to avoid rendering problems in certain browsers where they will always render the SVG at the natural height & width of the SVG, so if you have a different sized png, things can get a little crazy.

## Situation 2: You want to use 2 different images at different breakpoints

Just recently I had a client requirement for an image that would be wide & narrow at large breakpoints, and thinner and taller at smaller, like this image demonstrates:

![](https://d13mv7x44wu31f.cloudfront.net/files/8laqx8yq8-srcset-example.png)

Yes I could do this with background images in CSS, but then the browser would have to download both images, increasing the page weight. Srcset solves this problem by fetching the appropriate image based on what sizes you stipulate in your media queries. This took me a few tries to get right, but I ended up with a robust solution that would conserve bandwidth:

```
<img
	src="fallback.png"
	srcset="
			small.png 649w,
			large.png 1140w
		"
	sizes="
		(max-width:767px) 649w,
		(min-width:768px) 1140w
	"
       alt="descriptive text"
/>
```

What I'm doing is specifying that the browser should behave this way:

-   If the viewport width is below this, show the smaller image
-   If the viewport is above that, use the other image

I started off without the max-width query, but was always getting the larger image, which seemed to render correctly after I introduced this query.

[Eric Portis' comprehensive explanation](https://ericportis.com/posts/2014/srcset-sizes/) was great at getting me to think about how to do this, what I'm trying to do here is break it down to be something I can use in production without having to fry my little brain at the staggering genius that are the foundation tools of our trade."