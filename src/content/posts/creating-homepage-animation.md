---
title: "Creating my homepage animation"
description: "I made the original animation for this site when I was using Hugo, but it's taken some time to refactor to React. Here's the story of how I achieved that.
"
tags: 
  - javascript
datePublished: 2020-11-21
---
I made the original animation for this site when I was using Hugo, but it's taken some time to refactor to React. Here's the story of how I achieved that.

I wanted this site to be pretty minimal, but a few nice little touches can really make a website stand out. That's why I made the animation here on the homepage. You have to scroll up & down slowly to see it ...

## First steps [#](https://deliciousreverie.co.uk/posts/creating-homepage-animation/#first-steps)

The original animation was created with both ScrollMagic and GreenSock, two of the most incredibly diverse animation libraries available. The combination of these two is I think the easiest way of creating JavaScript animations when you're scrolling around, and I have used them to provide some pretty nice effects on sites I've worked on before.

However, the bundle sizes of GreenSock and ScrollMagic are ... quite large. I wanted to rewrite it because (1) I care about how much JavaScript I'm sending down (2) I want to see what I can achieve in plain JavaScript (3) I have the luxury of having no deadlines.

[Here's the original animation on CodePen (137 lines)](https://codepen.io/endymion1818/pen/xrRyXw)

Animations, especially ones where you're telling a story like this one, depend much on timing. I was particularly happy with the specific points that each rabbit became visible in this iteration, especially the last three, where the rabbit appears to be listening out for something, before dashing off the screen. It took a considerable investment of hours to get this right, so I've more or less kept this though the other implementations.

I've been told that this animation isn't prominent enough for most people to notice it. But I think that's partly the point: I like the idea that most people might not notice there is an animation: after all, most people aren't looking for that when they come to my site, so I didn't want to distract further their already distracted minds.

However, for those that do stop to notice, the brevity almost emphasises the subject matter more: it's only when we slow down ourselves that we start to notice the wonderful little things that are going on in nature around us.

The SVG images are free ones I found after trawling through a huge raft of websites selling, giving away, and pretending to give away, svgs.

## Rebuild in JavaScript [#](https://deliciousreverie.co.uk/posts/creating-homepage-animation/#rebuild-in-javascript)

For this re-implementation I made one significant change: the opacity of each rabbit is controlled by CSS, and doesn't fade in and out whilst you're scrolling. It's a a little bit of a cheat but I quite like how it makes the effect a little more dream like:

[See it on CodePen](https://codepen.io/endymion1818/pen/ZEbGXgj)

This is only 35 lines, and without any libraries, it's much faster and better for users.

## Rebuild to React [#](https://deliciousreverie.co.uk/posts/creating-homepage-animation/#rebuild-to-react)

When I switched to React I was conscious that my JavaScript bundle had increased quite a lot, and I wanted to try to make compensation for that by implementing some other performance gains before I started getting fancy.

It took some time to get this to work in React. Building this honestly got me to question whether React is "just javascript".

The actual animation code is 43 lines, a significant step up. There were a few tricky things I had to work out too:

[View on CodeSandBox](https://y2in6.csb.app)

React re-renders the page at different stages, so needs a way of getting the current element that's in the DOM. The `useRef()` hook allows us to do that. There's a caveat with that though: the initial value of current is undefined, it wasn't until I realised I needed to get the elements first then call them inside of a `useEffect()` hook.

It was also easier to use a pre-built hook, react-use-scroll-position, rather than write my own code. It's pretty minimal so I don't mind that too much.

## TypeScript implementation [#](https://deliciousreverie.co.uk/posts/creating-homepage-animation/#typescript-implementation)

I'm using this one on my homepage now, but with TypeScript:

```javascript
const Rabbits = () => {

  if(typeof window === 'undefined') { return <></> }
  if(window.innerWidth < 998 ) { return <></> }

  const scrollYPosition = useScrollYPosition()

function getScrollPercent() {
    return (
        scrollYPosition || document.body.scrollTop) / (
          (document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight
      ) * 100;
}

  const useScrollHeightToChangeOpacity = (
    domElement:HTMLDivElement,
    inHeight:number,
    outHeight:number
  ) => {
    if (getScrollPercent() > inHeight &&  getScrollPercent() < outHeight){
      domElement.style.opacity = '0.8'
    } else {
      domElement.style.opacity = '0'
    }
  }

  const treeSummer = useRef(null)
  const rabbitOne = useRef(null)
  const rabbitTwo = useRef(null)
  const rabbitThree = useRef(null)
  const rabbitFour = useRef(null)
  const rabbitFive = useRef(null)
  const rabbitSix = useRef(null)
  const rabbitSeven = useRef(null);

    useEffect(() => {
      useScrollHeightToChangeOpacity(rabbitOne.current!, 5, 10)
      useScrollHeightToChangeOpacity(rabbitOne.current!, 8, 15)
      useScrollHeightToChangeOpacity(rabbitTwo.current!, 20, 25)
      useScrollHeightToChangeOpacity(rabbitThree.current!, 30, 40)
      useScrollHeightToChangeOpacity(rabbitFour.current!, 45, 60)
      useScrollHeightToChangeOpacity(rabbitFive.current!, 65, 80)
      useScrollHeightToChangeOpacity(rabbitSix.current!, 85, 90)
      useScrollHeightToChangeOpacity(rabbitSeven.current!, 90, 95)
    }, [getScrollPercent]);

  return (
      ...
  )
}
```

The hardest part of the TypeScript implementation was to find out how to get the .current value of useRef(), because the initial value as you can see is null (the dom element doesn't exist yet). Unfortunately the only help you get from the compiler is:

```javascript
Argument of type 'null' is not assignable to parameter of type 'HTMLDivElement'
```

To tell the compiler that it's not possible for this value to be null at this point, you append it with a !, the non-null assertion operator.

Annoying, but not annoying enough for me to change my position on TypeScript.

## Future plans [#](https://deliciousreverie.co.uk/posts/creating-homepage-animation/#future-plans)

If you have to ask why I chose this particular scene, it's because it reminds me both of my childhood days roaming the countryside of County Durham when such wildlife was abundant, and the film "Watership Down" (I watched that film when I was far too young!).

Originally, I planned ot have different animations on other pages too, like a bird or butterfly crossing the viewport, and a little girl sitting on a tree swing. I'm still thinking about whether or not to implement those, since the SVGs are quite large and it might not be good for my bundle size.

However I do really like how much character it lends to the site."