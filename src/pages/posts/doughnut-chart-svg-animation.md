---
layout: ../../layouts/BlogLayout.astro
title: "Doughnut chart SVG Animation"
description: "For a recent project, I was asked to design an animation for a doughnut chart. The data could be dynamically editable by the content author, who could also choose how many animations to display on a given content area.
"
tags: 
  - javascript
  - animation
datePublished: 2017-05-30
---
For a recent project, I was asked to design an animation for a doughnut chart. The data could be dynamically editable by the content author, who could also choose how many animations to display on a given content area.

I started off by designing the assets in Adobe Illustrator. The design required a gray background with an overlay of a specific colour that would feature the main animation. To achieve this I layered 2 circles, one on top of the other.

To easily enable animating, these layers are SVG path elements. I'm cheating a bit by making the top layer a linear path, instead of a true circle, but GreenSock's DrawSVG plugin works by animating the path, not the fill, of an SVG element.

## The Setup [#](https://deliciousreverie.co.uk/posts/doughnut-chart-svg-animation/#the-setup)

For the initial setup I grabbed the elements and a few values, wrapping these in a jQuery each() function to isolate them from sibling animations that were occurring on the same page:

```
  var values = $('.statistic');

  values.each(function () {

      var percentage = $(this).find('.figure__content .fig');
      var textcontent = percentage.text();
      var circle = $(this).find('.statcircle__animated');
});
```

As I already had jQuery as a dependency in this project I used the animate() function to handle the text, a number that would rise from 0 to the one specified by the user.

```
 percentage.prop('Counter',0).animate({
      Counter: textcontent
  }, {
      duration: 1000,
      easing: 'swing',
      step: function (now) {
          percentage.text(Math.ceil(now));
      }
  });
```

## Fallbacks [#](https://deliciousreverie.co.uk/posts/doughnut-chart-svg-animation/#fallbacks)

By setting the prop value to 0 means that if JavaScript isn't loaded in the browser, the percentage will still be visible to the user.

I'm still keen to make sure I provide a useable fallback just in case the user can't access JavaScript on their connection.

## The Chart [#](https://deliciousreverie.co.uk/posts/doughnut-chart-svg-animation/#the-chart)

Then, using a Tween and Draw SVG I was able to find the path, and choose an appropriate animation for the effect.

```
 function initTweens() {
      // animate circle path using GSAP DrawSVG
      TweenMax.fromTo(circle, 1.5, {
          // animate!
          drawSVG:"0"
      },
      {
          drawSVG: textcontent + "%"
      }); // tween
  };
  initTweens();
```

Using fromTo allows me to set the initial value to 0 then scale up to the value I grabbed from the percentage field.

I absolutely love the simplicity of DrawSVG, which meant no difficult calculations for me. I simply gave it a value and it calculated how it would draw path for me around almost 360 degrees. This gave me inherent robustness because GreenSock handles edge cases, and reduced development time greatly.

## Final Result [#](https://deliciousreverie.co.uk/posts/doughnut-chart-svg-animation/#final-result)

For launch, I used Waypoints.js to specify that the animation shouldn't start until the elements were in viewport. I then created the meta fields in the back end and tied them up to the page template.

You can see the final results in situ on my CodePen: https://codepen.io/endymion1818/pen/ygvVgQ"