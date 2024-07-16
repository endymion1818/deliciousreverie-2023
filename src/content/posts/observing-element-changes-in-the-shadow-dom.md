---
title: "Observing Element Changes in the Shadow DOM"
description: "DOM content isn't always loaded in top-to-bottom. Custom elements sometimes need to wait for API calls, and sometimes you might instantiate some of the DOM elements via JavaScript. Here's a handy function to observe those changes"
tags: 
  - javascript
datePublished: 2024-07-16
---
**DOM content isn't always loaded in top-to-bottom. Custom elements sometimes need to wait for API calls, and sometimes you might instantiate some of the DOM elements via JavaScript. Here's a handy function to observe those changes**

Working with large Drupal sites is interesting from a management perspective. It does do a lot of AJAX calls to the backend, and sometimes that might result in the DOM structure changing because of that call.

But this happens a lot in complex applications, and isn't limited to apps managed by PHP. For example, sometimes we need to, or want to do something similar to this:

```javascript
const container = document.querySelector('put-stuff-here');

container.appendChild(`<div>${someVarible}</div>`);
```

Or sometimes it's more complex, where you have a custom element that has to be registered, and perhaps has to fetch some data before it renders.

I found myself needing to hook into these state changes a few times recently. Quite often, a `mutationObserver` was enough to do the trick. However it does contain quite a bit of boilerplate:

```javascript
/**
 * Wait for an element to be added to the DOM.
 * @param {ShadowRoot | Document} root - The root to observe.
 * @param {string} selector - The selector of the element to wait for.
 * @returns {Promise<HTMLElement | any>} - A promise that resolves with the element when it is added to the DOM.
 */
function waitForElement(root, selector) {
  return new Promise((resolve) => {
    let element = root.querySelector(selector);
    if (element) {
      resolve(element);
    } else {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            element = root.querySelector(selector);
            if (element) {
              observer.disconnect();
              resolve(element);
            }
          }
        });
      });

      observer.observe(root, { childList: true, subtree: true });
    }
  });
}
export default waitForElement;
```

This is more or less [straight from the docs](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver), but 2 things are missing: shadowDOM support (something I use a lot) and some way of resolving the promise to stop it from running indefinitely.

```javascript
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.matches(selector)) {
            observer.disconnect();
            clearTimeout(timeoutId); // Clear the timeout
            resolve(node);
          } else if (node.shadowRoot) {
            const shadowElement = node.shadowRoot.querySelector(selector);
            if (shadowElement) {
              observer.disconnect();
              clearTimeout(timeoutId); // Clear the timeout
              resolve(shadowElement);
            } else {
              observer.observe(node.shadowRoot, { childList: true, subtree: true });
            }
          }
          element = root.querySelector(selector);
          if (element) {
            observer.disconnect();
            clearTimeout(timeoutId); // Clear the timeout
            resolve(element);
          }
        }
      });
    }
  });
});
```
My issue with this is there are lots of nested `if` statements going on here, I might try to tidy that up soon.

But essentially it works the same by checking for the existence of a `shadowRoot` and resolving the element if it's found there.

There's only one other thing we need to fix, which is to ensure it doesn't keep running indefinitely if the element doesn't show up in a reasonable amount of time.


## Timeout

Ahh good old timeouts. I'm trying to think if there's a better way to do this. 

Let's wait for a timeout of 1 second to expire and then `reject` and disconnect the observer:

```javascript
observer.observe(root, { childList: true, subtree: true });

// Set a timeout to reject the promise if the element is not found within 1 second
const timeoutId = setTimeout(() => {
  observer.disconnect(); // Stop observing when the timeout expires
  reject(new Error("Element not found"));
}, 1000);
```
Putting this together we can observe elements across the normal DOM and the shadow DOM, and provide a slim implementation on top of `mutationObserver` so we can be certain the element exists before we try to do something like attach a listener or modify it in some other way.

Here's how to implement it:

```javascript
const myElement = waitForElement(parent, 'my-element');

```

Here's the full code, with an additional parameter to change the timeout if you like. Happy copypasta!

```javascript
/**
 * Wait for an element to be added to the DOM or shadow DOM.
 * @param {ShadowRoot | Document} root - The root to observe.
 * @param {string} selector - The selector of the element to wait for.
 * @param {number} [timeout] - The time in milliseconds to wait before rejecting the promise.
 * @returns {Promise<HTMLElement | Node>} - A promise that resolves with the element when it is added to the DOM or shadow DOM.
 */
function waitForElement(root, selector, timeout = 1000) {
  return new Promise((resolve, reject) => {
    let element = root.querySelector(selector);
    if (element) {
      resolve(element);
    } else {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.matches(selector)) {
                  observer.disconnect();
                  clearTimeout(timeoutId); // Clear the timeout
                  resolve(node);
                } else if (node.shadowRoot) {
                  const shadowElement = node.shadowRoot.querySelector(selector);
                  if (shadowElement) {
                    observer.disconnect();
                    clearTimeout(timeoutId); // Clear the timeout
                    resolve(shadowElement);
                  } else {
                    observer.observe(node.shadowRoot, { childList: true, subtree: true });
                  }
                }
                element = root.querySelector(selector);
                if (element) {
                  observer.disconnect();
                  clearTimeout(timeoutId); // Clear the timeout
                  resolve(element);
                }
              }
            });
          }
        });
      });

      observer.observe(root, { childList: true, subtree: true });

      // Set a timeout to reject the promise if the element is not found within 1 second
      const timeoutId = setTimeout(() => {
        observer.disconnect(); // Stop observing when the timeout expires
        reject(new Error("Element not found"));
      }, timeout);
    }
  });
}
export default waitForElement;
```