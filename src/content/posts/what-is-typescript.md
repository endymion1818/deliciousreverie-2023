---
title: "What is Typescript?"
description: "What is TypeScript? How can it be useful to a person learning web development? I was asked this question on a Slack dicussion recently, and came up with the following example which seemed to be enough for my friends to grasp it.
"
tags: 
  - javascript
  - typescript
  - engineering
datePublished: 2020-05-14
---
What is TypeScript? How can it be useful to a person learning web development? I was asked this question on a Slack dicussion recently, and came up with the following example which seemed to be enough for my friends to grasp it.

JavaScript is a dynamic language.Here’s an example using the browser’s console:

![Type coercion of a number to a string](https://d13mv7x44wu31f.cloudfront.net/files/8larbfx7w-type-coercion.png)

I assigned the var a to a number , the number 1, then I assigned the next var, b, to a string, 'two' ... and then I added them together.

The result was a string (1two) because JavaScript changed my number into a string. In a lot of other languages, you cannot do this. The compiler, what interprets your code, would throw an error.

This example shows that JavaScript is a dynamic language, it changes types on the go (not just from strings to numbers but lots of others too) depending on a set of it’s own rules which sometimes don’t make sense. It’s a bit like the English language!

TypeScript is a compiler which tries to stop JavaScript from doing this crazy stuff so it becomes more predictable.

## When writing code [#](https://deliciousreverie.co.uk/posts/what-is-typescript/#when-writing-code)

TypeScript can also be useful when using certain code editors.

For example, I've typed something that doesn't exist in the data structure here, and my compiler can warn me about it, meaning I don't have to see an error in the browser, then switch back to my code editor:

![IDE complaining that it cannot find the variable](https://d13mv7x44wu31f.cloudfront.net/files/8larbfxa3-typescript-wrong.png)

I can also get useful tools like this, so I have confidence even when I'm typing, that my code is going to be correct.

![IDE correctly autocompletes the correct variable name](https://d13mv7x44wu31f.cloudfront.net/files/8larbfxcb-typescript-correct.png)

These two features are great timesavers, and claw back a lot of time you might have spent setting up TypeScript and debugging issues you might have as a result."