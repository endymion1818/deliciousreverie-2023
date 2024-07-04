---
title: "Wordpress theming with Backbone.js"
description: "You'll notice that there's not a huge amount of posts about JavaScript on my site. That's not an accident, I'm really only beginning to gain my feet with the language. Despite this I took the plunge and decided to build a Wordpress theme that uses Backbone.js to render the posts in a list. Here's a bit about the project."
tags: 
  - wordpress
  - javascript
datePublished: 2016-01-06
---

You'll notice that there's not a huge amount of posts about JavaScript on my site. That's not an accident, I'm really only beginning to gain my feet with the language. Despite this I took the plunge and decided to build a Wordpress theme that uses Backbone.js to render the posts in a list. Here's a bit about the project.

Backbone.js is one of the most stable of the Javascript frameworks, which is one of the reasons I chose to focus on it. I wanted to start with a stable framework that would allow me to get to grips with it properly, and that I didn't have to worry about a huge amount of refactoring when the next version came out. But it's also one of the smallest frameworks. Even with recommended dependencies jQuery and Underscore it's still faster than some of the larger frameworks out there. This appeals to my sense of what users are most in need of from us as developers.

### Where I succeeded

I'm going to talk as little as I can about the tools here. I'm exhausted at having to learn someone else's toolset to enable me to accomplish my work. I'm just going to say that it's good practice to break down your files into small blocks of code, this will really help you when it comes to debugging and maintenance of your code later on. So here's my JavaScript project folder setup:

```markdown
-src
  |
  --js
    |
    ---1 underscore.js
    ---2 backbone.js
    ---3 models.js
    ---4 views.js
    ---5 collection.js
    ---6 router.js
```

note: I'm loading jQuery in separately from a CDN.

Structuring my project folder this way allows me to load the JS in the correct order. Now, when they get parsed by your task runner they'll be in the correct order to run.

After a few false starts I had gotten the post feed into my view, and it is outputting as I wanted. This felt like such a victory! I can now see all of my posts and click through ... but this simple bit of functionality is currently far from finished.

#### Where I have yet to succeed [#](https://deliciousreverie.co.uk/posts/wordpress-themeing-with-backbone-js/#where-i-have-yet-to-succeed)

1.  Documentation is patchy. I started off by being able to retrieve the basic JSON feed from /wp-json/, but couldn't find out why I can't see the posts. After some digging, I found out that the JSON endpoints haven't been implemented in Wordpress core yet. We still need to use the plugin. In fact, I enjoy what I do because I can research things easily on Stack Exchange. But there's not many people using Backbone with Wordpress, and I was distinctly on my own trying to find this out.
2.  No links. If you click on one of the links in the list view, Wordpress takes over and you will be shown the posts' PHP page. This is because I have yet to wrap my head around how routing works.

These are some of the things I can't do yet. It really bothers me but until I find some time or it becomes a necessity, I can't justify more time on this project.

[Here's the theme if you want to pick over my code.](https://github.com/endymion1818/questingtheair)"