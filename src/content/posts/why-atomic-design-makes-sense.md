---
title: "Why Atomic Design Makes Sense"
description: "Although I've really gotten into the SASS revolution, I haven't yet adopted a method for structuring elements of CSS. I guess it's because none of them strike me as particularly visual, and being a former print designer, I tend to think in those terms. But something about Brad Frost's Atomic Design principles makes sense to me. Here's why."
tags: 
  - css
datePublished: 2015-11-23
---
Although I've really gotten into the SASS revolution, I haven't yet adopted a method for structuring elements of CSS. I guess it's because none of them strike me as particularly visual, and being a former print designer, I tend to think in those terms. But something about Brad Frost's Atomic Design principles makes sense to me. Here's why.

When we're designing, we tend to think more about design principles instead of build principles. What I mean is that we think about rhythm, white space, alignment and these types of things. These are very necessary components of great web design as they are of design in other mediums.

But the web is still a unique animal. If we're truly going to design for the web, we need to think about the medium itself, much as a printer considers the stock, the inks, and the situation artwork is going to be displayed in.

### [https://atomicdesign.bradfrost.com](https://atomicdesign.bradfrost.com/) [#](https://deliciousreverie.co.uk/posts/why-atomic-design-makes-sense/#https:atomicdesign.bradfrost.com)

Atomic design really helps at this level: it helps us design repeatable elements that can be coded and re-used on different parts of our site. I don't intend to re-hash Atomic principles here, but take a look around, [perhaps at this post](https://blog.invisionapp.com/atomic-design-principles/), or [read a pertinent excerpt from the book](https://atomicdesign.bradfrost.com/chapter-2/#atomic-design-is-for-user-interfaces), to see what I mean.

This is going to really help us when it comes to building things out in code, especially if it's someone else building it.

## Thinking Like Developers [#](https://deliciousreverie.co.uk/posts/why-atomic-design-makes-sense/#thinking-like-developers)

This is important. I don't personally think it's a requirement for designers to be able to code — but I do believe we need to think like developers. If we comprehend the way a developer approaches a project, we'll see that system-based thinking (rather than individual page-based thinking) actually helps us get a product that reflects our design intentions more completely.

And we'll also be able to empathise with our developers, which means greater understanding, greater cooperation and - again - much better result, not just in appearance but in cleaner, more efficient code that has performance benefits.

And website performance is part of our job too, right?

## Atomic Design as a Developer [#](https://deliciousreverie.co.uk/posts/why-atomic-design-makes-sense/#atomic-design-as-a-developer)

As a developer, I'm wondering if I use SASS partials to structure my code. Perhaps defining files this way:

for atoms:

-   a-type
-   a-colors
-   a-inputs

for molecules:

-   m-card
-   m-navbar
-   m-lists
-   m-formfields

for organisms:

-   o-navbar
-   o-contactform
-   o-banner

and so on..

Hm, ok I'm going to try this. Hope to give you a development update in due course."