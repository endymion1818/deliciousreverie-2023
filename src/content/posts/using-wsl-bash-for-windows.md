---
title: "Using WSL (BASH for Windows)"
description: "At a new job I've been tasked with moving to Windows as my main production environment. At first approaching this idea with some trepidation, I have since discovered and been able to install the new Windows Subsystem for Linux on my PC, and it's proven to be a really useful tool.
"
tags: 
  - linux
datePublished: 2016-11-01
---
Published on Tuesday, 1 November 2016

At a new job I've been tasked with moving to Windows as my main production environment. At first approaching this idea with some trepidation, I have since discovered and been able to install the new Windows Subsystem for Linux on my PC, and it's proven to be a really useful tool.

At a new job I've been tasked with moving to Windows as my main production environment. At first approaching this idea with some trepidation, I have since discovered and been able to install the new Windows Subsystem for Linux on my PC, and it's proven to be a really useful tool.

"Bash on Windows" isn't really what it says it is. It's not simply the terminal, but linux commands for the whole of the windows subsystem. [There's a video here](https://msdn.microsoft.com/en-us/commandline/wsl/about) that demonstrates what's possible, but as a "normal-ish" developer with the sole aim of developing websites, and no special knowledge of Linux or Windows, I thought it would be interesting to share what I found to be most helpful, and most challenging, about using it.

### The Problem [#](https://deliciousreverie.co.uk/posts/using-wsl-bash-for-windows/#the-problem)

I was pleased that I was able to install WSL without a hitch [using this guide on how-to geek](https://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/), but that's where it stopped being easy for me.

Problems arose because the build process my new employer had established required using a command-line php script which was a wrapper for [WP-CLI, the command-line interface for Wordpress](https://wp-cli.org/). This script ran through a few steps that would be essential to me getting up and running and developing new sites:

1.  Download Wordpress Core
2.  Add build plugins and remove existing dummy content
3.  Create a wp-config file
4.  Connect to MySQL, add and configure a database
5.  Download plugins and themes from a private Git repository

As you can see, this required a number of connecting services, which were not already installed on either Windows, or WSL. I made the decision that I would install these first inside WSL, and see if that would be more useable. I figured that it would be more difficult to configure everything I needed using the more unfamiliar Windows Command line.

### Command-line PHP and WP-CLI [#](https://deliciousreverie.co.uk/posts/using-wsl-bash-for-windows/#command-line-php-and-wp-cli)

I found installing these two tools was fairly easy using wget, and adding to my BASH profile. The only hitch (that I discovered later) was that the php user didn't have the necessary permissions to create the wp-config.phpfile. I discovered that by changing ownership of the folder I was using for my web projects to www-data was the key.

```bash
$ chown -R www-data /var/www/html/
```

### AMP (Apache, MySQL and PHP) [#](https://deliciousreverie.co.uk/posts/using-wsl-bash-for-windows/#amp-(apache-mysql-and-php))

This was the most difficult step out of all of them. I discovered quickly that my regular tools of choice ([MAMP](https://www.mamp.info/) or [WAMP](https://www.wampserver.com/en/)) meant that MYSQL was a Windows executable, and so not useable in bash. My heart sorta sank at this point. However, configuring my own AMP stack is something that I had wanted to do so ...

I quickly found this excellent tutorial on [Linux Mint community forum](https://community.linuxmint.com/tutorial/view/486) which takes you step-by-step through nearly everything I needed to download and install the AMP stack.

One major hitch that occurred was when I did get my website up and running, but all links on the site were 404ing. Turns out that I needed to configure MOD\_REWRITE on Apache. [This tutorial on Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-set-up-mod_rewrite-for-apache-on-ubuntu-14-04) and [this question on Stack Overflow](https://stackoverflow.com/questions/23665064/project-links-do-not-work-on-wamp-server) helped immensely.

Once I had gone through all this and changed a few things, I found that links still weren't working. Then, I noticed that Wordpress was telling me that it couldn't write to .htaccess, and gave me a snippet to paste there. Voilá, working websites.

### GIT Access [#](https://deliciousreverie.co.uk/posts/using-wsl-bash-for-windows/#git-access)

The final piece in this particular puzzle was GIT. I needed to set up global credentials and store them in the system memory so that the build script could use them when it required. I eventually discovered that you can use a credential helper to store your user and pass in memory:

```bash
$ git config --global credential.helper cache
```

Once these were configured, I was able to run my company's build script, and all was well with the world.

### Why I'm Not Using It Now [#](https://deliciousreverie.co.uk/posts/using-wsl-bash-for-windows/#why-i'm-not-using-it-now)

So, after going through all this pain, I eventually did manage to get over my particular hurdle and configure my Windows environment to use our in-house script and WP-CLI, although it was a challenge.

Why?

The principle reason was that there is a barrier between WSL and the Windows environment. It's not always perceptible, but it's there.

The main thing is that the file system is still in flux. I found that the Linux filesystem [aforementioned tutorial on How-To Geek](https://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/) has moved location in latest builds of WSL, and I couldn't locate it. This means that opening files in my text editor (Sublime Text or Atom) was an impossibility.

Even if I had pursued it, I found out that there are [incompatibilities in the filesystem](https://blogs.msdn.microsoft.com/wsl/2016/06/15/wsl-file-system-support/) which could mean that files might not be compatible after opening. Some have reported that files become invisible in WSL after being opened using a Windows application.

I did start using the venerable Vim to edit my files, and actually, it's something I want to go back to one day. But I'm pretty sure in the short term at least, with looming project deadlines, it would frustrate me very much.

There are also currently some issues with MySQL which the WSL team are looking into, and I did find it to be buggy. Hey, this is an early release, there's bound to be glitches that need ironing out.

### What I Learned [#](https://deliciousreverie.co.uk/posts/using-wsl-bash-for-windows/#what-i-learned)

I still use WSL every day to navigate around my file system and to run build scripts, and that isn't going to change. For me, it's far more intuitive and I'm comfortable with it.

Although it's really nice to have it, but actually I don't think it's an essential. Being able to use BASH to open folders, or open folders in .exe apps, now that would be incredible."