---
title: "Selecting parents of a nested element with the css :has selector"
description: "I was playing around with the :has selector recently and noticed it's got a pretty awesome feature: relative selectors."
tags: 
  - css
datePublished: 2023-12-20
---
I was playing around with the :has selector recently and noticed it's got a pretty awesome feature: relative selectors. They're [defined](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors/Selector_structure#relative_selector) as:

> a selector representing an element relative to one or more anchor elements preceded by a combinator. Relative selectors that don't begin with an explicit combinator have an implied descendant combinator.

That means that `:has()` is really smart, anything in the brackets behaves like it does in normal CSS.

This really helped me because my DOM structure looks something like:

```html
<div class="element">
  <div>
    <div>
      <div id="element-i-want-to-target">
```
According to [this stackoverflow answer](https://stackoverflow.com/questions/75823859/how-to-use-css-has-selector-for-nested-elements#answer-75824035), I would need to write something like:

```css
.element:has(div > div > div#element-i-want-to-target) {}
```

(This is Drupal by the way, which seems to love nested `<div>`s even more than React)

The trouble with that is that it didn't work as I had expected. It never targeted the element correctly, and after playing around I couldn't get it to respond correctly.

By chance experimentation I came up with this:

```css
.element:has(#element-i-want-to-target) {}
```
And it worked! Even though the targeted element was 3 `<div>`s deep, it's relative to the parent `.element`, and so `:has()` evaluated it as I desired.

This makes sense [given the MD docs](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors/Selector_structure#relative_selector), but it's still not all that clear, I wish that MDN would have shown the HTML structure along with its examples.

But it makes sense if you think about it: by using `:has()` you're scoping your CSS to the parent you're using it on; anything appearing _inside_ that pseudoselector works just like normal CSS does.

I do love these recent additions to CSS, it's made it so awesome to work with.