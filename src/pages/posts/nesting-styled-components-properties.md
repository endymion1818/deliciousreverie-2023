---
layout: ../../layouts/BlogLayout.astro
title: "Working with styled components: multiple nested properties - Delicious Reverie"
description: "Destructuring is a common pattern when it comes to using styled components in complex situations. But it can be hazardous to clearly identify nesting. Here are a few suggestions.
"
categories:
datePublished: 2021-05-01
canonicalLink: "https://deliciousreverie.co.uk/posts/nesting-styled-components-properties/
---
# Working with styled components: multiple nested properties

Published on Saturday, 1 May 2021

I've seen this fairly frequently when it comes to using shared media queries. sometimes you want to set the width of an element based on one property, but you need to access the theme too.

```
const StyledContainer = styled.div`
  ${(props) =>
    props.narrow
      ? css`
          @media (min-width: ${props.theme.desktopMin}) {
            max-width: 48rem;
          }
        `
      : css`
          @media (min-width: ${props.theme.desktopMin}) {
            max-width: 32rem;
          }
        `}
`;
```

You could destructure them like this however it can become difficult to read, particularly the position of the closing bracket, which becomes difficult to see with the template literal syntax:

```
const StyledContainer = styled.div`
    ${({ narrow, theme })) => narrow ? css `
        @media (min-width: ${theme.desktopMin}) {
            max-width: 48rem;
        }
      ` : css `
          @media (min-width: ${theme.desktopMin}) {
              max-width: 32rem;
          }
      `
    }
`
```

I think it could be better not to destructure. You could easily start to think about what would happen when you have nested ternaries, which in my time I have spent too long trying to unpick."