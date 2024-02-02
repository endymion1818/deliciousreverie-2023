---
title: "2023 Site Rebuild"
description: "Sorry to those people who subscribe to my RSS feed, I had a bug which I couldn't fix before I re-launched deliciousreverie.co.uk, but which I've resolved now. Yes, I've rebuilt my site again. This is the fifth iteration. Here's why."
tags: 
  - personal
  - javascript
datePublished: 2023-09-27
---
Sorry to those people who subscribe to my RSS feed, I had a bug which I couldn't fix before I re-launched deliciousreverie.co.uk, but which I've resolved now.

Yes, I've rebuilt my site _again_. This is perhaps the fifth iteration of it ... let me see, yes:

1. Perch
2. Hugo
3. Gatsby
4. Astro (Nx monorepo, Webiny CMS backend)
5. Astro (Markdown)

The main driver this time is that I broke my production instance of Webiny CMS by trying to deploy a bunch of upgrades which I should have made gradually.

But I also was struggling to manage the complexity of the CMS plus the monorepo in my spare time. It's no joke when you've got 3 kids.

Also, for all the goodness that Nx brings to a project, I was held back a little; I wanted to adopt Astro 3.0 early because of the view transitions API, but I couldn't because the Nx plugin for that was pinned to version 2.

This time, the site is super simple. And it also means that I'm ditching the plan I had to keep building blogging sites. Instead I'm going to let the domains lapse or leave them as they are.

Again it's the time thing, but also as I've moved into a new role I've been playing with some more serious JavaScript stuff and want to focus on doing some more experimentation with the things I've learned, as well as starting up another class to teach kids how to code.

I've got a few articles planned, including a write up of how I made a media server, and another one about web workers and cache storage APIs.

Hopefully I'll get some time to write those soon!
