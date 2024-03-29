---
title: "Switching to BEM Syntax for CSS"
description: "Like a lot of things in the web world, CSS is a bit of mess. As the web gets more complicated, the tools and languages we use need to develop with us. This is currently happening as the W3C push forward with new functionality like Grid and Flexbox, but until those come into general use, we can aim to limit the risk of our code becoming unfathomable by other developers.
"
tags: 
  - css
datePublished: 2016-10-21
---

Like a lot of things in the web world, CSS is a bit of mess. As the web gets more complicated, the tools and languages we use need to develop with us. This is currently happening as the W3C push forward with new functionality like Grid and Flexbox, but until those come into general use, we can aim to limit the risk of our code becoming unfathomable by other developers.

I was a little suspicious of using BEM syntax for describing my CSS, I guess I didn't see the need for it and didn't have to work with other developers that much. But once I saw how it was being used on a project, I must say I was beginning to warm to the idea.

If you take a look at the code on the [FutureLearn website](https://futurelearn.com/), I find I can much more easily scan the code and identify the different elements that appear -- and more importantly, I can clearly follow the hierarchy of elements that are used on the site. Now, this hierarchy is critically important and something that can be very valuable to your projects.

### Wait, doesn't SASS nesting give us hierarchy? [#](https://deliciousreverie.co.uk/posts/switching-to-bem-syntax-for-css/#wait-doesn't-sass-nesting-give-us-hierarchy)

Yes, it's true that you can nest elements inside one another, and therefore more easily scan your CSS. So an element would be described something like this:

```css
.panel {
    ...

    .body {

        .title {
        ...
        }
    }
    .image {

        .caption {
        ...
        }
    }
}
```

But have you ever looked at the output for that in your CSS file?

```css
.panel {
    ...
}
.panel .body {
    ...
}
.panel .body . title {
    ...
}
.panel .image {
    ...
}
.panel .image .caption {
    ...
}
```

Although this is still fairly easy for us to scan quickly, the downside is that all of these extra selectors in your entire project up can eventually slow down the parsing of your css file.

BEM allows us to use a much flatter format, which can be even more descriptive:

```css
.panel {}
.panel__body {}
.panel__title {}
.panel__image {}
.panel__caption {}
```

These double underscores indicate that the selector is referring to an Element (the “E” in “BEM”) of the Block .panel. This keeps the CSS flatter and allows us to scan what the element is doing quickly.

This gets even more useful when you add in Modifiers.

## Modifiers [#](https://deliciousreverie.co.uk/posts/switching-to-bem-syntax-for-css/#modifiers)

An elements might have a variant that we would use in a different context:- say, for example, a navbar in the footer: we could re-use the same Block-level code, with a few modifications. Keeping with our example, we could do this:

```css
.panel—-large {}
```

In the HTML I would then have

```html
<article class=“panel panel—large”>
	…
</article>
```

In other words, the Modifier class would only contain the modifier code.

This is helping me to think a bit more about the structure of my code: I find that I’m looking for ways of making a class as succinctly as possible, because at some point it could be extended or re-used in some other way.

For that reason, I don’t typically specify things like column widths inside Blocks, my sizes are a separate entity which contain these elements. That way I can specify how wide an item is by using a column, Flexbox, or (in the near future!) Grid syntax.

## To Conclude [#](https://deliciousreverie.co.uk/posts/switching-to-bem-syntax-for-css/#to-conclude)

Using BEM syntax makes logical sense, it’s not a huge thing to learn, and helps me keep my code clean and easy to follow by other developers. It doesn’t require any extra build tools but has increased my productivity quite a bit.

More info: [getbem.com](https://getbem.com/introduction/)"