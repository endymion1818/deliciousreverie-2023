---
title: "Deploying Nx monorepos to Netlify in 2023"
description: "Monorepos with Nx on Netlify has been my stack of choice over the past few years. I really enjoy using both tools to publish an ever-growing series of websites for my hobbies. But there have been a few changes to both Nx and Netlify in that time. This article updates one on the Netlify blog that's a little out of date."
tags: 
  - hosting
  - javascript
datePublished: 2023-05-31
---
**Monorepos with Nx on Netlify has been my stack of choice over the past few years. I really enjoy using both tools to publish an ever-growing series of websites for my hobbies. But there have been a few changes to both Nx and Netlify recently. This article updates one on the Netlify blog that's a little out of date.**

[Here's the original article,](https://levelup-styleguide.netlify.app/blog/2020/04/21/deploying-nx-monorepos-to-netlify/) which is still really useful and goes into a lot of background as to why you might want to use a monorepo to build your frontends. It's a great article and I recommend you read the first half just to get some background. But later in the article the author for some reason digresses into setting up a CircleCI pipeline. Personally I don't find a lot of value in doing that for my frontends, and I think it distracts from the core subject a little.

## Nx Cache

The first thing I wanted to mention that has changed is Nx aggressive caching. Their [Nx Cloud](https://nx.dev/nx-cloud/intro/what-is-nx-cloud) plugin automatically pushes builds to their cloud without any configuration, making it accessible to your pipeline in Netlify. [As this Netlify support article shows,](https://answers.netlify.com/t/support-guide-nx-monorepo-site-does-not-reflect-changes-after-build/73657) you might see in your build logs "0 new files to upload". This means your build has been diffed with what's stored on Nx Cloud and there were no changes.To get around this you can append --skip-nx-cache to your build command.  

So do we need a build plugin at all? In fact, we don't unless you hit some edge case where you cannot use Nx Cloud. This is probably the only reason you might want to write your own implementation.

To utilise Nx Cache, run your deploy command as usual. It will discover if there have been code changes and deploy based on those changes. Otherwise it will skip the build and deployment steps. If you still want to deploy (perhaps you have changes in an external CMS, something that won't be detected on build), then add \`--skip-nx-cache\` to the build command and re-run it. You should then see it has fetched fresh data from your CMS and built the site anew.

In the case where you cannot use Nx Cloud, here's how to do it:  

## Updated Build Plugin

So the original article wasn't super clear about where your build plugin should be located. I put it in the tools directory under a new directory called skip-build. You should then have a netlify.toml in the root of your project referencing the folder (not the JS file) in the project:

```
[[plugins]]
package = "./tools/skip-build"
```

Now there are a few updates to the plugin too, let's go through them.

First, as this utility function returns a boolean you'll notice I renamed it to something that's much easier to follow. This new name shows the intent of the function so it makes it much easier for a newcomer to identify what's going on.  

```javascript
function hasProjectChanged(currentProject, lastDeployedCommit, latestCommit) {
  const execSync = require('child_process').execSync;
  const getAffected = `npm run nx print-affected --base=${lastDeployedCommit} --head=${latestCommit}`;
  const output = execSync(getAffected).toString();
  //get the list of changed projects from the output
  const sanitizedOutput = output
  .replace(/\r?\n|\r/g, '')
  .replace('> frontends@0.0.0 nx> nx print-affected', '')
  const changedProjects = JSON.parse(sanitizedOutput).projects;
  
  if (changedProjects.find(project => project === currentProject)) {
    return true;
  } else {
    return false;
  }
}
```

The other thing I did here was to sanitise the output of the execSync function, since I found there were a lot of unescaped characters in the output, and it also contained some other metadata. Once I replaced these with empty space, I was able to parse the valid JSON and be able to find out if my current project has changed or not.

Netlify's API has also changed slightly, instead of having onInit, we now have onPreBuild, so I've updated that here:

```javascript
  onPreBuild: ({ utils }) => {
    const currentProject = process.env.PROJECT_NAME;
    const lastDeployedCommit = process.env.CACHED_COMMIT_REF;
    const latestCommit = 'HEAD';
    const projectHasChanged = hasProjectChanged(
      currentProject,
      lastDeployedCommit,
      latestCommit
    );
    if (!projectHasChanged) {
      utils.build.cancelBuild(
        `Build was cancelled because ${currentProject} was not affected by the latest changes`
      );
    }
  }
};
```

Once I had this plugin I was able to see that builds were skipped when I didn't update the project.

The only trouble I'm now having is that all of my content is stored in Webiny CMS, and the build plugin is unaware of whether that content has changed. I'm thinking of doing an API call out from the build to discover if there are any recently published articles ..."