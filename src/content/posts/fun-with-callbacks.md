---
title: "Fun with Callbacks"
description: "I had the opportunity to integrate a callback function with a module I was building recently. But what is a callback? How do you use them? Let's take a closer look."
tags: 
  - javascript
datePublished: 2023-02-26
---
I had the opportunity to integrate a callback function with a module I was building recently. But what is a callback? How do you use them? Let's take a closer look.

I was building a module that could be pulled into a PHP application to upload videos using Uppy. But once the video was uploaded, there was another step that needed to run: the uploaded file needed to be sent to another application to be processed.

The original API I envisaged was something like this. A script could be placed on the page (wherever the backend team wanted the uploader to appear). They could pass a DOM element and a message to be displayed on the upload screen:

```javascript
<script type="text/javascript">
      largeFileUploader(
        ".large-file-uploader", // target DOM element
        "message", // Message to be displayed
    </script>
```

The application itself was rendered with Uppy, and included some form validation and other things to help the users upload their videos easily:

```javascript
async function largeFileUploader(
  targetDomElement,
  onScreenMessage,
  callback
) {
  const uppy = new Uppy({
    .use(Dashboard, {
      target: targetDomElement,
      inline: true,
      note: onScreenMessage,
      height: 470,
      theme: "auto",
      showProgressDetails: true,
    })
    // ... other configuration
   Uppy.on("complete", () => {
   // do something when Uppy has uploaded all files
   };
});
```

To provide functionality for the callback, I passed an extra parameter to my function:

```javascript
<script type="text/javascript">
      largeFileUploader(
        // target DOM element
        ".large-file-uploader",
        // Message to be displayed
        "message",
        () => {
          // this code runs inside the context of the uploader
        }
    </script>
```

With this extra parameter, you can run the function inside the context of your application and do something with the result, for example:

```javascript
<script type="text/javascript">
      largeFileUploader(
        ".large-file-uploader", 
        "message",
        async (formData) => {
          try {
            const getStuff = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
          const getStuffJson = await getStuff.json()
          return { success: 'message' }
          } catch (error) {
            return error?.message
          }
        });
    </script>
```

This allows us to provide an extra notification, rendered by Uppy,  to inform users that the video has been sent for processing, even though this step has happened outside of the context of Uppy. As my friend Chris Geary said, "The callback you pass is just a reference to a function, so in theory, as long as that reference remains in scope, you can call it."

```javascript
export function largeFileUploader() {
   ... // other code
   Uppy.on("complete", async (result) => {
      const data = await callback()
      if (data?.success) {
        uppy.info(`✅ Video processing initiated`, "info", 15000);
      }
      if (data?.error) {
        uppy.info(
          `⛔️ Upload to processor failed, please contact support.`,
          "error",
          15000
        );
}
```

Callbacks are super useful for rendering extra functionality provided by the people using your application code.

Further reading:

[https://developer.mozilla.org/en-US/docs/Glossary/Callback\_function](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)

[http://callbackhell.com](http://callbackhell.com)

[https://cheatsheetseries.owasp.org/cheatsheets/Nodejs\_Security\_Cheat\_Sheet.html#application-security](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html#application-security)"