---
title: "How We're using JavaScript with Drupal"
description: "For the past 3 years I've been working at a company that is heavily invested in Drupal as a platform. We've gone through a massive iteration with JavaScript and believe we've arrived at a solution that might help other teams."
tags: 
  - javascript
datePublished: 2025-08-21
---
For the past 3 years I've been working at a company that is heavily invested in Drupal as a platform. The company has several major sites and maintains its own Drupal extensions (plugins, or packages). In fact, it has around 40 of them.

As you might imagine there's a significant amount of JavaScript for some of these, since they manage our in-house player, run live events and provide other functionality such as user dashboards and integrated quizzes.

We've gone through a massive iteration with JavaScript and believe we've arrived at a solution that might help other teams that do similar.

Additionally, this might perhaps provide a basis for further discussion about an [integrated bundler for Drupal](https://www.drupal.org/project/a11y_autocomplete_element/issues/3472705), something I'm keen to see happen someday. But only if [native import maps don't get there first](https://jvns.ca/blog/2024/11/18/how-to-import-a-javascript-library/).


## History

Historically, JavaScript has been seen merely as a scripting language, meaning it didn't require types and tests, unlike PHP code which we were more keen to guarantee it did what it should be doing. This also meant there was little to no documentation for the JavaScript code.

This was getting more and more difficult to work with especially since some run into thousands of lines. Implementing new business requirements was really slow and often resulted in releases which contained broken code and had to be rolled back.

My task since then has been to strike a balance between releasing safely and still making it possible for our PHP-focussed developers to interact with the codebase.


## Background

A Drupal extension helps us to encapsulate code for a specific purpose. For example if we create a new API, it will have its own extension. These extensions can tap into the existing functionality Drupal has. 

For that reason, JS code often needs to be written in such a way that it interacts with these APIs.

This frequently means that the JS is called by Drupal, and often that takes the form of an immediately invoked function expression (IIFE), which looks like this:

```javascript
((Drupal, once) => {
  Drupal.behaviors.myUniqueModuleId = {
    attach: (context, settings) => {
      const [myElement] = once("my-element-id", ".my-element-selector");
      const userName = settings.user.name;
      if(myElement) {
        myElement.innerText = `${userName}`;
      }
    }
  }
})(
  window.Drupal,
  window.once,
)
```

### Drupal behaviours

Drupal behaviors are a part of Drupal's JavaScript API that allow developers to attach functions to be executed at specific times during a web page's lifecycle.

[This blog article has a pretty straightforward explanation of why we need to hook into those](https://www.innoraft.ai/blog/drupal-behaviours-what-are-they).

In brief, behaviours are for hooking into the context. For example, Drupal might update the DOM with new elements, so we can run the behaviour in conjunction with those changes, in effect, _attach_ing it to the backend changes.

### Once

Once is a jQuery API that has been adopted in Drupal to ensure something runs only ... well, _once_. It's needed because Drupal might call the code in behaviours multiple times as the page is being set up and executed, and as I mentioned before, DOM elements can be changed by Drupal after the first load. For this reason, `window.addEventListener('DOMContentLoaded', () => {})` might not be sufficient.

Using `once()` no longer means we're using jQuery, it's been forked as a separate, standalone module by the Drupal community.

Sometimes this isn't available to us though, for example our media player is a standalone Custom Element written with JavaScript. To ensure that the DOM element has loaded and been registered in the DOM in that case, we have [a custom `waitForElement()` JavaScript function](https://deliciousreverie.co.uk/posts/observing-element-changes-in-the-shadow-dom/). 

## Approach

When it comes to our JavaScript projects, what we have now is two parallel approaches which can be adopted when a new extension is being conceived, or later on when the need arises. If the recommendations below are adhered to the resulting code changes between the two are relatively small.

### 1. Minimal approach

If only minimal amounts of JS are expected, we can skip the more complex setup mentioned below and add the JS to a **/js** folder and enqueue it using **module.libraries.yml**. We ensure it's always defined as an ES Module so that if we need to switch to bundled code we can do so with minimal refactors:

```yml
myjs:
  js:
    js/myjs: { attributes: { type: module } }
```

As I emphasise this is for really small things like setting some text on a DOM element as in the example above. The minimal approach does not support JavaScript unit tests. However because we use JSDoc instead of TypeScript, we can still implement type safety.

### 2. With bundling

When adding external dependencies from NPM.js we always switch to using a bundler. This is so dependencies are encapsulated into the JS project instead of being globally available (eg. on the `window` object). This helps with our upgrade path: if a dependency is global, it might be used in several modules, which could mean that in attempting an upgrade we could easily break something.

The downside of this is that we might have several versions of a specific dependency on one page, or across the whole site. But since they are encapsulated in the module they are not globally available so clashes aren't a possibility. 

One thing that does concern us is that the JavaScript bundles could be larger as a result which might have been avoided with global dependencies. However this is the tradeoff we have chosen to make.

We've avoided tools like [Foxy](https://www.drupal.org/project/foxy), which allows us to use Vite on the site level and integrate with Composer, and [Asset Packagist](https://asset-packagist.org/). 

Asset Packagist in particular is problematic because packages are not available until _after_ they have been requested for the first time. This has repeatedly led to failed builds. It's also a mirror of NPM which has more opaque security implications.

If an external dependency is needed, or the complexity of the JS rises above a certain level (we haven't specified where we should switch, instead leave it up to the good judgement of each developer), we have a significantly different setup:

#### 1. Introduction of /src and /dist folders

When someone decides to add this step, the folder structure changes to accommodate the bundling process. This also means that the libraries YML changes to

```yml
myjs:
  js:
    js/dist/myjs: { attributes: { type: module } }
```
Still very similar to above.

#### 2. Package JSON and Vite config

Next, we have a package.json with a `"type": "module"` declaration and some standarsised libraries such as Vite, our internal JavaScript package, and a dependency of `@rollup/plugin-replace`, we'll see why in a minute.

We also have settled on the following standardised scripts:

```json
"scripts" : {
    "lint:check": "eslint -c eslint.config.js '**/*.js'",
    "lint:fix": "eslint -c eslint.config.js --fix '**/*.js'",
    "format:check": "prettier --check '**/*.js'",
    "format:fix": "prettier --write '**/*.js'",
    "test:ci": "vitest --run",
    "test:watch": "vitest --coverage",
    "build": "vite build",
    "dev": "vite build --watch"
}
```
With these scripts a PHP developer can successfully work with JS by running `npm run dev`, which will re-compile the JS code at every change. They an also format and check linting easily.

Standardising these becomes really handy when there are sub-modules. They also help us use Git Hooks to vaildate the code before we push to our source repository.

We also have a Vite setup as follows:

```javascript
/// <reference types="vite/client" />
import { defineConfig } from "vite";
import { resolve } from "path";
import fg from "fast-glob";
import replace from "@rollup/plugin-replace";

// Generate entry points dynamically
const inputFiles = fg.sync("src/**/*.js").reduce((entries, file) => {
  const name = file.replace(/^src\//, "").replace(/\.js$/, "");
  entries[name] = resolve(__dirname, file);
  return entries;
}, {});

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    outDir: resolve(__dirname, "dist"),
    rollupOptions: {
      input: inputFiles,
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
      plugins: [
        replace({
          "process.env.NODE_ENV": JSON.stringify("production"),
          preventAssignment: true,
        }),
      ],
    },
  },
  test: {
    include: ["tests/**/*.test.js"],
    environment: "jsdom",
  },
});
```

As you might be able to follow, although the JS files are bundled they're not combined into one JavaScript file. This is because we still want our JS to be managed by Drupal. In some cases, specific JS won't be loaded onto a page. In others as I said above, the JS won't be relevant until certain Drupal behaviours have been run first.

Other than that, we're using the `@rollup/plugin-replace` to provide an environment variable of `NODE_ENV` set to `production`. Vitest by default injects a value of `test`, which comes in handy for testing as you'll see in a minute.

#### Test approach

You'll notice in the Vitest set up above we have our test setup configuration as part of vitest.config.js, which saves an additional file.

Test are located in **src/test** folder exclusively to keep them out of the way of the production code. However we do need to make one change to the production code:

```javascript
if(!process.env.NODE_ENV !== "test") {
  ((Drupal, once) => {
    // initial setup goes here, for example timers
    Drupal.behaviors.myUniqueModuleId = {
      attach: (context, settings) => {
        const [myElement] = once("my-element-id", ".my-element-selector");
        const userName = settings.user.name;
        if(myElement) {
          myElement.innerText = `${userName}`;
        }
      }
    }
  })(
    window.Drupal,
    window.once,
  )
}
```

This is necessary otherwise the code under test would run immediately once the module is imported. Another option is to separate the code under test from the module containing the IIFE completely.

#### Building the JS for Production

We're still in quit a bit of a quandry about how to build JS that uses the bundler approach. A few options we're considering:

1. **Build locally:** since we are building the /dist folder in development anyway, we can push the build code into the source repository. This is hazardous because there might be changes depending on the platform. Also if someone forgets to run build before they commit, we could have stale code in production and an unexpected outcome the next time soneone makes a code change
2. **Build in the pipeline:** This ensures that the module contains the latest code in the **/dist** folder. But it doesn't take into account the production environment. It also allows us to build the JS modules upfront, instead of having to do them all at once which could be time consuming
3. **Build it when releasing:** Our hosting setup allows us to hook into the build before it's pushed into production. We could build the JS in the target environment at that point. However, we won't be able to automate this since we don't know which extensions need bundling.

We currently use both (1) and (2). Implementing (3) has proved to be problematic and time consuming.

## How we handle sub modules

Some Drupal extensions have modules that further extend the functionality over the base implementation. They help with encapsulating other code and allow it to be called only when specifically needed. 

So how do we support JavaScript that appears inside these modules?

Each of these sub-modules is treated as a separate JS bundle, so has it's own Vite config, package.json and all of the set up mentioned above. We have experimented with inheriting some of this config but it's proved to be more confusing. Duplicating some files is a small price to pay for simplicity.

The addition of sub-modules could make things awkward when modifying code. To negate this we've adopted an approach that hopefully speeds things up. In the root of the PHP extension we have an additional **package.json** file that is very minimal. It only has one dependency and includes the following scripts:

```javascript
  "scripts": {
    "install": "npm-run-all --parallel main:install sub_module:install",
    "main:install": "cd js && npm install",
    "sub_module:install": "cd modules/sub_module/js && npm install",
    
    "dev": "npm-run-all --parallel main:dev sub_module:dev ",
    "main:dev": "cd js && npm run dev",
    "sub_module:dev": "cd modules/sub_module/js && npm run dev",
}
```

With the addition of this file, developers can run `npm run install` from the project root and install all JavaScript dependencies for each of the sub modules. This makes development much faster and stil allows for a developer to change directory to a specific sub module if they are only dealing with one.

## Conclusion

I hope this has been a useful walkthrough of how we're currently using JavaScript in our Drupal sites. If you have any further questions, spot some errors or want to discuss it further, please feel free to respond using the comments section below.