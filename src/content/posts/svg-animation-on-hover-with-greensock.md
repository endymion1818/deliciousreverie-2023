---
title: "SVG Animation on Hover with GreenSock"
description: "One thing I've tried to do more of is to use animations on frontend projects I've been involved with. GreenSock animation library is a great way of standardising and improving on animations that otherwise wouldn't be available on all browsers."
tags: 
  - javascript
  - animation
datePublished: 2017-05-21
---

One thing I've tried to do more of is to use animations on frontend projects I've been involved with. GreenSock animation library is a great way of standardising and improving on animations that otherwise wouldn't be available on all browsers.

Animations add another dimension to your projects that helps users and can provide either an extra bit of feedback, extra character, and even increase conversions.

I really love GreenSock for it's performance and range of animations. I particularly like their modular approach to the library. For example, if you have something relatively straightforward in mind, you can just use the "Tween Lite" plugin, which is 27kb minified. If you need more flexibility with timelines, you can add Timeline Lite, a further 12kb.

This means that you're not tied to a monolithic platform that covers all bases. You can customise and work towards a performance budget whilst still using some great features.

GreenSock also works really well with ScrollMagic to make rich interactive experiences. It's often the combination of these libraries that result in great experiences that are often featured on the [Website Awwards](https://www.awwwards.com/) site.

## Example [#](https://deliciousreverie.co.uk/posts/svg-animation-on-hover-with-greensock/#example)

For a recent project, I wanted to add some hover effects to a UI element that made it seem as if it was almost a fluid change of state. The element was contained in an SVG shape with 2 layers, the background and the graphic.

## A fluid-feeling interaction [#](https://deliciousreverie.co.uk/posts/svg-animation-on-hover-with-greensock/#a-fluid-feeling-interaction)

I found that there are a few caveats when working with SVGs. The first is how to scale from the center of the animation. To do that you can add `transformOrigin: 50% 50%` to the properties you're applying. That will find the center of the SVG element, and animate from there.

Initially, to animate this I tried to create one timeline that targeted both elements, but this resulted in an effect that looked artificial, since the animations didn't overlap each other. One scale effect was applied to one element. It was only after that that the other scale effect started.

```javascript
var connectCircles = new TimelineMax();

connectCircles.staggerTo($(this).find(".cloud, .microphone, .handset"), 0.3, {
          scaleX: 1.2,
          scaleY: 1.2,
          ease: Elastic.easeOut,
      transformOrigin:"50% 50%"
          }).staggerTo($(this).find(".disc"), 0.6, {
          scaleX: 1.2,
          scaleY: 1.2,
          ease: Elastic.easeOut,
      transformOrigin:"50% 50%"
          })
        };
```

Output: https://codepen.io/endymion1818/pen/dWQevw

To resolve this issue, I split the functions into separate timelines that allowed them to run separately:

```javascript
var connectCircles = new TimelineMax();
var connectShapes = new TimelineMax();

connectCircles.staggerTo($(this).find(".cloud, .microphone, .handset"), 0.3, {
          scaleX: 1.2,
          scaleY: 1.2,
          ease: Elastic.easeOut,
      transformOrigin:"50% 50%"
          });

      // second timeline
      connectShapes.staggerTo($(this).find(".disc"), 0.6, {
          scaleX: 1.2,
          scaleY: 1.2,
          ease: Elastic.easeOut,
      transformOrigin:"50% 50%"
          })
        };
```

That way, when we run the animation, the two timelines run independently from each other:

https://codepen.io/endymion1818/pen/xgEYqG

Getting the timing right in animations is one of the hardest things, and takes the longest amount of time. It took me quite a bit of experimentation and asking for feedback to arrive at the duration of each transition so that it appeared that the effects were interacting with each other in a natural way.

A lot of animation is fooling the eye into thinking it's real. Our brains recognise natural interactions which follow our experience of physical reality, for example, the way a water droplet responds when you touch it. But if you get it wrong by a fraction, it looks strange or unfamiliar, and it can have an adverse effect on your audience.

## Conclusion [#](https://deliciousreverie.co.uk/posts/svg-animation-on-hover-with-greensock/#conclusion)

I've had so much fun with this you wouldn't believe. I am really excited about animations and look forward to working with GreenSock and the Web Animations API more in the future."