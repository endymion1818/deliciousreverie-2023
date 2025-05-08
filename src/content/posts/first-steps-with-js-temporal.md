---
title: "First steps with the Temporal API"
description: "Dates in JavaScript are changing forever: The Temporal API is now at Stage 4, which means it's stable, and there's a polyfill available. It's time to start getting familiar with the API."
tags: 
  - javascript
datePublished: 2025-05-08
---
**Dates in JavaScript are changing forever: The Temporal API is now at Stage 4, which means it's stable, and there's a polyfill available. It's time to start getting familiar with the API.**

One thing I do a lot of is converting dates that are stored using Epoch dates. These are numbers that represent every millisecond since 1 January 1970. At the time of writing, the digit for the current epoch date was 1746706628000. A second later it was 1746706629000. And so on. 

If you'd like to know more about epoch timestamps, this is a good resource: https://www.epochconverter.com/

These are ideal for storing data, but we've always had issues calculating these into dates in our applications because of time zones and locations.

Temporal is much better because you don't need to load extra JavaScript that you'd ordinarily have to get from a package: one of the most popular is moment.js.

But these packages tend to be fairly large in size. You could roll your own functions but ... they tend to be challenging reason about and difficult to maintain.

## Polyfilling

There are [two spec-compliant polyfills](https://www.npmjs.com/search?q=temporal%20polyfill) for Temporal, one of which I'm using until browsers are updated, at which point it should be just a case or removing the import.

```javascript
import { Temporal } from '@js-temporal/polyfill'
```
## Converting Epoch timestamps using Temporal

The first solution I needed was to convert that epoch date mentioned above into a datetime object so that I can then localise it.

Temporal has that easily covered:

```javascript
const timeInstant = Temporal.Instant.fromEpochMilliseconds(1746706629000)
```
If you log this out you get a new `Temporal.Instant` type with the milliseconds and nanoseconds properties. Not useful at this point but an important step nonetheless. It's now a Temporal instance, much like `new Date(mydate)` converted a string into a Date.

But what if your Epoch date uses _seconds_ instead of milliseconds? `Temporal.fromEpochSeconds()` doesn't exist, so you need to manually turn the number into milliseconds:

```javascript
const timeInstant = Temporal.Instant.fromEpochMilliseconds(1746706629 * 1000)
```
Now we've got a Temporal instance, the next step is to convert this into a date that is human-readable and localised.

## Localising

To localise a date we need to do three things:

1. Set a format to present the date
2. Set a `locale` that can be used to arrange the dates (this will determine, for example, if it's DD/MM/YYYY, or MM/DD/YYYY which is US style.)
3. Set the local time so that it reflects the users time, accounting for daylight savings etc

```javascript
const localisedDate = timeInstant.toLocaleString(
  'en-GB',
  {
    timeZone: 'Europe/London',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }
)
```

## Temporal is going to save you time

Hah, see what I did there. But yes, kilobytes of extra JavaScript gone from your projects. A standard way to modify dates. And no more wrangling with `Date()`. That's what you can look forward to with the Temporal API.

