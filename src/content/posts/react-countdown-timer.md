---
title: "Build a countdown timer using Temporal with React"
description: "As the Temporal API is now stable, and a specification compatible polyfill is available, I thought I would use Temporal to build a countdown timer in a React project."
tags: 
  - javascript
datePublished: 2026-01-04
---
As the [Temporal API is now stable at Stage 3](https://github.com/tc39/proposal-temporal), and a specification compatible polyfill is available, I thought I would use Temporal to build a countdown timer in a React project.

I had previously build this countdown timer without Temporal, but since the API I was using exposed [durations in ISO 8601 compatible strings](https://en.wikipedia.org/wiki/ISO_8601) it meant I was already [pulling in another library](https://www.npmjs.com/package/tinyduration) to handle those. So I thought I might as well utilise the [Temporal polyfill](https://www.npmjs.com/package/@js-temporal/polyfill) instead.


The API is pretty straightforward as you might imagine

```javascript
import countdown from 'countdown'
import { parse } from 'tinyduration'

const CountdownTimer = ({ startedAt: Date, duration: string }) => {}
```

You can probably guess where we're going with this, we'll use a `useEffect()` hook to run a `setInterval()` which refreshes the calculated `remainingTime` and sets it in `useState()`. We need to memoise the calculated ending time to persist across rerenders too:

```javascript
const [timespan, setTimespan] = useState<Timespan | null>(null)

const parsedDuration = parse(duration)

const {
  years = 0,
  months = 0,
  weeks = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
} = parsedDuration

const durationMs =
  years * 365 * 24 * 60 * 60 * 1000 +
  months * 30 * 24 * 60 * 60 * 1000 +
  weeks * 7 * 24 * 60 * 60 * 1000 +
  days * 24 * 60 * 60 * 1000 +
  hours * 60 * 60 * 1000 +
  minutes * 60 * 1000 +
  seconds * 1000

const endTime = useMemo(
  () => new Date(startedAt.getTime() + durationMs),
  [startedAt.getTime(), durationMs],
)

useEffect(() => {
  const updateCountdown = () => {
    const now = new Date()
    const result = countdown(now, endTime) as Timespan
    setTimespan(result)
  }

  updateCountdown()
  const interval = setInterval(updateCountdown, 1000)

  return () => clearInterval(interval)
}, [endTime])

const countdownHours = String(timespan?.hours ?? 0).padStart(2, '0')
const countdownMinutes = String(timespan?.minutes ?? 0).padStart(2, '0')
const countdownSeconds = String(timespan?.seconds ?? 0).padStart(2, '0')

return (
  <time 
    dateTime={`PT${countdownHours}H${countdownMinutes}M${countdownSeconds}S`} 
  >
    {countdownHours}:{countdownMinutes}:{countdownSeconds}
  </time>
)
```

If this seems a little verbose, it is. `tinyduration` only returns units of time if the parsed data has any, meaning you have to calculate around it. Also the library is not typed, meaning I had to implement my own.

If you're reading this you're probably familiar with the `countdown` library. In all honesty it doesn't do much at all apart from provide a duration until the end time you provide it.

This can all be achieved much more succinctly in the Temporal API.

## Switching to Temporal

The first change is to the types. Instead of a `string` or my own implementation of the result of the `tinyduration` library, I can use a type from `Temporal`:

```javascript
const [remainingTime, setRemainingTime] = useState<Temporal.Duration | null>(
  null,
)
```

The `endTime` memoised calculation is fairly similar, only using Temporal is a bit more clear about what's happening:

```javascript
const endTime = useMemo(() => {
  const startInstant = Temporal.Instant.fromEpochMilliseconds(
    startedAt.getTime(),
  )
  const durationObj = Temporal.Duration.from(duration)
  const totalMs = durationObj.total({ unit: 'millisecond' })
  return startInstant.add({ milliseconds: totalMs })
}, [startedAt, duration])
```
The first change here is to convert the start time to a [Temporal Instant object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Instant).

`Temporal.Duration` natively supports the ISO 8601 format, therefore calculating the total is a matter of converting the `duration` to milliseconds, and then using [`.add()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Duration/add) to calculate the sum.

So although `endTime` itself slightly more verbose, we didn't have all the setup and its easier to see what's going on. I much prefer my code that way since it makes it much easier for other developers to pick up later on.

Now for the `useEffect()` hook:

```javascript
useEffect(() => {
  const updateCountdown = () => {
    const now = Temporal.Now.instant()

    const remaining = now.until(endTime, {
      largestUnit: 'hour',
      smallestUnit: 'second',
      roundingMode: 'floor',
    })

    setRemainingTime(remaining)
  }

  updateCountdown()
  const interval = setInterval(updateCountdown, 1000)

  return () => clearInterval(interval)
}, [endTime])
```

This is much clearer as well: we instantiate a new Temporal `Instant` then use the [`.until()` utility](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Instant/until) to represent the duration from the current instant _until_ the end time.

The second argument allows us to format the remaining duration in place.

The final step is formatting and the render function:

```javascript
const countdownHours = Math.max(0, remainingTime?.hours ?? 0)
const countdownMinutes = Math.max(0, remainingTime?.minutes ?? 0)
const countdownSeconds = Math.max(0, remainingTime?.seconds ?? 0)

return (
  <time
    dateTime={`PT${countdownHours}H${countdownMinutes}M${countdownSeconds}S`}
  >
    {String(countdownHours).padStart(2, '0')}:
    {String(countdownMinutes).padStart(2, '0')}:
    {String(countdownSeconds).padStart(2, '0')}
  </time>
)
```

Temporal doesn't provide formatting operations suitable for this situation so we need `padStart()` and then `Math.max()` to ensure we don't go into negative values.

I'm using the raw data to set the `datetime` attribute as ISO8601 formatted string, then formatting it again to render the content of the element.

## Wrapping up

The function is now much shorter (56 to 83 lines) but that isn't the biggest win here.I'm only using one library, and that's a polyfill which can be removed eventually.

It's also much clearer. We're not using mathematical operations on milliseconds, instead treating times as their own separate entities. And I think the code is much  more readable too.

My only concern with this component is it doesn't announce to screen reader users when the time counts down. However we wouldn't want to annoy the user more by announcing every second.

An improvement could be that we add logic to announce the time left at meaningful intervals such as "10 minutes left", "1 minute left" etc.

All in all, the Temporal API is going to improve JavaScript a huge amount. I'm really looking forward to seeing how the landscape changes over the next few years.