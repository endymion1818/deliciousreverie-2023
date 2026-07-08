---
title: "Working with Shopify in 2026"
description: "I've been building a complex integration with Shopify. It has been a journey."
tags: 
  - development
datePublished: 2026-07-08
---
I shouldn't be surprised really. I dislike working with hefty platforms that target consumers directly. This is because they often do so at the expense of a customers' more advanced requirements.

In this case the requirements were to integrate a 3rd party API into a single Shopify online store. And it as been a lot more complicated than I every thought.

This is aside from the fact that the API I'm integrating with is old ... I'm talking a SOAP API here people - in 2026. In my entire 15 year career, it's the first time I've had to integrate with one.

I'm planning to do a writeup at some point, so if you're interested, look out for that one, or subscribe to my RSS feed to recieve an update when it's out.

But I digress. Let me start with what Shopify gets right.

## The Good

### 1. Good initial developer experience

Shopify have a clear path for creating custom admin apps: A Remix (now React Router) application which comes with some helpful boilerplate, Shopify's UI elements, and an established project structure that works smoothly if you're hosting the application on Cloudflare.

At the time of writing, the template app and it's dependencies were a bit dated, but nothing too challenging to work around.

With one or two commands I was able to get my app in development mode to display on my shop. By default it uses Cloudflare Tunnels to iframe the app into the Shopify admin area, and there's a bridge to authenticate and pass data back and forth.

Good job team. This workflow works really well.

### 2. Unintrusive once installed

Once I overcame the hurdles listed below, the app functioned well. I didn't have any trouble with timeouts or interference with other elements of Shopify, I think this is largely to do with the app bridge, but in all there was a good separation of concerns in terms of development process.

## The Bad

### 1. Outdated Documentation

Of all the issues I encountered this was by far the worst. The AI seemed to spit out old documentation that was either superseded or completely irrelevant.

This made it incredibly difficult to debug my issues especially when combined with the other issues, as you'll see.

### 2. Opaque publish and approval flow

Once my app was ready, I tried to publish it so that my client could install the app on their shop (it was previously running in development mode only on my shop). This failed because I didn't have an install link.

It took me several days and using various forums to discover that I had published my app on my developer account instead of having a separate _partner_ account.

Once that hurdle was overcome, I was faced with no clear guidance on how to move my private app onto the partner portal. I spent quite a while researching how this might be achieved, but didn't find any help.

I eventually achieved it by creating a new app on the Partner portal, then swapping out the publishable tokens for the ones I had on my private app. I don't know if this is a known loophope to the Shopify developers. I guess if they didn't know about it before, they do now.

Once that had been accomplished, I thought I needed to have it published as an unlisted app. I'm told they've discontinued this pattern now but I didn't know that at the time (see #1 above). So I spent a couple of days trying to get together the necessary bits and pieces together to make a public app.

This failed consistently because of some issue relating to webhooks.

For a public app, you need to provide certain webhooks to respond to requests for customer information (which, by they way, my app did not use, nevertheless I needed to implement it), uninstall requests, and other things.

When using Shopify's hosted app approval tool to check the webhook, I was never sure if it was testing the webhooks of my app, or my shop. And each time despite many changes, and following the docs inscrutably (see #1 again if you need to), approval was denied. 

I ultimately found the workaround above allowed me to install the app on exactly 1 production shop, which is what I needed in the end.

It would have been nice to be able to test the production version of the app on a production shop, but this was something I was prepared to compromise on because of my good relationship with my client.

### 3. TOML file overrides package.json

The Shopify app comes with a package.json which has several scripts, as you would expect a normal app to function.

But it also has a shopify.toml file in the route. If you run `shopify` in your terminal, the TOML file takes precedent and can override environment variables, production URLS, build commands and other things.

This became a problem for me because I decided I wanted to host my website on Netlify instead of Cloudflare, yet it was not picking up the correct variables. And because (see #1 again) I couldn't rely on the documentation, it took a while to debug what was happening when I ran a command and something unexpected happened.

## Verdict

I'm sure this is a transition period for Shopify, and that they're working on improving things for developers.

I was never going to invest heavily in a platform like this for my income, but at the same time it's a pity to have to say that despite some really good achievements, the lack of cohesion is troublesome and difficult to overcome as an experienced developer.

It would have taken me a tenth of the time had this been an ecommerce site I had built.

If you're reading this as someone contemplating going with Shopify, or some other platform, it would be good to be aware of the risks: with platforms you are often exchanging the difficulty of getting started and high investment costs for other things that may cause you problems further down the line.

Let me put my agency hat on a minute.

As an experienced senior engineer, I have built a solution that is cost effective, simple for customers to use, and provides you with a much easier way to scale your business without the shackles of a platform, or the cumbersome entanglements of tools like WordPress. 

If you're having difficulties with Shopify or some other platform it might be worth considering a move. It might be a big change but could provide you with a much smoother growth curve in the end.
