---
title: "Is JSDoc Better Than TypeScript? A Real World Example"
description: "I've become an avid fan of TypeScript in recent years as it's improved my output, tightened up my appreciation for JavaScript's type coercion, and generally reduced my anxiety levels at work. However recently I've come into a place of work where JavaScript is written and often maintained by software engineers for whom JavaScript isn't their speciality. Not wanting to go back to the wild west of plain JavaScript, I adopted JSDoc. Here's how it went."
tags: 
  - javascript
  - typescript
datePublished: 2023-05-25
---
**I've become an avid fan of [TypeScript](https://www.typescriptlang.org/) in recent years as it's improved my output, tightened up my appreciation for JavaScript's type coercion, and generally reduced my anxiety levels at work. However recently I've come into a place of work where JavaScript is written and often maintained by software engineers for whom JavaScript isn't their specialty. Not wanting to go back to the wild west of plain JavaScript, I adopted [JSDoc](https://jsdoc.app/). Here's how it went.**

**Update:** I've written a [follow up article](posts/better-type-safety-with-jsdoc) about how JSDoc leads to better type safety than TypeScript.

I remember going through projects a few years ago and taking out all of the JSDoc notations. We were switching to TypeScript and JSDoc was seen as old and no longer needed. However it's gained a resurgence in recent months, most notably because [Svelte is switching back to JSDoc from TS](https://github.com/sveltejs/kit/discussions/4429#discussioncomment-2423814). But it has other benefits, and disadvantages, compared to TypeScript. Here's a few of the ones I've noticed.

Heads up! If you're looking for more info about this subject, there's an excellent [syntax.fm podcast episode](https://syntax.fm/show/624/is-jsdoc-better-than-typescript) about it, which covers more ground than I have here.  

## Benefits of JSDoc compared to TypeScript

TypeScript has always been my favourite approach to typing JavaScript, but it's not all positive. Here's some gotchas that I encounter and which still are sticking points with the language.  

### 1\. No compile step

This is one of the most cited reasons for not using TS. TypeScript doesn't run in any browser, so each time you're writing TS, you're having to take that out of your built JS again at run time. Not only does this mean that fancy typed code could still be wrong, you've also got the overhead of compilation, and the extra tooling that goes with that.

For my team most of our JS is collocated in large applications built predominantly with PHP. Having an extra compile step for JS as well as building the PHP application might be frustrating and lead to overhead in pipelines.  

### 2\. Easier to follow

This is the main reason my team were not up for switching at the moment. Although they're pretty good at JavaScript overall, they're not used to newer ECMAScript syntax, so when they are working on a project without my involvement, they will struggle to understand what's going on and it could slow them down significantly. Training is the  solution here, but the business (and the engineers themselves) have to see the real benefit to it first. At the moment, that benefit isn't clear to them, and it's likely that other teams with engineers who have backgrounds in different languages and tools won't see it either.

JSDoc is a totally different syntax but it is feature-rich, especially when compared to TypeScript, for instance you can even specify what error is thrown by a function, something TypeScript cannot yet do.  

## Disadvantages of JSDoc compared to TypeScript

To be honest, since using it seriously, I've been impressed with how far I've been able to get with JSDoc. I have been able to [import type dictionaries](https://stackoverflow.com/questions/49836644/how-to-import-a-typedef-from-one-file-to-another-in-jsdoc-using-node-js#answer-52847569) and found out how to use [VSCode Intellisense](https://dev.to/sumansarkar/how-to-use-jsdoc-annotations-with-vscode-for-intellisense-7co) to get type hinting. But there have still been some caveats.  

### 1\. It's not as flexible

**UPDATE:** It _is_ as flexible, I just didn't know enough when I wrote this ... please see the "addendums" section on how I solve these issues

If I need to negate the "object is possible undefined" error that you've probably seen a hundred times if you're doing DOM manipulation or data fetching:

```javascript
const thing = document.querySelector('#my-element')
addStuff(thing); // Error: type undefined is not assignable to type Thing 
// or
const data = await fetch('https://my-url.dev');
return data.results // error: data is possibly undefined
```

In TS, you can either force or cast it:

```javascript
const thing = document.querySelector('#my-element')
addStuff(thing!); // although probably don't do this 
addStuff(thing as Thing) // still not great but maybe you don't want to cascade down to catch undefined and oh yes this is so contrived
```

But in JSDoc I'm forced to add a lengthier explanation:

```javascript
const thing = document.querySelector('#my-element')
addStuff(
// thing is definitely defined by this point, see line 120
// @ts-ignore-next-line
  thing
);
```

I don't know maybe this is better than a sneaky hashbang. But it sometimes feels quite frustrating especially with a lot of them on multiple lines.  

### 2\. More shenanigans which would be easier with casting

OK, so this is quite similar but I found it super frustrating.

```javascript
const thing = document.querySelector('#my-element');

thing.style.display = 'block'; // Error: property style is not available on type Element
```

The querySelector method annoyingly returns an Element type, not HTMLElement, so every time I need to set styles via JavaScript (although it doesn't happen often), I have to do a ts-ignore-next-line. Again another situation where casting would have come in really handy.

## Conclusion

All in all, I'm super happy JSDoc exists. Without it, I would be getting super frustrated because there would be no types - and therefore no documentation - for our codebases. However, I'll be even happier if we can make the switch to TypeScript syntax one day.

### Addendum

Since writing this article, I have found a few tools that have improved the feedback I'm getting from the TypeScript compiler: instead of relying on my IDE (which caused issues when other team members were using a different IDE), I've since implemented [eslint-plugin-jsdoc](https://www.npmjs.com/package/eslint-plugin-jsdoc), which as you might imagine, has much better standardised linting and ensures that any errors or warnings aren't left up to the IDE, because both WebStorm and VS Code report different errors and sometimes miss things natively."

### Addendum 2

As things have progressed, I have learned how you can override types for document.querySelector():

```javascript
/** @type {HTMLElement | null} */
const thing = document.querySelector('#my-element');

thing.style.display = 'block'; // no error :tada:
```

The only thing I'm having real trouble with is React's `setState` hook. I'm hoping to have a write up for that ... once I solve it. 

### Follow up article

This article is overwhelmingly the most popular article on my blog, so I'll keep writing more articles as I solve different issues.

I've written a [follow up article](posts/better-type-safety-with-jsdoc) about typing events with JSDoc. 