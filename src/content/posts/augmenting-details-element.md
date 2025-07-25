---
title: "Augmenting the details element"
description: "I've found the details element superbly useful lately. I added only one or two things to make this useful element suit two very different use cases"
tags:
  - javascript
datePublished: 2025-07-23
---

**_I've found the details element superbly useful lately. I added only one or two things to make this useful element suit two very different use cases_**

I recently rebuilt some dropdowns with a very minimal amount of JavaScript, and most of that is to support Safari's lack of support for the `:marker` pseudoelement.

Previously, we had a structure similar to this:

```html
<nav>
  <ul>
    <li>
      <button type="button" aria-controls="mega-menu-one-dropdown" aria-expanded="false" id="mega-menu-one-button">
        link parent
        <svg class="caret"></svg>
      </a>
      <div id="mega-menu-one-dropdown" aria-controlledby="mega-menu-one-button" aria-expanded="false">
        // sub-nav content, which is huge
        <ul>
          <li>
            <a href=#>
              link child
            </a>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</nav>

```

As you might imagine this was difficult to deal with and since it was generated dynamically, very hard to reason about.

Next to that of course we had a bunch of JS that would do the following when one of the buttons were clicked:

1. Update the `aria-role` on the button
2. Rotate the SVG caret on the button
3. Update the `aria-role` on the dropdown element
4. Reset the `aria-role` on other buttons
5. Reset the `aria-role` on other dropdown elements

The HTML for something like this would be

```html
<div
  id="mega-menu-one-dropdown"
  aria-controlledby="mega-menu-one-button"
  aria-expanded="false"
  class="tw-hidden aria-expanded:tw-block"
></div>
```
And we didn't actually just do this. In my first iteration of JavaScript I neglected to notice that you can add modifier Tailwind classes to the HTML so that when `aria-role`s change, different styling can be applied:

Instead I was doing the following:

```javascript
button.addEventHandler("click", () => {
  ["tw-hidden", "tw-block"].forEach((classListItem) =>
    dropdown.classList.toggle(classListItem)
  );
});
```

Yeah, probably don't do that.

Since it received a design refresh, I took the opportunity to simplify it significantly.

## The Refresh

Now with the details element the markup looks a lot more sane, although to be honest it's always going to be quite complicated:

```html
<nav>
  <details>
    <summary>
      Link parent
      <svg class="caret"></svg>
    </summary>
    <div>
      <ul>
        <li>
          <a href="#"> link child </a>
        </li>
      </ul>
    </div>
  </details>
</nav>
```

This is a lot easier to reason about, `aria` roles are built in, and the functionality is identical to the user.

## Safari

I'm not going to belittle Safari here. It's a solid browser and Jen Simmons and the team have worked hard to get it to feature parity with other browsers. Their release cycle might be a bit slower but it's a formidable tool.

I did find that I needed some extra JS to support just one thing: updating the `<svg>` caret style, which needs to rotate 180 degrees to indicate the collapsible section is open.

I elected to scope this to Safari only. This is because I want the developer who comes to this file in 2 years time to instantly see which lines they can now delete:

```javascript
/**
 * @see https://caniuse.com/css-marker-pseudo
 * To polyfill the css ::marker pseudo element
 * so that SVG carets can rotate when <details> elements
 * are expanded. Can be deleted when this is supported in Safari
 */
const isSafari =
  navigator.userAgent.indexOf("Safari") > -1 &&
  navigator.userAgent.indexOf("Chrome") === -1;

detailsElement.addEventListener("toggle", () => {
  isSafari &&
    detailsElement.classList.toggle("details-open", detailsElement.open);
});
```

Yes, I'm a fan of clear signposting.

Now that we have this class, we can use it to toggle the rotation on the SVG.

## Styling

Unfortunately Tailwind v3 doesn't seem to support the `open` attribute natively, and we don't have capacity to upgrade to v4 just now. So I had to bake this into the CSS like so:

```css
details:open > summary svg.caret {
  @apply tw-rotate-180;
}
/* Safari workaround: 
 * use .details-open class via JS instead of :open pseudo-class 
 * @see https://caniuse.com/css-marker-pseudo
 * Remove if safari now supports this
*/
.details-open > summary svg.caret {
  @apply tw-rotate-180;
}
```

## Closing other details

The one thing I did add was that when you open one menu item, the others should close.

```javascript
document.addEventListener("click", (event) => {
  detailsElements.forEach((detailsElement) => {
    if (event.target.closest("details") === detailsElement) {
      return;
    }
    detailsElement.open = false;
    isSafari && detailsElement.classList.remove("details-open");
  });
});
```
Instead of handling this when a `<details>` element is clicked however, I put it on a document listener. Reason being that I wanted to also close the other elements when someone clicks elsewhere on the document: 

## Details is great!

When we roll this out to our sites it'll achieve the following:

1. It'll require less custom JS
2. The code will be easier to follow at a glance
3. Browsers will handle aria
4. There's less chance it'll break when changed
5. The elements have more semantic meaning

I'm so looking forward to more elements like this, including spicy sections, and especially carousels.