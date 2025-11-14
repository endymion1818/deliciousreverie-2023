---
title: "Lessons from refactoring a large dashboard application"
description: "Over the past few months I've been refactoring a large application. I learned a few things from doing it, and thought they might help someone else."
tags: 
  - javascript
datePublished: 2025-12-01
---

Over the past few months I've been refactoring a large application written in vanilla JavaScript. I learned a few things from doing it, and thought they might help someone else.

## Lesson 1: Don't do it all at once

One of the first things I did was to add bundling so I can type check and set up a test suite. I also moved to ECMAScript modules which would also help me split my JavaScript into smaller modules later on.

Of course, once you add things like that it becomes apparent that there are a lot of changes you need to make.

That first PR I made quickly led to over 300 files changed. That's going to be extremely difficult for someone to review.

After this we decided to make a feature branch. Then I would incrementally branch off that and open PRs against the feature.

This goes a bit against the grain, I dislike trunk-based development. However for a project this large and a rewrite this extensive, it was the only practical way it could be segmented and reviewed.

Having a feature branch allowed me to reduce the change size. I'm not saying it was always manageable for the code reviewers, but it was at least manageable on some level.

## Lesson 2: Don't be afraid to be brutal

I had a clear philosophy in mind with this project: it should be modular.

It seems the original concept for the project was built that way: it consisted of a series of components that would render charts, table data and other statistics (text percentages, counters and date information).

However this philosophy seemed to have been abandoned in favour of a single, massive function that was responsible for fetching all of the data, transforming it, then passing it to components.

I could see the intent of this function: the developer wanted to reduce requests that were made to the API.

What was less clear was what data went where in the application. In fact, sometimes it was impossible to figure it out.

All data resulting from the API requests were first transformed into other structures, then channeled through a `CustomEvent` that bundled up the resulting data into an _array_ of Promises which was then attached to the `event.data`.

This made it very difficult to see on a component level what was API data, what was modified data, and even where it had come from.

But the core concept, a `CustomEvent`, which could be triggered by a user input, I thought was a good way of handling state refreshes, so I kept that.

I made each of my components responsible for their own data, and implemented two things on the fetch that would reduce load on the API: caching in `LocalStorage` and a queue that would, my means of a key, identify duplicate requests and return data from `LocalStorage` if they existed there.

This led to deleting a major chunk of the old data fetching strategy. I was so glad to see it go. But it did leave holes in my application that I had to reimplement later.

It was a brutal change but reduced the applications' complexity by an order of magnitude.

## Lesson 3: Types are your friends

I had to build all of the types from the ground up for this application. It was a struggle to figure out what on earth was going on, and sometimes even where the types would change in the original application. There were type collisions everywhere, no consistent naming convention, and variables were being overwritten all over the place.

But had I not made the effort to collect those original types it would have been much more challenging to refactor later on. That refactor implemented a different API with significant type changes, which led me to delete all of the types I had collected on this first pass. But without them I think it would have taken longer. At least I could see more easily where the differences were and knew more quickly what to change.

Additionally, previous developers on this project were _very fond_ of using the global scope. They would import a JavaScript library and attach it to the `window`. This meant doing things like 

```javascript
const chart = new Chart()
```

Depending on your experience you might not recognise that this is in actual fact

```javascript
const chart = new window.Chart()
```

Aha now we can type it.

```typescript
declare global {
  interface Window {
    Chart: new(ctx: ChartContext, config: ChartConfig) => void
  }
}
```

What is not fun _at all_ is doing that with JQuery. If you find yourself in that unfortunate position, `JQueryStatic` is your friend. And don't ask about mocking jQuery for unit tests ... wow that was awful.


## Lesson 4: Know when to bend the rules

In the original implementation there were 2 separate codebases, one for a dashboard for individuals, another dashboard for teams.

I can see why this was done: the teams module was somewhat independent of the main dashboard and I guess the original author decided it couldn't be counted on to be present.

However with bundling we could now `import` from the main codebase and reduce the technical debt by a significant amount.

Many of the components went down from a few hundred lines to an import and a function call that passed down the team data that I needed.

I thought this was a tradeoff that _kind of_ broke the rules of separation of concerns, but due to the fact that we were calling the same APIs, and rendering data with a lot of shared implementations, I judged that it would reduce the work that needed to be done to maintain the modules over time.

## Lesson 5: Don't rely on AI to write your tests

I'm going to try not to get salty here. AI did help me get started with a test suite. I managed to get it to mock my data and functions that were called in the implementation, and often it was quite close to what I wanted.

But it never implemented data structures that even remotely matched the implementation. This was bad because the unit tests are _documentation_. For me one of the main reasons I put a test suite in there was to show other people coming across this project later how the components were being used. If the data structure used in the test isn't representative of the real set, it undermines it's usefulness.

Plus it really wasn't that smart and often I had to debug really difficult issues. Sometimes it even just put code comments around stuff that was already there, as if it thought I was lying or something.

Use AI by all means. But only with careful guardrails. And don't let it loose on your codebase without carefully reviewing what it's changed.

## Browsers have a lot of what you need

Even though I implemented bundling I really didn't import that many packages. The main one was a polyfill for the `Temporal` API since that's not out everywhere yet and I wanted to lean on that instead of implementing Moment or some other large external library.

As this was a vanilla JS application I had to think carefully about state management. I split this between the LocalStorage API and the URL. Using the URL as a state manager is really good by the way. It also meant that if users have a problem later they can share their URL which will give us a lot of information about their dashboard.

Also, utilising `CustomEvents` was great. I didn't choose to pass any data down using these events, but I used them as triggers: when a user updated some filters, changed dates, or updated their data, I could tie into the save event, do a `dispatchEvent(new CustomEvent("refreshDashboardState"))`, and each of my components, because they were listening for it, would reload nicely:

```javascript
function renderMyDashboardComponent() {}

window.addEventListener("refreshDashboardState", () => renderMyDashboardComponent())
```

Simples.


## Conclusion

This project has been my focus for a long time and it feels somewhat like the Ship of Theseus now that it's all done.

What hasn't changed ironically is the way users will experience it. Aside from a few helpful updates for developers (caching can skipped by appending a query string to the URL, which will really help our Helpdesk team), it looks the same.

But it uses an entirely new backend data source. And in future, any further change requests (of which we receive many) can be implemented swiftly without me running for the hills.