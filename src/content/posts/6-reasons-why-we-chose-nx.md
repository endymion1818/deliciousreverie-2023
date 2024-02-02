---
title: "6 reasons why we chose Nx as our monorepo management tool"
description: "Nx is a modular build framework for architecting and maintaining code projects. Using it means you configure once, then just focus on build your tools and apps. Nx can effectively manage the configuration around APIs, micro frontends and libraries of tools, so you don’t have to consciously think of this step each time it comes to building a new project. This is an article I wrote for the Purple Bricks tech blog on the subject.
"
tags: 
  - javascript
  - engineering
datePublished: 2021-09-23
canonicalLink: "https://medium.com/purplebricks-digital/6-reasons-why-we-chose-nx-as-our-monorepo-management-tool-1fe5274a008e"
---
Sharing code across multiple disparate projects, at scale, can be a problem for many organisations.

The challenge is to eliminate code duplication and unify user interface design patterns, whilst at the same time providing (hopefully) speedier development for engineers.

There are a few ways to tackle this issue. In 2017, we settled on a monorepo pattern that facilitated Yarn workspaces. We had hoped this would provide the benefits above, but in reality we found that not a lot of code sharing was happening, especially across our frontend projects.

This was because each project would have its own package.json, its own unique pipeline, and, due to its own custom React implementation, it’s own UI library.

So, in 2019, we decided to rethink the problems we were having. We took a look at the tools available and found that a relatively new tool, [Nx from Nrwl](https://nx.dev/), already had support for some of our common tools.

We started a new monorepo using this tool that we hoped would eventually facilitate all of our initial requirements.

First of all, what problems is Nx solving for us?

# What problems does Nx Solve?

Nx is a smart and extensible build framework to help you architect, test, and build at any scale

Nx is a modular build framework for architecting and maintaining code projects. Using it means you configure once, then just focus on build your tools and apps. Nx can effectively manage the configuration around APIs, micro frontends and libraries of tools, so you don’t have to consciously think of this step each time it comes to building a new project.

It facilitates a consistency of output that is difficult to achieve otherwise. With Nx, we have gained the following benefits:

## 1\. Standardised libraries

Each of our microfrontends use the same version of NextJS, React, TypeScript (with one established ruleset), Jest, and Cypress. Each of our UI libraries utilises the same Storybook.

This means that instead of having to make decisions about what tools you’re going to use, Nx already provides them for you. As well as avoiding possibly lengthy and heated discussions about which tools developers might want to use, there’s already a standard in place for others to follow.

The other benefit of standardising libraries like this is that it’s much easier for developers to dip into different apps and libraries, because they’re all much the same.

## 2\. Code sharing

Having a monorepo also helps with onboarding. As soon as a new developer pulls down the repo, they have access to a wealth of information about our coding standards and they can immediately start to learn our coding style and what our approach to certain problems might be.

New developers also have better discoverability around existing libraries that we have built, so it’s easier for them to utilise these already built tools instead of having to ask whether something they need already exists in another repo somewhere.

## 3\. Code standards

Do you want to use spaces or tabs? Should we enable noImplicitAny? Should we use rem, em or px? None of these discussions happen, or they happen less often, because we can enforce the same code standard across all of our projects, and automatically alert developers and block PRs that don’t follow these standards.

It makes life a lot easier.

## 4\. Deployments

We can also standardise deployments using Nx. We have one single pipeline for all of our apps, which means we have less overhead in maintaining that pipeline.

When deploying, we check which applications have beenaffected by the code changes being made by utilising the command nx affected. This allows us to run the test suites for these applications. If all of these pass, we know we have a valid build and can have relative confidence that releasing code that alters several applications at once won’t result in any breaking changes.

## 5\. Versioning

Working at previous organisations, I have encountered issues with different versions of libraries being used by different applications within the organisation’s overall codebase. This means that the UI can be significantly different across different areas of the business.

This can also result in deprecated functions still being used months or years after they have been retired.

With Nx, all of our apps consume a single version of a library, and that’s updated every time there’s a merge to master.

This means there’s less risk of unexpected breaking changes, and no sprints wasted bumping library versions: it’s all done once, at the same time the library is modified. This could also help changes to the API of a library to be more robust, because it’s being consumed immediately, and not after some time has already passed and other teams have begun to implement the change.

## 6\. Development Experience

In previous iterations of our development workspaces, it could take up to 3 days to deploy a new application. With Nx, it can take a few hours. All you need is to run one command:

```bash
nx g @nrwl/next:app becky-quotes && yarn generate
```

We have configured this to build a new application that has helm charts for the deployment, as well as a NextJS application and a Cypress e2e test suite.

This also helps with onboarding as well as assists us with automated dependency management.

We use Renovate to raise nightly PRs to update dependencies. We have a requirement of 100% unit test code coverage, which is instrumental in ensuring the changes this automated system makes don’t break anything.

These benefits have clearly saved us a lot of time and we’re extremely happy with the results. But it hasn’t all been plain sailing. Aside from all the benefits, let’s look at one of the main challenges we’ve faced…

# Poor library strategy

Here’s our dependency graph. As you can see, all of the apps depend on a single library: our shared UI components.

![All our apps are linked to one library which changes frequently.](https://d13mv7x44wu31f.cloudfront.net/files/8latlygpp-1czYEm0sqVhiH-kOiltbbxA.png)

This means that when we update something in this library, or when writing a new component here, Nx sees that all of these apps have the dependency of that single library, and it initiates tests for all of those applications.

We have 14 currently, so this task can take a great deal of time. This is especially true in our pipelines, which as a consequence sometimes experience timeout issues.

Our solution to this is to have much smaller libraries. Instead of one UI library, we are going to have one library per component. This, at first, might seem counterintuitive, but it means that changing components, and creating new ones, can be done much more quickly. All of the components can still be consumed with a single Storybook instance. And some of the libraries will of course consume some of the other libraries (the base theme for example).

# Conclusion

Nx has been a terrific investment for Purplebricks. It hasn’t all been straightforward, and we have faced challenges, but I would definitely recommend Nx as a great way of managing projects — as it makes the jobs we do far easier by comparison to the alternatives available."