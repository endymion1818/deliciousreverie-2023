---
title: "Better Type Safety with JSDoc"
description: "This is a follow-up article to one I wrote a few months ago, and which quickly became the most popular article on my blog. I've learned a few more tricks, including how to ensure that types in events are respected."
tags: 
  - javascript
  - typescript
datePublished: 2024-07-18
---
**This is a follow-up article to one I wrote a few months ago, and which quickly became the most popular article on my blog. I've learned a few more tricks, including how to ensure that types in events are respected.**

[Here's a link to the first article](/posts/types-via-jsdoc-or-typescript)

One thing I struggled with when I started using JSDoc was how to type event handlers without TypeScript.

Take a look at the following code:

```javascript
const button = document.querySelector<HTMLButtonElement>("button#my-button");

button.addEventListener("click", (event) => {
  const toggleThis = event.target.closest(".toggle-container"); // TypeError: closest does not exist on type EventTarget
  sendToApi(JSON.stringify(event.detail)); // TypeError: detail does not exist on Element
});
```

With TypeScript, you can type the selector or event directly:

```typescript
const button = document.querySelector<HTMLButtonElement>("button#my-button");

button.addEventListener("click", ((
  // you don't need both of these, this is just an example
  event: MouseEvent
  ) => {
  const toggleThis = event.target.closest(".toggle-container");
  sendToApi(JSON.stringify(event.detail));
}));
```

We have to think a little bit differently with JSDoc. However, we can have _more_ type safety with JSDoc:

```javascript
const button = document.querySelector("button#my-button");

if(!button || button instanceof HMTLButtonElement) {
  return;
}

button.addEventListener("click", (event) => {
  const toggleThis = event.target.closest(".toggle-container");
  sendToApi(JSON.stringify(event.detail));
})

```
Why do I say _more_ type safety?

Because TypeScript is compiled away at run time. It doesn't make it into code that runs in a browser, because it's not valid JavaScript.

What would happen if the button wasn't in the DOM? Where's your static analysis now?

This is something that's very easy to miss if you're writing TypeScript because (a) you can easily _force_ the compiler to recognise the button is there (via a dirty `!` after the selector), resulting in (b) a possible error in production if the button isn't there for some reason (for example, some code that produces it has failed, some developer in another squad removed it without telling you, or somebody replaced it with a `<span>`).

It could be relatively easy to get into one of these situations ... JSDoc ensures that type safety is baked into your _production_ environments, not just your development code.

I've been using mostly JSDoc for the last 18 months, and I'm definitely preferring it to TypeScript. I would lean on TS for React still but other than that it's very robust. It's really sad that there isn't more documentation for it, and I think that causes a lot of people to steer towards TypeScript.

But if you have the luxury to choose, definitely consider using JSDoc.