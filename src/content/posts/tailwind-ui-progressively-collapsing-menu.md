---
title: "Tailwind progressively collapsing menu."
description: "When I first saw this method of being able to progressively hide individual navigation items instead of all of them, and to do so without the use of JavaScript, I was impressed with the idea. Here's a remix using Tailwind."
tags: 
  - css
datePublished: 2023-10-18
---
**I had the opportunity to rework one of my favourite codepens recently. When I first saw this method of being able to progressively hide individual navigation items instead of all of them, and to do so without the use of JavaScript, I was impressed with the idea. Here's a remix using Tailwind.**

The idea is to use `flex` to display the individual elements. At small breakpoints, the `flex-basis` is `100%`, meaning each item stretches to the full width of the container.

At medium breakpoints the `flex-basis` reverts to the initial value (`auto`), meaning they bunch up as blocks, much like they would if you [floated](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Floats) them.

If you then set a fixed `height` and hide the `overflow` content, you effectively hide the items that don't fit on the top row.

The `overflow` can then be toggled with a visually hidden checkbox and an accompanying `<label>` element (this is known as the ["checkbox hack"](https://css-tricks.com/the-checkbox-hack/)) that provides the functionality of a button.

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="dywEaBY" data-user="endymion1818" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/endymion1818/pen/dywEaBY">
  Tailwind Progressively Collapsing Navigation CSS Only</a> by Ben Read (<a href="https://codepen.io/endymion1818">@endymion1818</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## Caveats

There's a couple of caveats with this:

### 1. It's not accessible. 

This is probably the primary reason for not using it. We have hidden the checkbox and the label, because for screen reader users, they're not useful. I sincerely hope the navigation list is still useful to people with visual impairments. I've experimented with `focus-visible` to ensure all elements in the list are visible, but it is still quite jarring.

### 2. You can't automatically hide the "more" button

Without manually showing and hiding the toggle for the other items in the list, it will always show regardless of whether there are more items in the list or they are all on the page.

### 3. It's not easy to style the "dropdown"

Since this is an overflow area, it's not even part of a pseudo element. So changing the background only in the overflow area is not possible. And since we cannot know the height the overflow is going to be, we cannot easily make a pseudo element to fit that area.

## An interesting experiment

As I said before, probably don't use this in production. There's probably a very small edge case where it would be more useful than a nav that collapses at a certain breakpoint.

All in all, I still love the combination of CSS hacks that lets us do this sort of thing. It's what makes CSS such fun.