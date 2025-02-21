---
title: "BValidate your commits with Git Hooks"
description: "With everything else we need to remember, checking formatting and linting is easy to forget. If this sounds like you, there are some great solutions out there. Here's how to use Git Hooks."
tags: 
  - operations
datePublished: 2025-02-21
---
MAny of us run linters (probably eslint) and formatters (like prettier) to make sure code is in a suitable state before merging. We do this so that it's easier for other people to modify the code we've written. But have you, like me, gotten frustrated by failures in pipelines due to this seemingly small problems? It's comparatively costly for failures to happen there too, since the compute time in pipelines needs to paid for. 

With everything else we need to remember, checking formatting and linting is easy to forget. If this sounds like you, there are some great solutions out there.

## Husky 

Probably the most popular solution, [Husky](https://typicode.github.io/husky/), can be installed on a per-project basis. It runs before you commit code to your project, modifying your changed files so that they are linted and formatted. Anything that's fixable will be modified and added to the commit.

This is a simple, small, easy to use library that can be modified to suit your needs.

But what if you can't use Husky, or don't want to?

## Git Hooks

Another way to make sure you run linters is by using Git Hooks. I typically configure my global git so that each time I run `git commit` my hook runs.

Here are the steps I took to make it work.

### 1. Set up files and folders

Git recommends you use a folder called **.git-templates**, and inside that a folder called **hooks**.

```bash
# from your Home folder
mkdir .git-templates
cd .git-templates
mkdir hooks
cd hooks
```

Now create a file called **pre-commit**, no extension and make it executable.

```bash
touch pre-commit
chmod +x ./pre-commit
```

### 2. Tell git about it

Next we need to tell git where to look for this hook. We can let it know by running the following

```bash
git config --global init.templateDir '~/.git-templates'
```

Now Git will look for the specific path (/hooks/pre-commit) that we set up and run the executable.

### 3. Set up the executable

Open the file **pre-commit** in your favourite editor, and add the following

```bash
# in the ~/.git-templates/hooks/pre-commit file
#!/bin/sh
```

This line tells the executable which shell to use. I'm using `sh`, but you can use `bash` or something else.

Below that we can add the commands we want to run.

Now this is where, because this is a global, it helps if you've standardised your build / test/ format / lint commands. I've done across many of my projects so I can add them to the file:

```bash
npm run lint:check
npm run format:check
npm run test
```

Now when I run `git commit` in my project, I get the following message:

```bash
gc -m 'test'

> myproject@1.0.0 lint:check
> eslint '**/*.{js, ts}

> myproject@1.0.0 format:check
> prettier --check '**/*.{js, ts}

checking formatting ...
[warn] src/my-file.js
[warn] Code style issues found in the above file. Run Prettier with --write to fix
```

## Git Hooks are great

What's even better is that if the project doesn't have any of these scripts, it'll fail silently and still allow you to commit as normal.

I really love Husky, but I also am really happy to use a native solution that's built into Git, along with bash scripts, to make my coding workflow both cheaper and faster.