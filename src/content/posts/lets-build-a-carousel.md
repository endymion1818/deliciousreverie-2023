---
title: "Let's build a carousel!"
description: "Carousels are a staple of web development life. And thankfully, there are a lot of good off-the-shelf ones ready to build into your project. But it's a good challenge to see if you can build one yourself."
tags: 
  - javascript
datePublished: 2023-05-13
---
**Carousels are a staple of web development life. And thankfully, there are a lot of good off-the-shelf ones ready to build into your project. But it's a good challenge to see if you can build one yourself.**

This is somewhat of a personal milestone for me: I remember when I was a new software engineer tinkering with different solutions thinking that I probably would never be able to build one from scratch. But, here it is, I did it in a couple of days.

This helped me to see that I'm still making progress as an engineer and learning new things.

But maybe you just want to build a carousel ... if so, we first need to carefully consider whether a carousel is the best option for what we need to display. Carousels are very often not the solution you want: [please check out this site for some statistics](https://shouldiuseacarousel.com/). If you have decided a carousel is best for your UI, then read on.

## HTML setup

I'll start with explaining the HTML layout here. I'm using Tailwind because that is what I was using at the time, but you can use whatever CSS you like.

First, we have an opening tag:

```html
<div id="animation-carousel" class="tw-relative tw-w-full tw-h-36 md:tw-h-96 tw-my-8" data-carousel>
```

A few things of note: We're going to use a lot of [relative](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Positioning#relative_positioning) and [absolute](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Positioning#absolute_positioning) positioning here. To make sure that is scoped to this container, we're making sure the position is relative. And because each item is going to be positioned in this way, we're setting a height too.

Lastly, we're setting a data attribute. This is what we're going to pick up in the JavaScript. I could just as easily have used a class name.

Next, I've got the inner wrapper. This will contain the images, previous and next buttons, and indicators (the little navigation pips you sometimes see).

```html
  <div class="tw-relative tw-overflow-hidden tw-rounded-lg tw-h-36 md:tw-h-96">
```

### Indicators

Indicators are optional in this setup. If they're not in the DOM, we won't render them. To facilitate that, I've used a template tag so they don't render initially, rather, we can clone this template's inner HTML as many times as we need to render the pips:

```html
      <div id="indicator-container" class="tw-absolute tw-z-30 tw-flex tw-space-x-3 tw--translate-x-1/2 tw-bottom-5 tw-left-1/2">
        <template id="carousel-indicator">
          <button type="button" class="tw-w-3 tw-h-3 tw-rounded-full tw-border tw-border-white" aria-current="false" aria-label="Slide 1" data-carousel-slide-to="0">
            <svg viewBox="0 0 100 100" class="tw-text-white" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" fill="currentColor" stroke="white" stroke-width="3"/>
            </svg>
          </button>
        </template>
      </div>
```

Template tags aren't ordinarily rendered by the DOM tree but we can still select them with JavaScript. This is a handy feature as you'll see later. We've got a button with an SVG circle in there so we can click to select a certain slide.

Each of these has an aria label to indicate which item is focused on. I could have used a visually hidden text label.  

Next come the items themselves.

### Slides

The slides have an opacity of zero to start with - except the  item we wish to set as initially active. We do this so that if there's a problem with the JavaScript loading, the user will still see one image and not just an empty part of the screen:  

```html
      <div class="tw-opacity-0 tw-transition tw-duration-150 tw-ease-in-out tw-h-36 md:tw-h-96" data-carousel-item="active">
          <img src="https://placehold.co/600x400/orange/blue" alt="..."  class="tw-absolute tw-block tw-w-full tw--translate-x-1/2 tw--translate-y-1/2 tw-top-1/2 tw-left-1/2 tw-h-36 md:tw-h-96">
          <div class="tw-absolute tw-inset-0 tw-flex">
            <blockquote class="tw-m-auto tw-z-40 tw-font-bold tw-text-4xl tw-max-w-xl tw-text-center tw-text-zinc-50">
                The
                <span class="tw-text-primary-400">more I learn</span>, the more I realise how much I don't know
                <p class="tw-mt-6 tw-text-sm tw-font-normal tw-italic">
                  Albert Einstein
                </p>
            </blockquote>
          </div>
      </div>
      <div class="tw-opacity-100 tw-transition tw-duration-150 tw-ease-in-out tw-h-36 md:tw-h-96" data-carousel-item="active">
          <img src="https://placehold.co/600x400/orange/white" alt="..." class="tw-absolute tw-block tw-w-full tw--translate-x-1/2 tw--translate-y-1/2 tw-top-1/2 tw-left-1/2 tw-h-36 md:tw-h-96">
      </div>
      <div class="tw-opacity-0 tw-transition tw-duration-150 tw-ease-in-out tw-h-36 md:tw-h-96" data-carousel-item>
          <img src="https://placehold.co/600x400/red/white" alt="..." class="tw-absolute tw-block tw-w-full tw--translate-x-1/2 tw--translate-y-1/2 tw-top-1/2 tw-left-1/2 tw-h-36 md:tw-h-96">
      </div>
  </div>
```

As you'll notice, as well as images, each slide can contain a text caption too. I could've used a figure and figcaption element pair for this, but in my case, the image is purely decorative so I opted for a blockquote for the quotation.

We're going to be using the data-carousel-item attribute again in the JavaScript, and attach a value of active to the current slide.  

### Previous & Next Controls

These controls render to the left and right of the slider and allow users to cycle through the images in order or reverse order. They have icons indicating the direction they're cycling in when they're clicked and a visually hidden label to aid assistive technology users.  

```html
  <button type="button" class="tw-absolute tw-top-0 tw-left-0 tw-z-30 tw-flex tw-items-center tw-justify-center tw-h-full tw-px-4 tw-cursor-pointer tw-group focus:tw-outline-none" data-carousel-prev>
      <span class="tw-inline-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-rounded-full sm:tw-w-10 sm:tw-h-10 tw-bg-white/30 tw-dark:bg-gray-800/30 group-hover:tw-bg-white/50 dark:group-hover:tw-bg-gray-800/60 group-focus:tw-ring-4 group-focus:tw-ring-white dark:group-focus:tw-ring-gray-800/70 group-focus:tw-outline-none tw-transition-all tw-ease-in-out">
          <svg aria-hidden="true" class="tw-w-5 tw-h-5 tw-text-zinc-400 hover:tw-text-zinc-800 sm:tw-w-6 sm:tw-h-6 tw-dark:text-gray-800 tw-transition-all tw-ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          <span class="tw-sr-only">Previous</span>
      </span>
  </button>
  <button type="button" class="tw-absolute tw-top-0 tw-right-0 tw-z-30 tw-flex tw-items-center tw-justify-center tw-h-full tw-px-4 tw-cursor-pointer tw-group focus:tw-outline-none" data-carousel-next>
      <span class="tw-inline-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-rounded-full sm:tw-w-10 sm:tw-h-10 bg-white/30 dark:tw-bg-gray-800/30 group-hover:tw-bg-white/50 dark:tw-group-hover:tw-bg-gray-800/60 group-focus:tw-ring-4 group-focus:tw-ring-white dark:tw-group-focus:tw-ring-gray-800/70 group-focus:tw-outline-none tw-transition-all tw-ease-in-out">
          <svg aria-hidden="true" class="tw-w-5 tw-h-5 tw-text-zinc-400 hover:tw-text-zinc-800 sm:tw-w-6 sm:tw-h-6 dark:tw-text-gray-800 tw-transition-all tw-ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          <span class="tw-sr-only">Next</span>
      </span>
  </button>
```

That's the HTML, now the fun part.

## JavaScript

Firstly, we have to ensure that the DOM has fully loaded before trying to select our elements, so we wrap the function like this:

```javascript
window.addEventListener("DOMContentLoaded", () => {
  // our code goes here
});
```

[More about this here.](https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event)

Next, let's define our createCarousel function, and just return early in case of some easy to detect errors, for example, if there isn't a window object, or the selector (the HTML element we want to create a carousel with) hasn't been passed to the function:  

```javascript
function createCarousel(selector) {
  if (typeof window === 'undefined') {
    return;
  }
  if(!selector) {
    console.error("cannot find element to create a carousel into");
    return;
  }
```

Now let's pick up some HTML elements relative to the selector that we're going to need shortly:

```javascript
  const carouselItems = selector.querySelectorAll('[data-carousel-item]');
  const carouselItemsArray = Array.from(carouselItems);
  const indicatorTemplate = selector.querySelector('#carousel-indicator');
  // define interval timer so we can clear it later
  let intervalInstance = null;
```

In this bit of code we're getting the slides themselves. But using querySelector() returns a NodeList collection instead of an Array, so I'm making it into an Array that'll be handy later on. We're also getting the indicator template, and also setting an Interval, which is a timer we use to know how long we should wait before scrolling to the next slide. I want to define it here but set it as null so we can assign it and reference it in other functions.  

## Helper functions

Now for some helper functions:

```javascript
function getActiveItem() {
    return selector.querySelector('[data-carousel-item="active"]');
  }
  function getPositionOfItem(item) {
    return carouselItemsArray.findIndex((carouselItem) => {
        return carouselItem === item;
    });
  }
  function setItemAsActive(item) {
    item.setAttribute('data-carousel-item', 'active');
    item.classList.remove('tw-opacity-0');
    item.classList.add('tw-opacity-100');

    // update the indicators if available
    const currentItemIndex = getPositionOfItem(item);
    const indicators = selector.querySelectorAll('[data-carousel-indicator]');
    indicators.length > 0 && Array.from(indicators).map((indicator, index) => {
      if (index === currentItemIndex) {
        indicator.setAttribute('aria-current', 'true');
        indicator.querySelector('svg').classList.add('tw-text-primary-600');
        indicator.querySelector('svg').classList.remove('tw-text-white');
      } else {
        indicator.querySelector('svg').classList.add('tw-text-white');
        indicator.setAttribute('aria-current', 'false');
        indicator.querySelector('svg').classList.remove('tw-text-primary-600');
        indicator.querySelector('svg').classList.add('tw-text-white');
      }
    });
  }
  function setItemAsInactive(item) {
    item.setAttribute('data-carousel-item', '');
    item.classList.add('tw-opacity-0');
    item.classList.remove('tw-opacity-100');
  }
```

### 1\. getActiveItem() (no parameters)

At several points, we're going to need to get the currently active item. And since that changes frequently, I don't want to store it in a variable in the main function's scope since that will mean it will only be called once and hold the same value. Instead I have made a small function for this so I could more easily determine what the intent of this selector is.

### 2\. getPositionOfItem(item)

As it says, this one finds the position of a slide as an index of the array we created earlier.  

### 3\. setItemAsActive(item)

This one is a bit more complicated but it's name should inform you of what it does. As well as making an item active, it also updates the indicators (if they exist) to identify the index of the slide.

This was tricky because you have to match the index of a slide with the correct index of the indicators, and you have to remove the active classes from other indicators too.

### 4\. setItemAsInactive(item)

I could possibly have done this in the function above, but that would combine two intents into one function, which would make it harder to understand. It would also mean adding an extra parameter which complicates things somewhat. This way, both functions that set items active and inactive and, if something else needs to happen when slides change, they're easily identifiable and manageable.

That's it for the helpers, now I want to set up some actions that the carousel will perform:  

## Actions

Actions define either responses to user interactions or things that happen at a set interval

```javascript
function cycle() {
    intervalInstance = window.setInterval(() => {
        next();
    }, 3_000);
  }
  function pause() {
      clearInterval(intervalInstance);
  }
  function slideTo(nextItem) {
    const activeItem = getActiveItem();
    setItemAsInactive(activeItem);
    setItemAsActive(nextItem);
    pause();
    cycle();
  }
  function next() {
    let nextItem = null;
    const activeItem = getActiveItem();
    const activeItemPosition = getPositionOfItem(activeItem);
    if (activeItemPosition === carouselItems.length - 1) {
        // if it is the last item, set first item as next
        nextItem = carouselItems[0];
    } else {
        nextItem = carouselItems[activeItemPosition + 1];
    }
    slideTo(nextItem);
  }
  function prev() {
    let prevItem = null;
    const activeItem = getActiveItem();
    const activeItemPosition = getPositionOfItem(activeItem);

    if (activeItemPosition === 0) {
        prevItem = carouselItems[carouselItems.length -1];
    } else {
        prevItem = carouselItems[activeItemPosition - 1];
    }
    slideTo(prevItem);
  }
```

### 1\. cycle() (no parameters)

Cycle sets up the interval that we defined at the start of the createCarousel function to 3 seconds and then shows the next carousel item.

### 2\. pause()

Pause clears the interval so when the next slide shows we start again from 3 seconds instead of whatever was remaining in the timer. I named it pause because I thought I might allow external access to the function so that the slider can be paused. In retrospect, it doesn't do that yet so I should have changed the name to reflect what it does.  

### 3\. slideTo(nextItem)

Because this function takes the next item we want to set as active as a parameter, we can call this function any time the user clicks on a prev or next button, or the indicators.  It uses the two helper functions to change the active item, resets the interval and then cycles the carousel.

### 4\. next() (no parameters)

There's a little trick to this one which means we have to find out if we're on the last item, and if so, the next slide to show should be the first item. See how converting the NodeList into an Array came in handy?

### 5\. prev() (no parameters)

This is functionally very similar to the next() function except it's only called by someone hitting the "previous" button.

## Initialize carousel

I could have put this segment of code into the main closure of the createCarousel() function, but I think having it as a separate body makes it easier to see the intent of what we're doing and it's also clearer to read.

```javascript
function init() {
    const activeItem = getActiveItem();

    const items = Array.from(carouselItems)
    items.map(item => {
      item.classList.add(
        'tw-absolute',
        'tw-inset-0',
        'tw-transition-transform',
        'tw-transform'
      )
    });
    /**
     * if no active item is set then first position is default
    */
    if(activeItem) {
      slideTo(activeItem);
    } else {
      slideTo(0)
    }
    /**
     * Add event listeners to the buttons if they exist
     */
    const nextButton = selector.querySelector('[data-carousel-next]');
    nextButton && nextButton.addEventListener('click', () => {
      next();
    });
    const prevButton = selector.querySelector('[data-carousel-prev]');
    prevButton && prevButton.addEventListener('click', () => {
      prev();
    });
  }
```

Here we're leveraging the small helper and action functions we defined above to set some classes on each of the items, making sure the user sees the active item. This also covers the case that the user assigns a slide other than the first slide as the one that should initially be active. It then adds event listeners to the next and previous buttons if they exist in the DOM.

Lastly in the main body of the createCarousel() function we call these functions:

```javascript
  init();
  // if we have an indicator template, create the indicators
  indicatorTemplate && createIndicators();
```

Like I said, this last step could've been avoided if I'd put the body of init() and createIndicators() functions in the main function, I merely thought this was better from an organisational point of view.

## Create all of the Carousels

Here's the final step, which we'll do outside of our createCarousel() function but still inside the DOMContentLoaded listener:

```javascript
const allCarousels = document.querySelectorAll('[data-carousel]')
allCarousels.forEach((carouselElement) => {
    createCarousel(carouselElement);
});
```

Which is to find all of the DOM elements with data-carousel attributes and create a carousel for them. Now each carousel will have it's own indicators, event listeners and intervals which run independently of each other.

And also, if there are no elements found, the createCarousel function won't be called at all.

## Further Improvements

Now that the basic carousel functionality is complete, what could I do to further improve the code?

I've seen a lot that I can do.

For example, there's no API. I would like to allow access to some things such as the interval timer so that the speed with which carousel items cycle can be defined on a per-use basis. I'd also like to allow access to other things such as the prev and next buttons. Perhaps analytics need to be added to these listeners in some cases.  Or perhaps someone will need to pause the carousel programatically for some reason.

## Conclusion

Creating this carousel wasn't just a technical challenge. It was also a communciation challenge: how do I build this in a way that is easy to understand for those needing to modify my code? Does it explain itself easily? Does it allow another engineer to focus on their task and not ask too many mental gymnastics of them?

This is what we must aim for when we're writing modules like this; we must be first and foremost kind to both other engineers who will come along later, and our future selves.

[Full code here.](https://gist.github.com/endymion1818/8119f7af21db1f62d9119581fc3a8d19)"