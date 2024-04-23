---
title: "Testing Web Components"
description: "I've been taking a deep dive into Web Components recently: building a complex application. I have really enjoyed it. However, as with any project I want to deliver something that is proven to work by means of static, unit and end-to-end tests. I've run in to some issues with existing test suites."
tags: 
  - javascript
datePublished: 2024-04-23
---
**I've been taking a deep dive into Web Components recently: building a complex application. I have really enjoyed it. However, as with any project I want to deliver something that is proven to work by means of static, unit and end-to-end tests. I've run in to some issues with existing test suites.**

When I deliver a new application I want it to be as well documented as possible so that any changes to it can be made as easily as possible, and by people who don't know the codebase as well as I would.

To that end, making sure that what I hand over is reasonably tested is paramount to my own sense of professionalism. It's only this that gives me a strong sense of accomplishment because I know it stands a good chance of lasting a long time, and it'll be easy for other people with less prior knowledge to work with.

When I deliver code based on Web Components, I want to deliver on that same level of quality. I know I'm leaning on newer browser-native technologies, but they're not that new.

I was therefore very surprised to find no adequate way to provide unit tests for Web Components.

## My Testing Trophy

I've decided to adopt a standardised set of tools across all of our codebases so that non-specialist developers can drop into any of them with the least amount of friction that include the following:

1. Static analysis via JSDoc
2. Unit testing via Vitest
3. E2E testing via Cypress
4. Manual testing with Storybook

Most of these tools work really well, but one definitely doesn't...

## Abstractions, abstractions everywhere

I think one of the problems is that for a large proportion of people adopting Web Components, they're here after having had experience with another framework, and looking for something equivalent.

That's definitely not true in my case. I was a little annoyed at the way React forces you to think about JavaScript, and I wanted to work more closely with the browser instead of seeming to force JavaScript into a certain pattern.

Fundamentally that meant that I wanted to remove the abstractions of a framework.

There have been well meaning attempts to make a framework out of Web Components. And I see why: If you're used to a framework, which a lot of people will be saying "here's another framework, but for Web Components".

The good thing about those frameworks is that they try to make something look a little more familiar, even when it's not. I looked at Lit Element extensively, and it definitely feels more like Vue. And they've got their ecosystem of tools and testing libraries and tutorials, which certainly helps adoption.

Again, though, that's not what I'm after.

I am a little freaked out going back to classes instead of purely functional components like in React. However there are benefits; understanding inheritance much clearer when you're writing something like

```javascript
class MyComponent extends HTMLElement {}

```

There are other pros and cons, but I want to focus on the subject at hand.


## Cypress: A Hidden Option

Ok well, not really hidden, but I did not realise I had to manually turn _on_ a setting to enable Cypress to recognise the shadow DOM:

```javascript
// in cypress.config.js

const config = defineConfig({
  // ...other config
  e2e: {
    includeShadowDom: true,
  },
});

```

Now I can write tests that include shadow dom selectors:

```javascript
describe("template spec", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });
  it("should play", () => {
    cy.get("media-player#my-player")
      .shadow()
      .find('media-control-bar')
      .find("media-play-button").
      click();
    cy.get("media-player#my-player")
      .should("have.attr", "mediaplaying", "true");
  });
});
```

Great! Annoying if you don't know about it, but works fine once you do.

## Storybook: Works fine

I've found Storybook particularly useful for manually testing that each argument I pass to the component works properly. And since Storybook re-renders the component when you change an input, you can see the player reacting to the arguments you pass it.

It is quite verbose. I have to pass my arguments around several times, but it does a good job once you've got those in:

```javascript

// basic setup
export default {
  title: 'Media Embeds',
  // these allow controls to render for the arguments
  // here's the first time I'm declaring them
  argTypes: {
    videourl: { 
      control: 'text',
    },
    posterurl: {
      control: 'text',
    },
  }
};

// I found arguments needed to be destructured and
// passed explicitly into my component
// That's 2 and 3
const Template = ({
  videourl,
  posterurl
}) => `
  <media-player 
    videourl="${videourl}"
    posterurl="${posterurl}"
  ></media-player>
`;

export const Player = Template.bind({});


// Now actually declaring defaults for those arguments, 5th time

/**
 * @type {UserOptions}
 */
Player.args = {
  videourl: 'https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4',
  posterurl: 'https://image.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/thumbnail.jpg',
}
```

There could be a way to reduce this, hopefully I'll be able to investigate before I hand the project over.

## Vitest .. you're on your own

I shouldn't really say this is a Vitest problem. It would be the same if you were using Jest or anything else.

The problem really lies with DOM mocking libraries. None of them allow you to extend the HTML Element.

I have found a library of helpers that got me way further than I had with anything else. 

[Ficus](https://www.ficusjs.org/) is billed as a lightweight abstraction of Web Components. There's that word again. But they do have a range of other tools that have been helpful: paticularly a wrapper around JSDom that includes favourable setup for Web Components.


```javascript
import { describe, it, beforeEach, expect } from 'vitest';
import { init } from '@ficusjs/testing'

import '../src/app.js';

describe("<media-player> ", () => {
  beforeEach(() => {
    init();
  });
  it("should render", async () => {
    document.body.innerHTML = '<media-player></media-player>';
    expect(document.querySelector('media-player')).to.exist;
  });
});
```
This still meant I have to mock a whole bunch of stuff to even get it to render. And this is as far as I have got. Not even the venerable, cross-framework testing-library [covers the Shadow Dom](https://testing-library.com/docs/dom-testing-library/intro/).

I do have a lot of stuff I can unit test with Vitest. But there's so much more I want to do with it.

If you know anything that might help, please let me know.

I've also created a GitHub repo with examples if you're coming across this and are looking for resources for testing Web Components:

https://github.com/endymion1818/example-web-component-test-suite

## Conclusion

More than anything, it's been a liberating, fun experience to see how far the web has come in the last few years. I hope I get to work with Web Components for a long time to come.

And I hope more developers can start using them too.