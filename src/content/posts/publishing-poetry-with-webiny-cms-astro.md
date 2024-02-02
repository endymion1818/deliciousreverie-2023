---
title: "Publishing Poetry with Webiny CMS and Astro"
description: "I've wanted to have the ability on my blog to render poetry in a way that was conducive to reading, and I think I've finally managed to achieve that with my current tech stack, and some repurposing of tools I already use."
tags: 
  - personal
datePublished: 2023-03-10
---
Publishing poetry on the web is ... tricky.

I admit, some poetry is relatively straightforward: it's organised similarly to normal text, where on the left side, everything lines up nicely to the left, and right lines are "ragged", or not justified to any alignment. This is quite commonly how paragraphs appear.

Some poems, and some poets, choose to organise their work in more ... unusual ways. Take Keat's Ode on a Grecian Urn, which has meaningful indentations which I think really helps you to appreciate the lyrical cadence of the poem:  

```poetry
Thou still unravish'd bride of quietness,
       Thou foster-child of silence and slow time,
Sylvan historian, who canst thus express
       A flowery tale more sweetly than our rhyme:
What leaf-fring'd legend haunts about thy shape
       Of deities or mortals, or of both,
               In Tempe or the dales of Arcady?
       What men or gods are these? What maidens loth?
What mad pursuit? What struggle to escape?
               What pipes and timbrels? What wild ecstasy?
```

There are much more ... adventurous, shall we say? layouts for poems, but this was the main use case I wanted to meet: lines which respect the indentation of the author. But there was something else I wanted to achieve as well:

One of the things I hate seeing, in printed poetry as well as electronic, is wrapping lines. My reasoning is this: if the author so carefully indented their poem, and broke lines in certain specific places, then that is as important to the work as the left indentation is.

I really hate it when because of the limitations in width or type size, the authors' poems are butchered in this way. It's not as bad as justifying everything centrally (that is a crime I will never bring myself to forgive), but at least on the web we do have the opportunity to scroll left and right if the need arises. Looking at my 2 requirements I realised that there is another common written format that satisfies both of these needs.

## A sudden moment of clarity

So to recap my requirements were:

-   1\. No wrapping lines unless the author intended it
-   2\. Indentation as the author intended

I realised that the way we represent code is quite similar. Along with indented lines that don't wrap, we also have syntax hilighting, so it's easier to see what the code was doing. But I realised that was simply an implementation detail, and I could use some things that I already had in order to render poetry correctly on my blog.

## The Backend

I use [Webiny, the Serverless CMS](https://www.webiny.com), for the backend. I'd already configured an [Editor.js](https://editorjs.io/) extension [to render code blocks](https://github.com/editor-js/code). I forked this code and added to my Webiny admin app's HeadlessCMS config ([full PR here](https://github.com/endymion1818/backends-webiny/pull/3/files)), and after a few minor modifications I had the ability to add a block of poetry:

![I can add blocks for headings, images, quotes and, as custom plugins, code and poetry ](https://d13mv7x44wu31f.cloudfront.net/files/9lf44ti02-webiny-cms-poetry-block.png)

So far so good. I don't mind that the display looks like a code block, for me it's a minor consideration and actually the monospace helps me to see where the indentation occurs.

## Rendering on the Frontend

Now that I have my code block coming through with an appropriate field type identifier, I could modify my frontend Astro app to render blocks of poetry as part of the rich text renderer, which I'd already built.

```javascript
      {field.type === 'poetry' && (
        <RenderPoetry poetry={field.data.poetry} />
      )}
```

I admit this solution was [much hackier than it needed to be](https://github.com/endymion1818/personal-frontends-monorepo/pull/31/files), but it works for now. I hope I will have time to create a proper theme for Shiki so I don't have to forcibly override the inline CSS with some !important declarations.

You can see both poetry blocks and code rendered in this article. And I hope it'll mean I'm finally more free to add more articles about poetry here. Time, and children, willing of course!"