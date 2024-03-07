/**
 * @type {import('@netlify/functions').Handler}
 */

/**
 * 
 * @param {Handler.event} event 
 * @returns 
 */
const handler = async (event) => {

  console.log(event)

  const domain = new URL(event.headers.host);

  const host = domain.hostname;

  const validReferrers = ['localhost', 'deliciousreverie', 'netlify'];

  // let's just check that shall we?
  if(!event.body) {
    return {
      statusCode: 302,
      message: 'no data to send',
    }
  }

  const payload = JSON.parse(event.body);

  console.log(payload);
  
  if (!validReferrers.includes(host)) {
    console.log('invalid referrer');
    return { message: 'Invalid referrer', statusCode: 405 };
  }
  if(payload.body.length > 500) {
    console.log('message too long')
    return { message: 'Message too long', statusCode: 405 }
  }
  if(payload.name.length > 100) {
    console.log('Name too long')
    return { message: 'Name too long', statusCode: 405 }
  }
  if(payload.email.length > 100) {
    console.log('Email too long')
    return { message: 'Email too long', statusCode: 405 }
  }
  if(!/^[\w\-\s]+$/.test(payload.body)) {
    console.log('dodgy message')
    return { message: 'Looks dodgy to me', statusCode: 405 }
  }
  // looks legit
  try {
    const result = await fetch(process.env.WEBINY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WEBINY_API_KEY}`
      },
      body: JSON.stringify({
        query: `
          mutation CreateCommentMutation($CommentInput: CommentInput!) {
            createComment(data: $CommentInput) {
              data {
                id
              }
            }
          }
        `,
        variables: {
          CommentInput: {
            name: payload.name,
            email: payload.email,
            body: payload.body ?? '',
            slug: payload.slug,
          }
        }
      })
    })
    const { data, errors } = await result.json();
    if(errors || data.error) {
      return {
        message: `${errors?.map(e => e?.message).join(', ')}`,
        statusCode: 302
      }
    }
    return {
      message: 'Comment sent',
      statusCode: 200
    }; 
  } catch (error) {
    return {
      message: `${error.toString()}`,
      statusCode: 302
    }
  }
}

module.exports = { handler }