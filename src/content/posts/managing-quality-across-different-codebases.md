---
title: "Managing Quality across Different Codebases"
description: "Having a structured plan for the codebases in your project will help keep them in good shape. I've written this document as a guideline of sorts, feel free to adopt it, adapt it or use it as a basis your own."
tags: 
  - engineering
datePublished: 2023-12-05
---
**One of my roles as the sole JavaScript Engineer is that of planning for the future. I hope that the company will grow to the point where other JavaScript engineers will be able to join. But even if it doesn't, I have outlined a definitive plan to continuously improve the code here.**

Having a structured plan for the codebases in your project will help extend their lifecycles. It will also help those using the code to more easily manipulate them to fulfil new business requirements whatever these might be. 

To that end, I wrote this document as a guideline for my company, feel free to adopt, adapt it or use it as a basis your own.

## Index

Lists the sections in this document, hyperlinking them for easy navigation.

> 1. Code quality
> 2. Type Safety
> 3. Unit Tests
> 4. End to end Testing
> 5. Deployment mechanisms
> 6. Error reporting
> 7. Observability
> 8. Standardisation
> 9. Scalability
> 10. Education
> 11. Code safety
> 12. Modularisation

> - Appendix 1: Background to Projects
> - Appendix 2: How we write JavaScript Code


## Rationale

I have tried to answer the question "Why does this document exist?" and clarified why this is a helpful document to maintain.

> This should be a living document that helps chart the progress and objectives for JavaScript concerns at [company name].

## Introduction

Outlines the nature of the code in use at the company from a very high level. For my document, this highlights the 3 main different types of JavaScript codebases that exist in the company.

## Sections

For each of the sections mentioned in the index, give a high level overview or history, outline what objectives you have for the future, show the current status of those objectives and explain what has been done so far:

### Example of Section 1:

> ### 1. Code Quality

> All of the JavaScript code repositories are working well and producing the needed outcomes for the business. There are some things that could yet be done to improve and standardise the quality of code to ensure that we are efficiently using developer time and improving deliverability and confidence.

> #### Objectives:

> - Use the same linting rules for all packages where possible
> - Use language-specific coding styles (eg. functional over classes)
> - Use a single compiler where possible and follow the latest ECMAScript standards


> #### Status:
> Not started / In Progress / Completed / Cancelled

> #### Details:
> We will use Vite as a bundler and transpile from ESM where necessary. Each major concern of JavaScript code will be renovated and receive maintenance when possible.

## Appendices

At the end of the sections, I have two appendices: one which has an overview of each codebase, and another that builds on the section on "Standardization of Code".

### Example of Appendix 1 (Background to Projects):

> #### Project name
> This application provides a service to ...

> **Repo**: https://github.com/dummy  
> **Hosting**: https://link.to/hosting-platform-backend  
> **Pipeline**: Github Actions  
> **Code quality**: Good/ Bad / Reasonable  
> **Tests**: None / Some / E2E only / Unit only  
> **Status**: In development / In production / Being renovated / Up to date

### Example of Appendix 2 (How we write JavaScript Code):

Many thinks to my friend Josh Farley for this one. It's a table which hilights decisions on code quality and standardisation that aren't covered by Prettier or the AirBnB Style Guide.

<div class="overflow-y-scroll">

|                |                                                                                                                          |                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Concern        | Decision                                                                                                                 | Rational                                                                   |
| File naming    | Files should be snake, eg.Good:`detect-provider.js`Bad:`detectProvider.js`                                               | This makes files easier to scan quickly in the source view                 |
| File structure | Files should not be nested beyond 2 levels.Good:root/src/component.jsBad:root/src/components/utils/frontend/component.js | This makes it much easier to discover components and avoids duplication    |
| Spelling       | Use American english spelling for variables and function names                                                           | Simplifies code for non-native speakers. One standard is better than none. |

</div>