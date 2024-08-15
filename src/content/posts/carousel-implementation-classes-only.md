---
title: "Implementing a carousel with classes only."
description: "Last year I built a carousel project and showcased it here. I've just updated the code I used so that you can implement a carousel by only adding the class name to the parent element. Here's a breakdown."
tags: 
  - javascript
datePublished: 2023-05-13
---
**Last year I built a carousel project and showcased it here. I've just updated the code I used so that you can implement a carousel by only adding the class name to the parent element. Here's a breakdown.**

Here's the [previous article where I implemented a carousel](/posts/lets-build-a-carousel).

The thing with that project is that although I was 90% of the way there, I didn't realise that there were certain limitations with the large monolith it would be implemented in. I'm working on a Drupal site, and we need to sometimes initialise a carousel on a queue of items. When you create the queue you only have access to the class names of the wrapper. I recently got the chance to revisit this code and implement it so it could work in this setting.

## Objective

The basic objective is to be able to have markup like this:

```html
<ul class="carousel">
  <li>
    <img src="my-image.png">
    <div>
      <h4>Title</h4>
      <p>Some text</p>
    </div>
  </li>
  <li>
    <img src="my-image-2.png">
    <div>
      <h4>Another Title</h4>
      <p>Some more text</p>
    </div>
  </li>
</ul>
```

I'm not arguing semantics here, this is Drupal: the basic premise is that I don't have control of the HTML structure; and in fact this is vastly simplified because Drupal seems to inject a `<div>` into the DOM every time someone on the planet says "React".

I also wanted to have some customisations for whoever is implementing a carousel, so they could choose to have navigation previous / next arrows, and also indicators (the little dots that typically show at the bottom of the carousel to indicate which item in the list is currently active), and also be able to customise the rotation speed.

```html
<div class="carousel carousel-speed-4000 carousel-show-indicators carousel-show-navigation-buttons">
```

Let's get to it!

### Instantiation

Since this specifically for a Drupal project, I needed to query the DOM element using Drupal's `once()` method, so there's an IIFE at the bottom of the file that provides the integration:

```javascript
(function (Drupal, once) {
  Drupal.behaviors.carousel = {
    attach() {

      once("create-carousel", ".carousel").forEach(element => {
        createCarousel(element);
      });
    }
  }
})(Drupal, once);
```

If you're not using Drupal, then you can of course just use `document.querySelectorAll()` as normal.

There's another trick to this: Drupal loads in sections of the DOM separately, so the carousel items might not be present in the DOM initially. This is the main case for using `once()`, but it also means that we have to _start_ with the DOM elements _hidden_ to begin with.


```javascript
(function (Drupal, once) {
  Drupal.behaviors.carousel = {
    attach() {

      once("create-carousel", ".carousel").forEach(element => {
        createCarousel(element);
        element.classList.remove('tw-hidden') // or element.style.display = 'block'
      });
    }
  }
})(Drupal, once);
```
This ensures that the elements are hidden until the carousel is initialised, so we don't get a paint where all the elements appear stacked one on top of another.

## Setting heights

I'm a big believer that carousels should be uniform height. Nobody wants to be reading some copy below a carousel only for it to shift up and down every 3 seconds. But since the items are being created by users who have no regard for image sizes and length of content, we can't guarantee the height will be uniform.

I've got a little trick for that!

```javascript
// 1. get the carousel items
const carouselItems = carouselElement.children;

// 2. Set holding variables for new height of the carousel
let proposedCarouselHeight = 100;

// 3. use height of the tallest item
carouselElement.style.display = 'block';

carouselItemsArray.map(item => {
  if(item.offsetHeight > proposedCarouselHeight) {
    // set the proposed height to the height of the tallest image
    proposedCarouselHeight = getHiddenElementHeight(item);
  }
});
carouselElement.style.height = `${proposedCarouselHeight}px`;

// 4. set the carousel to be visible
carouselElement.classList.add('tw-block'); // or carouselElement.style.display = 'block'
```

The `getHiddenElementHeight()` function is a bit sneaky. If you do `element.offsetHeight` on a hidden element, the value is going to be `0`. So we need to first show the item, then grab the `offsetHeight`, then hide it again.

Whilst it seems a little redundant, it does mean we again avoid that flash where images are moving around as the JavaScript initialises. This function will likely run so quickly that users don't see it happen.

```javascript
function getHiddenElementHeight(element) {
  // Save the original display style
  const originalDisplay = element.style.display;

  // Temporarily show the element
  element.style.display = 'block';

  // Get the height
  const height = element.offsetHeight;

  // Revert to the original display style
  element.style.display = originalDisplay;

  return height;
}
```

Now we have a carousel with a specific pixel height, and all items inside it can be set to `position: absolute` with `inset: 0` to make sure they all take up the height of the container.

## Autorotation Interval

The last tricky little bit was to facilitate custom autoplay speeds with only class names available.

The api for this is that the user would add `carousel-autoplayspeed-<number>` to the class list, we can then check if there's a class beginning with `carousel-autoplay-speed`, and parse the digits at the end to get the desired speed:

```javascript
let autoRotationInterval = 3000;

const speedClasses = carouselElement.className.match(/carousel-autoplayspeed-\d+/g);

if (speedClasses) {
  const speedClass = speedClasses[0].split("-")[2]
  autoRotationInterval = parseInt(speedClass);
}
```
Now users can specify a millisecond interval of their choosing.

Here's the full implementation, including indicators and navigation buttons. Happy copypasta!

```javascript
function getHiddenElementHeight(element) {
  // Save the original display style
  const originalDisplay = element.style.display;

  // Temporarily show the element
  element.style.display = 'block';

  // Get the height
  const height = element.offsetHeight;

  // Revert to the original display style
  element.style.display = originalDisplay;

  return height;
}
/**
 * 
 * @param {HTMLElement} carouselElement 
 * @returns a ✨ new carousel ✨
 * @notes
 * 
 * The carousel has some parameters which can be modified by adding classes to the carousel element
 * 
 * 1. Autorotation speed. Add a class of `carousel-autoplayspeed-<number>` where `<number>` is the speed in milliseconds to adjust the default rotation speed
 * 3. Show indicators. Add a class of `carousel-show-indicators` to show indicators
 * 4. Show navigators. Add a class of `carousel-show-navigators` to show navigators
 * 
 */
function createCarousel(
  carouselElement,
) {
  // nope
  if (typeof window === 'undefined') {
    return;
  }
  // also nope
  if (!carouselElement) {
    return;
  }
  
  /** @type { HTMLElement[] | HTMLCollection | null} */
  const carouselItems = carouselElement.children;
  
  // still nope
  if(!carouselItems) {
    console.info(`carousel doesn't seem to have any items`)
    return;
  }
  
  let autoRotationInterval = 3_000;
  
  const autoPlayClass = carouselElement.className.match(/carousel-autoplayspeed-\d+/g)
  if(autoPlayClass) {
    const autoPlaySpeed = autoPlayClass[0].split("-")[2]
    autoRotationInterval = parseInt(autoPlaySpeed);
  }

  /** @type {HTMLElement[]} */
  const carouselItemsArray = Array.from(carouselItems).filter(item => item instanceof HTMLElement);

  // 1. set carousel to be full width of the containing area
  carouselElement.style.width = '100%';

  // 2. Set holding variables for new width / height of carousel
  let proposedCarouselHeight = 100;

  // if not, use height of the tallest image
  carouselElement.style.display = 'block';
  carouselItemsArray.map(item => {
    if(item.offsetHeight > proposedCarouselHeight) {
      // set the proposed height to the height of the tallest image
      proposedCarouselHeight = getHiddenElementHeight(item);
    }
  });
  carouselElement.style.height = `${proposedCarouselHeight}px`;

  // finally, set the carousel to be visible
  carouselElement.classList.add('tw-block', 'tw-relative', 'md:tw-overflow-hidden');

  // define interval timer so we can clear it later
  let intervalInstance = null;

  /**
   * HELPER FUNCTIONS
   */
  /**
 
   * Gets the currently active slide
   * @returns {HTMLElement | Element} item
   */
  function getActiveItem() {
    const activeItem = carouselElement?.querySelector('[data-carousel-item-current="true"]');
    
    if(!activeItem || !(activeItem instanceof HTMLElement)) {
      // @ts-ignore carouselItems is definitely defined by this point
      return carouselItems[0];
    }
    return activeItem;
  }
  /**
   * 
   * gets the position of the item in the array
   * @param {HTMLElement | Element} item 
   * @returns {number} itemIndex
   */
  function getPositionOfItem(item) {
    const position = carouselItemsArray.findIndex((carouselItem) => {
      return carouselItem === item && carouselItem.getAttribute('data-carousel-item');
    });
    return position;
  }
  /**
   * 
   * Sets the carousel to the next slide
   * @param {HTMLElement | Element} carouselItem
   * @returns {void}
   */
  function setItemAsActive(carouselItem) {
    carouselItem.setAttribute('data-carousel-item-current', 'true');
    carouselItem.classList.remove('tw-opacity-0');
    carouselItem.classList.add('tw-opacity-100');
  }
  /**
   * 
   * @param {HTMLElement| Element } item
   * @returns null
   */
  function setItemAsInactive(item) {
    item.setAttribute('data-carousel-item-current', 'false');
    item.classList.add('tw-opacity-0');
    item.classList.remove('tw-opacity-100');
  }

  /**
   * ACTIONS
   */
  /**
   * Set an interval to cycle through the carousel items
   * @returns {void}
   */
  function cycle() {
    if (autoRotationInterval <= 0) {
      return;
    }
    intervalInstance = window.setTimeout(() => {
      next();
    }, autoRotationInterval);
  }
  /**
   * Clears the cycling interval
   * @returns {void}
   */
  function pause() {
    clearInterval(intervalInstance);
  }
  /**
   * Slides to the next position
   * 
   * @param {HTMLElement | Element} nextItem 
   * @returns {void}
  */
  function slideTo(nextItem) {
    const activeItem = getActiveItem();
    if (!activeItem || !nextItem) {
      return;
    }

    setItemAsInactive(activeItem);
    setItemAsActive(nextItem);
    showActiveIndicator(nextItem);
    pause();
    cycle();
  }

  function showActiveIndicator(nextItem) {
    const nextItemIndex = getPositionOfItem(nextItem);

    const indicators = carouselElement.querySelectorAll('[data-carousel-indicator-for]');

    indicators && Array.from(indicators).map((indicator, index) => {
      if (index === nextItemIndex) {
        indicator.setAttribute('aria-pressed', 'true');
      } else {
        indicator.setAttribute('aria-pressed', 'false');
      }
    });
  }
  /**
   * Based on the currently active item it will go to the next position
   * @returns {void}
   */
  function next() {
    const activeItem = getActiveItem();
    const activeItemPosition = getPositionOfItem(activeItem) ?? 0;

    if(!carouselItems) {
      return;
    }
    if (activeItemPosition === carouselItems.length - 1) {
      // if it is the last item, set first item as next
      return slideTo(carouselItems[0]);
    }
    const nextItem = carouselItems[activeItemPosition + 1];
    
    if(!nextItem.getAttribute('data-carousel-item')) {
      // if it's an indicator, set first item as next
      return slideTo(carouselItems[0]);
    }
    slideTo(nextItem);
  }

  /**
   * Based on the currently active item it will go to the previous position
   * @returns {void}
   */
  function prev() {
    if(!carouselItems) return;
    let activeItem = getActiveItem();

    if(!activeItem) {
      console.log('no active item');
      activeItem = carouselItems[0];
    }

    const activeItemPosition = getPositionOfItem(activeItem);
    
    const prevItem = carouselItems[activeItemPosition - 1];
    
    const actualCarouselItems = carouselItemsArray.filter(item => item.getAttribute('data-carousel-item'));
    
    if(!prevItem && actualCarouselItems) {
      return slideTo(actualCarouselItems[actualCarouselItems.length - 1]);
    }
    slideTo(prevItem);
  }

  /**
   * INIT FUNCTIONS
   */

  /**
  * Create the indicators for the carousel
  * @returns {void}
  */
  function createIndicators() {

    if(!carouselElement.classList.contains('carousel-show-indicators')) {
      return;
    }
    
    const indicatorContainer = `
      <div class="indicator-container tw-absolute tw-bottom-4 tw-left-0 tw-right-0 tw-flex tw-justify-center tw-mb-4">
        ${carouselItemsArray.map((item, index) => `
          <button data-carousel-indicator-for="${index}" aria-pressed="${index === 0 ? "true" : "false"}" class="tw-w-4 tw-h-4 tw-mx-1 tw-rounded-full tw-border tw-border-primary-600 tw-transition-colors tw-duration-300 tw-ease-in-out tw-cursor-pointer hover:tw-ring-2 hover:tw-ring-primary-600 tw-bg-white aria-pressed:tw-bg-zinc-500" aria-label="Slide ${index + 1}">
          </button>
        `).join('')}
      </div>
      `;
    
      carouselElement.insertAdjacentHTML('beforeend', indicatorContainer);

      const instantiatedIndicators = carouselElement.querySelectorAll('[data-carousel-indicator-for]');

      const instantiatedIndicatorsArray = Array.from(instantiatedIndicators);

      instantiatedIndicatorsArray.map(indicator => {
        const clickedCarouselItem = indicator.getAttribute('data-carousel-indicator-for');
        indicator?.addEventListener('click', () => {
          clearTimeout(intervalInstance);
          const carouselItem = carouselItemsArray.find((carouselItem) => carouselItem.getAttribute('data-carousel-item') === clickedCarouselItem);
          carouselItem && slideTo(carouselItem);
          
          instantiatedIndicators.forEach((indicator) => {
            indicator.setAttribute('aria-pressed', 'false');
          });

          indicator.setAttribute('aria-pressed', 'true');
        });
      })
  }


  function createNavigators() {
    if(!carouselElement.classList.contains('carousel-show-navigators')) {
      return;
    }
    const navigatorPrev = `
      <button class="carousel-navigate navigate-prev tw-absolute tw-left-0 tw-bottom-0 tw-top-0 tw-text-white tw-text-2xl tw-shadow-sm tw-transition-all hover:tw-scale-110" type="button"><span class="tw-block tw-rounded tw-transition-opacity tw-bg-white/20 tw-border-white/50 hover:tw-bg-zinc-400">&larr;</span></button>
    `;
    const navigatorNext = `
      <button class="carousel-navigate navigate-next tw-absolute tw-right-0 tw-bottom-0 tw-top-0 tw-text-white tw-text-2xl tw-shadow-sm tw-transition-all hover:tw-scale-110" type="button"><span class="tw-block tw-rounded tw-transition-opacity tw-bg-white/20 tw-border-white/50 hover:tw-bg-zinc-400">&rarr;</span></button>
    `;
    carouselElement.insertAdjacentHTML('beforeend', navigatorPrev);
    carouselElement.insertAdjacentHTML('beforeend', navigatorNext);

    carouselElement.querySelectorAll('.carousel-navigate')?.forEach((navigator) => {
      navigator.addEventListener('click', () => {
        navigator.classList.contains('navigate-prev') ? prev() : next();
      });
    });
  }

  /**
   * Function to initialise carousel
   * @returns {void}
   */
  function init() {
    const activeItem = getActiveItem();

    if(!carouselItems) {
      return;
    }

    carouselItemsArray.map((item, index) => {
      item.classList.add(
        'tw-absolute',
        'tw-inset-0',
        'tw-transition-opacity',
        'tw-opacity-0',
        'tw-duration-600',
      )
      item.setAttribute('data-carousel-item', `${index}`);
    });
    /**
     * if no active item is set then first position is default
    */
    if (activeItem) {
      slideTo(activeItem);
    } else {
      carouselItems && slideTo(carouselItems[0]);
    }
    /**
     * Add event listeners to the buttons if they exist
     */
    const nextButton = carouselElement.querySelector('[data-carousel-next]');
    nextButton && nextButton.addEventListener('click', () => {
      next();
    });
    const prevButton = carouselElement.querySelector('[data-carousel-prev]');
    prevButton && prevButton.addEventListener('click', () => {
      prev();
    });
  }
  createIndicators();
  createNavigators();
  init();
  cycle();
}

// GO!
document.querySelectorAll('.carousel').forEach(carousel => {
  createCarousel(carousel);
  carousel.classList.remove('tw-hidden');
})
```