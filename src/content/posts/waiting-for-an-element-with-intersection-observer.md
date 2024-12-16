---
title: "Waiting for an Element to appear in the DOM or shadow DOM with intersectionObserver"
description: "An asynchronous solution which waits for elements to appear in the document. Covers both a normal Document and the Shadow DOM."
tags: 
  - javascript
datePublished: 2024-12-16
---
**An asynchronous solution which waits for elements to appear in the document. Covers both a normal Document and the Shadow DOM.**

I've been working extensively with asynchronous HTML loading lately. Normally there are built-in APIs you can use to hook into when DOM elements are available. But a few times lately, my code has run outside of those APIs. So my friends* and I came up with this solution.

^ my friends included GitHub Copilot

## A Drupal Project

If you're writing JavaScript for a Drupal project, youll notice that Drupal loads the DOM asynchronously. This is because it can have normal taxonomies and content, but also featured queues, which as I understand it, can get quite complex and need to be retrieved from the database. This can result in DOM elements being loaded out of order.

If you're wanting to animate those elements, say for instance in a carousel, that's going to prove challenging. 

Drupal ships with it's own solution for this, `once()`, which I understand it is originally [a jQuery thing](https://plugins.jquery.com/once/).

So if you're in Drupal-land, you might want to use that.

## Any project

Although my project _was_ Drupal, my code existed outside of that ecosystem as a standalone project. Therefore I rolled this code.

Let's walk through it.

## Getting up and running

```javascript
async function waitForElement(root, selector, timeout = 1000) {}
```

The arguments in the function are `root`, the root element. This is usually the `document`, however as you'll see in the implementation there could be other situations where that's not true.

For example, I can pass in a shadow Root, which is particularly handy for hooking into Web Components. I've built a complex one as part of this application which I hope to blog about sometime.

Then we have the `selector`. This is the selector for the element you're waiting for as a string.

Lastly, we have a `timeout`. This sounds awful to start with but we don't want this thing running in the background forever, so the timeout of course means we can resolve after a reasonable amount of time has passed.

This is hazardous I know. If we're on slower networks, it's going to take longer to load, meaning it could very easily timeout before the element appears.. what can I say, sometimes stuff fails.

## Promises made to be broken

```javascript
return new Promise((resolve, reject) => {
  let element = root.querySelector(selector);
  if (element) {
    resolve(element);
    return;
  }
```

We're setting up a new `Promise` so that we can `resolve` it with the element if we need to, or `reject` it if if fails. You could also instead return `null` in the case of failures and handle it in the application.

Next I check to see if the element is already there. It might have loaded already after all!

## Observing mutations

Hmm now I sound like some DNA mad scientist. Promise this isn't going to get icky. Much.

```javascript
const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
```

So we're `new`ing up a `MutationObserver`. A mutation is triggered when anything in the DOM changes, and allows you to write a callback for when that happens.

```javascript
if (mutation.type !== "childList") {
  return;
}
```

Because it fires on _every_ mutation we need to filter for the ones we're looking for. They can be _different types_ of mutation, but we're looking for a `childList`, as opposed to changes in text or attributes of an element.

Next we need to cycle through each of the `addedNodes` to filter through them and discover if they might include our element. However, we also need to filter out a few more things:

```javascript
mutation.addedNodes.forEach((node) => {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return;
  }
```
Firstly, if it's an `ELEMENT_NODE`, so a DOM element instead of a comment block (`<!--- this sort of thing --->`) or the `document` itself, then we break out of the `forEach` early, since we're only looking for those.

However if it is we might have a warranted early success.

## Early success

Let's be optimistic, if the first valid mutation _is_ the selector we're waiting for, then we have a win. However of course this might not be the first time our `oberver` has been called, in which case we might need to cancel the timeout. It would also be sensible to disconnect the observer at that point.


```javascript
if (node.matches(selector)) {
  observer.disconnect();
  clearTimeout(timeoutId);
  resolve(node);
  return;
} 
```

## Check if shadow root

If we haven't yet found the element we should first check if the node is in the shadow DOM, and whether we have it in this mutation:

```javascript
if (node.shadowRoot) {
  const shadowElement = node.shadowRoot.querySelector(selector);
  if (shadowElement) {
    observer.disconnect();
    clearTimeout(timeoutId);
    resolve(shadowElement);
    return;
  }
}
```
Otherwise we should also set up an observer for the shadow root to see if it is going to appear there: 

```javascript
observer.observe(node.shadowRoot, {
  childList: true,
  subtree: true,
});
```

Next, let's check if the element we're looking for is within the root now that it's been updated. If so we can resolve that element and disconnect the observer.

```javascript
element = root.querySelector(selector);
if (element) {
  observer.disconnect();
  clearTimeout(timeoutId);
  resolve(element);
}
```

## Listening for further changes

Now we have the substance of our observer we need to set it off by calling `observe` which will keep watching the root element we supplied. That way any other changes will reveal whether the element we're looking for has arrived in the DOM:

```javascript
observer.observe(root, { childList: true, subtree: true });
```

In my example we watch the `childList` and the `subTree` in case the element appears as a descendent of the parent and not a direct child. If you know that it's going to be a direct child of the element you don't need to supply these options. 

## Timeout

As we mentioned before, we don't want this to keep running indefinitely. At some point the DOM is going to either finish loading or we're going to have to stop waiting.

```javascript

timeoutId = setTimeout(() => {
  observer.disconnect();
  reject(`Element not found: ${selector}`)
}, timeout);
```

This way we disconnect the observer and we can either return and handle the error here or as I've done pass it up the call stack with a `Promise.reject()`.

In this case you'll need to wrap a call to `waitForElement()` with a `try {} catch {}` block.

So the flow for this is that if the element isn't found immediately we'll call the `observer`, then set a timeout to disconnect if it isn't ultimately found.

## Happy Copypasta

Here's the full code which you can exploit to your heart's content.


```javascript
/**
 * Wait for an element to be added to the DOM or shadow DOM.
 * @param {ShadowRoot | Document} root - The root to observe.
 * @param {string} selector - The selector of the element to wait for.
 * @param {number} [timeout] - The time in milliseconds to wait before rejecting the promise.
 * @return {Promise<HTMLElement | Node>} - A promise that resolves with the element when it is added to the DOM or shadow DOM.
 */
function waitForElement(root, selector, timeout = 1000) {
  let timeoutId;
  return new Promise((resolve, reject) => {
    let element = root.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type !== "childList") {
          return;
        }
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) {
            return;
          }
          if (node.matches(selector)) {
            observer.disconnect();
            clearTimeout(timeoutId);
            resolve(node);
            return;
          }
          const shadowElement = node?.shadowRoot?.querySelector(selector);

          if (shadowElement) {
            observer.disconnect();
            clearTimeout(timeoutId);
            resolve(shadowElement);
            return;
          }
          if (node.shadowRoot) {
            observer.observe(node.shadowRoot, {
              childList: true,
              subtree: true,
            });
          }
          element = root.querySelector(selector);
          if (element) {
            observer.disconnect();
            clearTimeout(timeoutId);
            resolve(element);
          }
        });
      });
    });

    observer.observe(root, { childList: true, subtree: true });

    timeoutId = setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element not found: ${selector}`));
    }, timeout);
  });
}
export default waitForElement;

```