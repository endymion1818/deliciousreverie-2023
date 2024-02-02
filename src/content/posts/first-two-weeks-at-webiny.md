---
title: "First 2 weeks at Webiny"
description: "I've been at Webiny two weeks now. I have had the most fun I've had in a long time career wise. Here's what I've learned and what my objectives are going to be for the coming few weeks.
"
tags: 
  - personal
  - devrel
datePublished: 2022-03-11
---
I've been at Webiny two weeks now. I have had the most fun I've had in a long time career wise. Here's what I've learned and what my objectives are going to be for the coming few weeks.

The first week at any company is always difficult. There's so much to learn, there's a new culture to adopt, and new personal dynamics to interact with. First steps always falter. But now, two weeks in, I'm beginning to feel more confident. I've made some contributions that I'm happy with, and I'm already feeling more settled with my decision to move.

I don't quite know what I was expecting from Webiny. I already knew the people here a little, and the reason I joined was because I could see such potential in the project. But looking in from the outside you can never get the whole picture.

I went in with ideas about organising campaigns, streamlining delivery of content across multiple platforms, doing SWOT analyses, doing some video content ... but when I stepped aboard, I found out that this is a really focused company. They have one product, one target market, and they want to fulfil the requirements of that market well. Through experimenting they'd already found out what works, and have a good idea of what is going to drive engagement, adoption and growth. Which is really reassuring for me: I don't have to start at "why", nor do I need to define "how", I only have to "do".

My first task was outlined pretty quickly: Build some starter kits with popular frontend frameworks. This would help me get used to using the Headless CMS part of Webiny (Webiny is much more than that, but we'll get to that later), give the company some more inbound links from authoritative domains, and help with user onboarding. It also would leverage my familiarity with these frameworks.

I quickly found a bug: we have a custom rich text renderer package for React, which didn't compile to common javascript, which meant I couldn't use it in Next. This was a great opportunity to make my first contribution to Webiny!

I struggled with figuring out how to customise our babel configuration, and Pavel, the CTO, helped me get through some silly misunderstanding I had about how to do that: how do you customise this babel configuration so that it overrides just this package, not any of the others in our monorepo?

```javascript
module.exports = require("../../babel.react")({    path: __dirname, })
```

The answer is simply this:

```javascript
const defaults = require("../../.babel.react")({
    path: __dirname,
 })

 module.exports = {
     ...defaults,
     plugins: [
         ...defaults.plugins,
         "@babel/plugin-transform-modules-commonjs",
     ]
 }
```

Pavel and I laughed about how this got me, and thats pretty indicative of the whole team; they've been welcoming, supportive and not critical of my mistakes. Of course, if I was a burden on the team I would expect there to be some further discussions, but you can anticipate a few teething problems from new team mates.

## Contributing to open source again [#](https://deliciousreverie.co.uk/posts/first-two-weeks-at-webiny/#contributing-to-open-source-again)

Contributing to open source is just ... so satisfying. I built something I was pretty proud of at Purplebricks, but it's something I can't even show you, and the code is lost to me. I'm pretty sad about that situation.

On the other hand, I've already made contributions to 2 Webiny repos, and have a draft PR open on NextJS docs. Because it's all public, it seems to me that this code is going to endure and be useful to other people. That is a great motivator for me.

## Community interaction [#](https://deliciousreverie.co.uk/posts/first-two-weeks-at-webiny/#community-interaction)

The other thing I've been excited about is getting more involved in the community via the Slack channel, it's been great to chat to other developers interested in Webiny, and it's helped me build my domain knowledge too.

But much more than that, I've been engaging on Discord servers, on Slack via [The New Dynamic](https://www.tnd.dev/)'s community, as well as HackerNews, Reddit and in other places too.

This has been great fun so far. I know I can't expect every interaction to be positive, but most are. This kind of community engagement scratches the itch I had before, when I wasn't just helping developers out with specific problems but seeing if I could raise a few eyes to the horizon, to see potential where they hadn't before, and to try new things.

## Conclusion [#](https://deliciousreverie.co.uk/posts/first-two-weeks-at-webiny/#conclusion)

First two weeks, as you see here, has been extremely positive. I'm really excited to see where Webiny as a product goes. Also, I'm blogging again ... which means things are looking up for my mental health."