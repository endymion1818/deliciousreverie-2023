---
title: "Polymorphic Elements in Astro"
description: "I'm building a component library in Astro, and one of the things I needed to do was to build a component that could render as either a button or an anchor tag. Here's how I achieved that."
tags: 
  - javascript
  - astro
datePublished: 2023-02-22
---
I'm building a component library in Astro, and one of the things I needed to do was to build a component that could render as either a button or an anchor tag. Here's an example of the outcome I wanted to achieve:

```html

 // renders an <a> tag
<Button href="https://some-link">This is an anchor tag</Button>
 // renders a <button> tag
<Button type="button">Submit</Button>
```

With Astro you're writing the best parts of JSX there could be;  for example, there are no abstraction leaks like having to add \`key\`s to iterables. But also what you're writing is very obviously much closer to HTML than JSX is, there not being a virtual DOM, or styled components, so this puzzled me for a while. I could either have 2 components and duplicate my styles, or find a way to render either depending on the use case.

Thankfully with some clever prop handling, we can have the best of both worlds:

```javascript
// button.astro

const { href } = Astro.props

---
<>
  {
    href ? (
      <a href={href}><slot /></a>
    ) : (
      <button
        type="button"
      >
        <slot />
      </button>
    )
  }
</>
```

With this code, the default output is a `<button>` element, but if you pass a `href`, it will instead render an `<a>` tag. What I love about this is that we are also using another trick first implemented by React, the Fragment. By wrapping the component in fragments (empty tags, or `<> </>`), you're still returning one element, which is a requirement for Astro components, but eliminating the wrapper in the compiled code. This way you don't have an extra \`div\` which could cause styling issues later on.

But what if you wanted more polymorphic elements? Say you had a container that could sometimes be a section, and sometimes you'd want to render it as a plain ol' div element. Here's a solution for that:

```javascript
---
interface Props {
  as?: "section";
}

const { as } = Astro.props;

---

<>
  {as === 'section' && (
      <section>
        <slot />
      </section>
  )}
  {!as && (
    <div>
      <slot />
    </div>
  )}
</>
```

By specifying the types, we give whoever is using this component the hints to show them what elements they can render this component to.

It's nicely extensible too: if you wanted to have another tag, say an `<aside>`, you could just add that to the types and to the return:

```javascript
<>
  {as === 'aside' && (
      <aside>
        <slot />
      </aside>
  )}
  {as === 'section' && (
      <section class:list={classList}>
        <slot />
      </section>
  )}
  {!as && (
    <div>
      <slot />
    </div>
  )}
</>
```

I really like this because the person using this code doesn't have to worry about polymorphism at all, the default return is a div, which they don't have to specify. But what about passing styles to all of these different elements?

## Styling polymorphic elements

For my component I wanted to pass in a default set of Tailwind classes, but also allow the person using the component to be able to override them by passing in an arbitrary string. So I used Astro's class:list helper:

```javascript
const { overrideClasses, as } = Astro.props;

const classList = new Set([
  "tw-mx-auto tw-max-w-7xl tw-px-2 sm:px-6 tw-lg:px-8",
  overrideClasses,
]);
---
<>
  {as === 'section' && (
      <section class:list={classList}>
        <slot />
      </section>
  )}
  {!as && (
    <div class:list={classList}>
      <slot />
    </div>
  )}
</>
```

By using polymorphic elements I'm keeping code dry, making it reusable, and providing the best possible experience for my colleagues."