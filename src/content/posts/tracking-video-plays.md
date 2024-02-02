---
title: Tracking video plays

description: "The scope of this project was to track how much of a video has been watched periodically, send the data to an API at regular intervals. Here's how I achieved that in a developer-friendly way."
tags: 
  - javascript
datePublished: 2023-11-16
---
**The scope of this project was to track how much of a video has been watched periodically, send the data to an API at regular intervals, to be able to track different video providers (YouTube, Vimeo and others), and to track multiple videos on a page, all of which could be playing simultaneously.**

It was a little tricky because each player sends different events in the course of a video play, for example when the video has been paused, that we would need to respond to.

Also to provide continuous tracking we sometimes need to call the player to return data, such as the video title (which can sometimes change mid-play), and the duration of play that has elapsed.

This was a rebuild project became necessary because the original codebase was very difficult to modify. It had the following issues:

1. The code had been written very poorly
2. There were no tests or types

In addition to the above, I wanted to make the new tracker with such good developer experience that it would be as easy as possible to understand the code. The aim was to leave it open to modification by other developers. This would increase the longevity of the tracker and reduce the time investment over the lifecycle of the project.

## First Principles

We had already decided to adopt JSDoc instead of TypeScript for our codebase. [I wrote a separate article about this if you're interested](https://deliciousreverie.co.uk/posts/types-via-jsdoc-or-typescript/).

In addition, I have been standardising all of our codebases to use ESModules and Vite, so it made sense to opt for Vitest for our testing suite across all projects.

The other thing I wished to change was that this script was  hosted on a domain as a text file, and from there pulled into applications that needed it. I didn't think this was robust enough for such a key part of our business, so after discussion we decided to bundle it as a package. 

This meant it could be versioned, and any rollbacks that were necessary could be done on a per-application basis and fixed forward instead of rolling back the tracker for every application simultaneously. 

The other advantage to this is that changes can be rolled out gradually instead of launching on all of our codebases at the same time.

The application would also not be bound to the global `window` scope. I didn't see any advantage to doing that. Instead, it would be called in the consuming application and maintain it's own context.

## Setup

With those rules established, I implemented the initial API for calling the tracker, which would look something like this for a HTML5 video:

```html
<video id="my-video">
  <source src="video.mp4">
</video>
```

You would initiate tracking by passing the element's `id` and the video type, in this case:

```javascript
tracker('my-video').setup('html5')
```

I'm not giving away too much here deliberately; there's a bunch of other stuff happening in the `tracker` function like plugins, event listeners and such, which are out of scope for this article. 

The main object of this function is to match the type of player (we call them "providers" for disambiguation) with specific code needed to listen to events from that player.

Our `setupProvider` contains an object that is keyed to all of our providers, and dynamically imports the configuration for that provider, like so:

```javascript
const providers = {
	youtube: async(elementId) => {
		const addYouTubeTracking = await import("./providers/add-youtube-tracking")
		addYouTubeTracking.default(elementId)
	}
	vimeo: async(elementId) => {
		...
	}
}

```

This makes it very easy to add a new provider. You need only instantiate the code for that player and add the appropriate designation to this object.

In the parent function we can parse this object and if there's no match inform the user:

```javascript
function setupProvider(provider, id) {
	const supportedProviders = Object.keys(providers)
	if(!supportedProviders.includes(provider)) {
		// handle the error
	}
	providers[provider](elementId)
}
```

I find object literals with this catch pattern very practical; as well as [being more performant](https://www.north-47.com/javascript-objects-why-how-compared-with-switch-case-and-if/#:~:text=Since%20the%20objects%20approach%20is,an%20old%20way%20of%20coding), it's easier to catch errors and results in less duplication of code.

Next, we set up the `addYouTubeTracking()` function to listen to events from that player. I leveraged the [YouTube Player API](https://www.npmjs.com/package/youtube-player) abstraction for querying the player:

```javascript

function addYouTubeTracking(elementId){
	// Check if the element exists in the DOM
	const element = document.querySelector(`${elementId}`)
	if(!element) {
		// handle error
	}
	// set up YouTube API
	player.loadVideoByUrl(element.src)
	player.on("ready", function() {
		// See below for details
		playerEvents("ready", elementId)
	})
}

```
Instantiating providers separately like this not only avoids having to load code that isn't used in our application but it also allows us to standardise an API for talking to the rest of the application. 

After this function, we have two significant pieces: `playerEvents()`, which can respond to events from every player in a uniform fashion, and `dataEvents()` which collates the data and passes it to an API.

## Responding to player events

To enable `playerEvents()` to do this, each `add[provider]Tracking()` passes down events and also a group of callback functions that provide standardised APIs for getting the title of the video, the elapsed duration and other useful information. It means we can call the provider and get accurate data as the play is progressing without having to wire them all up individually: the `playerEvents()` call looks more like this:

```javascript
const playerFunctions = {
	getElapsedDuration: () => player.getCurrentTime()
}

playerEvents("ready", elementId, playerFunctions)
```
Since the nomenclature of the elapsed duration varies from player to player, I'm handling that variation here in the same context. This saves developers from the mental overhead later, when they should only be concerned with the next stage of the application.

In the `playerEvents()` function I follow the same pattern as in `setupProvider()`, with an object enumerating the events and errors in case of unhandled events.

Here's an example of how we handle an event:

```javascript
play: () => {
  dataEvents("update", elementId, {
    action: "play",
    updated: Math.floor(Date.now() / 1000),
  });
},
```

Again, there's a lot more in this function that I'm not telling you about. Not shown is how use a `setInterval()` on a `play` event so we can call back to the provider and update the elapsed duration from the provider.

Other events that could be sent from the player are also handled here include `seek` (our user has skipped forward or backwards), `end`, `pause` etc.

## Parsing data events

`dataEvents()` follows the same pattern as the two previous functions. Yeah, I really like this method of indexing. But it's also practical: if a new developer comes into this code they should more easily be able to understand all of the logic in the application flow.

If it's a `play` event, we actually send an `update` event, since we should have already been sent a `new` event when the provider declared it was ready.

Just in case though, we check whether we have already collected data from this tracked video, and if not we call the `new` function to instantiate a new set of data.

How do we check whether we've heard from this tracked video before? Aha, this is one of my favourite pieces.

## One Direction for Data

No that's not the name of some electronic boy band.

To be able to maintain a unidirectional data flow, I use the browser `cache` API to store events that come in.

```javascript
    update: async () => {
      // do we already have a cache object for this?
      const cache = await caches.open(url);

      const cachedResponse = await cache.match(url);
		
		// looks like a no, let's create an initial event object
      if (!cachedResponse || !cachedResponse.ok) {
        dataEvents("new", elementId, null, incomingIndexes);
        return;
      }
      // if there's no old data or no valid data, we need to start over too
      const oldData = await cachedResponse?.json();
      const hasValidData = Object.keys(oldData[0]).length;
      
      if (!oldData || !hasValidData) {
        dataEvents("new", elementId, null, incomingIndexes);
        return;
      }

      // if the data is more than 4 hours old, we also want to start over
      const fourHoursAgo = Date.now() - 1000 * 60 * 60 * 4
      const isRecentData = fourHoursAgo > oldData[0].created;

      if(!isRecentData) {
      		// delete existing records
        cache.delete(url);
        // set it up again
        dataEvents("new", elementId, null, incomingIndexes);
        return;
      }

		// ok, we're good to go
		// This function overwrites the object retrieved from the cache with new values we obtained from the tracked event
      const outgoingIndexes = modifyTrackingData(
        oldData,
        updatedData,
      );
      
      // drop it into the cache
      cache.put(url, new Response(JSON.stringify(outgoingIndexes)));
		// Allamaraine!
      sendData(outgoingIndexes);
    },
```
Maintaining data in the cache comes with a warning. I provide a unique `url` string for the data object, and delete if it's more than 4 hours old. But even then we will have to be a little careful about when we release API changes.

However the advantages are clear: we can provide all of the data required by the API, updating it as the video progresses, and we're not jumping through the hoops of creating a new tracked event index each time.

## Conclusion

It's been really fun to use some new browser APIs on this project and to stretch the limits of my knowledge, particularly on how to handle events and different video platforms.

But what I really enjoyed was making this code with future me, and others, in mind. I hope that it will make this code robust enough (along with the tests and types I've created) so that it will last a long time and be malleable enough to fulfil other business needs in the future.