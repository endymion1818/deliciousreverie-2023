---
title: "How to Cache and De-duplicate Fetch Requests"
description: "If you have an application which makes many requests to the same API you can use a key to cache and de-duplicate requests. Here's how to do it."
tags:
  - javascript
datePublished: 2025-11-18
---

If you have an application which makes many requests to the same API you can use a key to cache and de-duplicate requests.

## Why might this happen?

Ideally you shouldn't encounter this situation. Your data layer or state should be a separate entity which components can subscribe to.

This is what React does: it hoists the state to a separate layer which can then be passed to each component.

But you know that already.

If you're using vanilla JavaScript you have some other options. You can use [TanStack Store](https://tanstack.com/store/latest/docs/framework/react/examples/simple) or some other third party.

But where's the fun in that?

## The implementation

Imagine we have a component that renders a chart. It should fetch data from our API to populate that data.

```javascript
import retrieveData from "@api/retrieve-data";

async function myChart() {
  const totals = await retrieveData("getTotals");
}
```

Simple enough.

This is where it gets complicated. This is one component in a complex dashboard that renders 10-20 different charts.

There are inputs on this chart too: users chan change date ranges, apply filters and all that good stuff.

Add to that there are several different pages to this dashboard, each of which involves a server re-render. There's no possibility of using a frontend router.

What would you do?

I created a CustomEvent to enable my components to re-render when a filter changed:

```javascript
import retrieveData from "@api/retrieve-data";

async function myChart() {
  const totals = await retrieveData("getTotals");
}
window.addEventListener("refreshState", () => myChart());
```

This allows me to keep my component focused on the UI and abstract state to the `retrieveData` component.

Let's take a look at that now.

## Retrieving Data

This is the basic implementation I ended up with.

I've leant on the URL query params as a central location to store updated state. That way I can de-couple the user input filters from the fetch request and still have them easily accessible:

```javascript
async function retrieveData(requestType, args) {
  const urlParams = new URLSearchParams(window.location.search);

  const dateFromFilter = urlParams.get("datefrom");
  const dateToFilter = urlParams.get("datefrom");
  const user = getUser();

  const cacheKey = `dashboard-action=${requestType}-user=${user}-from=${dateToFilter}-to=${dateToFilter}`;

  const cachedData = localStorage.getItem(cacheKey);

  if(cachedData) {
    return cachedData;
  }
  const freshData = await callApi(requestType, { user, from: dateFromFilter to: dateToFilter });

  localStorage.setItem(
    cacheKey,
    JSON.stringify(freshData)
  )

  return freshData;
}
```

So you can see we're setting a cache and returning that cached data if it still exists, otherwise fetching from the API and storing that data.

This is a good start, but it's going to get more complex.

Why?

Because it takes time for localStorage to save items. Meaning if we initiate 15 requests concurrently, each one could make an API request when it doesn't need to.

Let's dive into how we de-duplicate those requests.

## De-duplicate requests

If we have a dozen or so components on a page, and they sometimes use the _same_ data from the API, how do we reduce load on the API?

We can use the `cacheKey` above to store a request, and then create a queue for the requests:

```javascript
const inFlightRequests = new Map();

async function retrieveData(requestType, args) {
  const urlParams = new URLSearchParams(window.location.search);

  // ...

  const cacheKey = `dashboard-action=${requestType}-user=${user}-from=${dateToFilter}-to=${dateToFilter}`;

  // 1. Request is in progress, return that data
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  // 2. If we have cached data, return that
  const cachedData = localStorage.getItem(cacheKey);

  if(cachedData) {
    return cachedData;
  }

  // 3. IF not, get fresh data
  const freshData = await callApi(requestType, { user, from: dateFromFilter to: dateToFilter });

  // Then set everything else up
  inFlightRequests.set(cacheKey, retrievedData);

  localStorage.setItem(
    cacheKey,
    JSON.stringify(freshData)
  )

  inFlightRequests.delete(cacheKey);

  return freshData;
}
```

The `inFlightRequests` lives in the module scope which means it persists when the function is called.

It's also a `Map`, in which each item is stored by key-value pairs in which keys are unique. You can't have two keys the same in a `Map`.

[More details here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

## Expiring the Cache

Last bit is how to make sure we're not returning stale data. This is based on a few assumptions and might be different in your case. But I've gone for 30 seconds.

For me, thirty seconds is enough time for users to load a page, realise they're on the wrong page, and navigate to a different one, or to change their filters a few times before they figure out what data they actually want to see.

Also if the data is updated, I'm guessing it'll take more than 30 seconds to do that.

Let's see how we can expire the cache:

```javascript
function retrieveData() {
  // ...

  // Not using Temporal? You should look into that.
  const now = Temporal.Now.instant();

  localStorage.setItem(
    cacheKey,
    JSON.stringify({
      timestamp: now,
      data,
    })
  );
  if (cachedData) {
    const parsedCachedData = JSON.parse(cachedData);
    const thirtySecondsAgo = now.subtract({ seconds: 30 });

    if (cachedTime <= thirtySecondsAgo) {
      localStorage.removeItem(cacheKey);
      return;
    }
    return parsedCachedData.data;
  }
}
```

So now we have a timestamp which we can use to decide if the localStorage item is stale and discard it.

A word on Temporal. I'm using a polyfill alongside the browser implementation just now. It'll be implemented in everywhere else other than Firefox soon [now it's at Stage 3](https://tc39.es/proposal-temporal/#sec-temporal-objects).

## Conclusion

Being able to cache and de-duplicate requests has reduced API calls on certain pages of my application from 13 to 3.

Like I said at the start, hopefully you won't ever have to implement this yourself. But for those of us who are implementing complex applications in vanilla JS, I hope this helps.