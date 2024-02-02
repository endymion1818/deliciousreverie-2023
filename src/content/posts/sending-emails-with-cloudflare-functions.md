---
title: "Sending Emails via SendGrid with Cloudflare Functions"
description: "SendGrid remains a popular tool for routing emails in today's applications. But it isn't without pitfalls. Here's my setup."
tags:
  - javascript
datePublished: 2024-01-18
---

**SendGrid remains a popular tool for routing emails in today's applications. But it isn't without pitfalls. Here's my setup.**

I am very grateful [to Aman for his article](https://blog.amanbhargava.com/send-email-using-cloudflare-worker/), which this article updates to reflect changes in the Cloudflare Functions API, some issues I found with SendGrid, and some other useful stuff like local development with Wrangler.

First of all, don't try to use SendGrid's own library with CloudFlare functions. It has a lot of cross-dependencies with Node.js, and CF functions are decidedly _not_ Node.JS. At some point it's going to try to call `crypto` and `fs`, neither of which exist in the V8 engine.

# Part 1: Semantics

The first thing to confuse me was the terminology Cloudflare uses for its products. It took me a while to realise that Workers were separate from Functions. I think the terminology is sometimes interchangeable in their marketing which doesn't help.

The APIs relating to _Functions_ (not workers) are [on their docs site](https://developers.cloudflare.com/pages/functions/). The Workers API is different (although I am still confused about the delineation of these products because they both seem to use the V8 engine).

The setup for a new worker is as follows:

```javascript
export async function onRequest(context) {
  const { request, env } = context;
}
```

Definitely don't use `export default` here, it works fine locally with Wrangler but when you deploy it your logs will say that it couldn't find any valid function entry point.

I passed the `request` object around a fair bit in other functions, but do be careful about `clone`ing the object. At the time of writing, Cloudflare functions have a very minimal memory allocation and cloning objects leads to a warning message, which can lead to functions crashing.

Be careful about how you utilise `request` in your functions. If I could be more specific about that particular iceberg, I would. It led to quite a long period of debugging for me.

This seems to work OK though. As Aman did in his article, I'm first catching all other requests that are not `POST`s and rendering a "not found" message:

```javascript
export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return await handleDisallowedMethod(request, env);
  }
  return await handlePostRequest(request, env);
}

async function handleDisallowedMethod() {
  return new Response("Object Not Found", {
    statusText: "Object Not Found",
    status: 404,
  });
}
```

## Environment Variables

You might notice that I'm also anticipating that there are some `env` variables being sent with this request. This wasn't trivial to set up in Wrangler. It's totally non standard. And because Wrangler is built for Cloudflare Workers as well as Cloudflare Functions, there are 2 ways of supplying variables. I got confused by this and tried to do it the wrong way. Cue 4 more hours of painful debugging. Here's the code that should be in your `.dev.vars` file locally, which will get picked up in the build step:

```bash
SENDGRID_API_KEY=
SENDGRID_EMAIL_RECIPIENT=me@example.com
SENDGRID_EMAIL_SENDER=mywebsite@example.com

```

Make sure that's excluded from your Git history of course. And be kind to your teammates and make sure you include a `.dev.vars.example`, which is checked in to Git.

## Handling the Request

Now let's handle our request. First we need to get the referrer URL so we can redirect the user back to the website.

```javascript
async function handlePostRequest(request, env) {
  const returnUrl = request.headers.get("referer");

  let formData = await readRequestBody(request);
  const requestBody = composeRequest(formData, env);

  // ...
}
```

I'll pause there because I need to tell you what's happening in `readRequestBody` and `composeRequest`.

`readRequestBody` is mostly unchanged from Aman's implementation, except I didn't think it was necessary to go too deep; I am only anticipating requests that contain JSON and formData.

```javascript
async function readRequestBody(request) {
  const { headers } = request;
  const contentType = headers.get("content-type");
  if (contentType.includes("application/json")) {
    const body = await request.json();
    return body;
  } else if (contentType.includes("form")) {
    const formData = await request.formData();
    let body = {};
    for (let entry of formData.entries()) {
      body[entry[0]] = entry[1];
    }
    return body;
  }
}
```

## Composing the API Request Body

`composeRequest` is a little more structured than originally. I wanted to compose this in place rather than passing things around too much, so I ended up with this implementation:

```javascript
function composeRequest(formData, env) {
  const { email, firstname, surname, textarea } = formData;
  return {
    from: {
      email: env.SENDGRID_EMAIL_SENDER,
      name: "my website",
    },
    replyTo: {
      email: `${email}`,
      name: `${firstname} ${surname}`,
    },
    subject: "New message from my website",
    content: [
      {
        type: "text/plain",
        value: `New message from ${firstname} ${surname} (${email}): "${textarea}"`,
      },
    ],
    personalizations: [
      {
        from: {
          email: env.SENDGRID_EMAIL_SENDER,
          name: "my website (example.com)",
        },
        to: [
          {
            email: env.SENDGRID_EMAIL_RECIPIENT,
            name: "Recipient",
          },
        ],
      },
    ],
  };
}
```

Here's where I got tripped up for about a day and a half. If there's something wrong with the request body here, SendGrid API will return a `302` error. That's right. `302`. This error is very vague but I have been told (by StackOverflow) that it's meant for `GET` requests only because you cannot re-try `POST` requests.

Don't go looking for this response in the SendGrid documentation, it's not there. Basically make sure you have submitted `string`s and that they are populated. String interpolation is a good idea here.

there's a long SO post about this which has some other suggestions, like don't break the `content` up by using `\n`s. If you are stuck on this one, and you've tried the above without success, good luck.

Okay, let's finish our `handlePostRequest` function:

```javascript
if (!env ?? env.SENDGRID_API_KEY) {
  return Response.redirect(`${returnUrl}?success=false&reason=no-api-key`);
}

let emailResponse = await sendEmail(requestBody, env);

// contined below
```

## Submitting to the API

Some basic things here, the sendEmail is a fetch request, pretty straightforward:

```javascript
async function sendEmail(messageBody, env) {
  try {
    const email = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageBody),
    });
    return email;
  } catch (error) {
    return { status: 500, statusText: error };
  }
}
```

Whatever the response is, we want to provide valuable feedback, and I haven't set up logging on CF functions yet so I want to pass those back to the client:

```javascript
// continued from above
let emailResponse = await sendEmail(requestBody, env);

if (emailResponse.status > 299) {
  return Response.redirect(
    `${returnUrl}?success=false&reason=SendGrid%20API%20returned%20${emailResponse.statusText}%20(statusCode: ${emailResponse.status}))`
  );
}
return Response.redirect(`${returnUrl}?success=true`);
```

I enjoyed coming up with this flow. We're redirecting the user back to the sender URL with some query parameters that will allow us both to render a success/fail message, and to debug what's going on (as long as the user hasn't navigated away from the form).

## CopyPasta Here

Putting that all together and you get this. Happy copypasting!

```javascript
export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === "POST") {
    return await handlePostRequest(request, env);
  } else {
    return await handleDisallowedMethod();
  }
}

function composeRequest(formData, env) {
  const { email, firstname, surname, textarea } = formData;
  return {
    from: {
      email: env.SENDGRID_EMAIL_SENDER,
      name: "my website",
    },
    replyTo: {
      email: `${email}`,
      name: `${firstname} ${surname}`,
    },
    subject: "New message from my website",
    content: [
      {
        type: "text/plain",
        value: `New message from ${firstname} ${surname} (${email}): "${textarea}"`,
      },
    ],
    personalizations: [
      {
        from: {
          email: env.SENDGRID_EMAIL_SENDER,
          name: "my website (example.com)",
        },
        to: [
          {
            email: env.SENDGRID_EMAIL_RECIPIENT,
            name: "Recipient",
          },
        ],
      },
    ],
  };
}

async function sendEmail(messageBody, env) {
  try {
    const email = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageBody),
    });
    return email;
  } catch (error) {
    return { status: 500, statusText: error };
  }
}

async function handleDisallowedMethod() {
  return new Response("Object Not Found", {
    statusText: "Object Not Found",
    status: 404,
  });
}

async function handlePostRequest(request, env) {
  const returnUrl = request.headers.get("referer");

  let formData = await readRequestBody(request);
  const requestBody = composeRequest(formData, env);f

  if (!env ?? env.SENDGRID_API_KEY) {
    return Response.redirect(`${returnUrl}?success=false&reason=no-api-key`);
  }

  let emailResponse = await sendEmail(requestBody, env);

  if (emailResponse.status > 299) {
    return Response.redirect(
      `${returnUrl}?success=false&reason=SendGrid%20API%20returned%20${emailResponse.statusText}%20(statusCode: ${emailResponse.status}))`
    );
  }
  return Response.redirect(`${returnUrl}?success=true`);
}

async function readRequestBody(request) {
  const { headers } = request;
  const contentType = headers.get("content-type");
  if (contentType.includes("application/json")) {
    const body = await request.json();
    return body;
  } else if (contentType.includes("form")) {
    const formData = await request.formData();
    let body = {};
    for (let entry of formData.entries()) {
      body[entry[0]] = entry[1];
    }
    return body;
  }
}
```

## Rendering the success / fail message

As a bit of icing on the cake, I have the following minimal JS in my Astro site to render success or fail messages to the user:

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const formHandlerResponse = new URLSearchParams(window.location.search).get(
    "success"
  );
  const formHandlerReason = new URLSearchParams(window.location.search).get(
    "reason"
  );
  // return early
  if (!formHandlerResponse) return;

  // was it successful as a boolean instead of a string
  const isSuccessful = formHandlerResponse === "true";

  // grab the original form
  const form = document.getElementById("contact-form");

  // ahh HTML templates. What joy.
  const submissionSuccessTemplate = document.querySelector(
    'template[name="submission-success"]'
  );
  const submissionFailureTemplate = document.querySelector(
    'template[name="submission-failure"]'
  );

  const formParent = form?.parentElement;

  formParent?.removeChild(form);

  formParent?.appendChild(
    isSuccessful
      ? submissionSuccessTemplate.content
      : submissionFailureTemplate.content
  );
});
```

## HTML Templates

With HTML templates I don't need to construct HTML out of JavaScript. Whilst these do have some limitations (good luck rendering the error message into a `<slot/>` or whatever), they are a lot nicer to use in my opinion.

```html
<template name="submission-success">
  <div>
    <p>Thank you for your message. We will be in touch shortly.</p>
  </div>
</template>
<template name="submission-failure">
  <div>
    <p>
      Sorry, something went wrong when we tried to submit your request. Please
      try again later.
    </p>
  </div>
</template>
```

## The Form Markup

For completion, here's the form markup:

```html
<form
  id="contact-form"
  method="POST"
  action="/send-email"
>
  <input
    required
    type="text"
    name="firstname"
    id="firstname"
    placeholder="First name"
  />
  <input
    required
    type="text"
    name="surname"
    id="surname"
    placeholder="Surname"
  />
  <input
    required
    type="email"
    name="email"
    id="email"
    placeholder="Email address"
  />
  <textarea
    id="textarea"
    placeholder="Message"
    name="textarea"
    rows="3"
  ></textarea>
  <input
    type="submit"
    value="Send message"
    />
  </div>
</form>
```

## Conclusion

Despite some challenges setting up Wrangler to accept my variables, crashing because of some unfathomable `clone` problem, and sendGrid's insane `302` status code, this was a good project. I appreciate the more lightweight feel to CF functions, and it has forced me to get to know SendGrid API a little better.