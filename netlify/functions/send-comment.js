const handler = async (event) => {

  const { host } = event.headers;

  if(!event.body) {
    return {
      headers: {
        'Location': `${host}/404?success=false&error=No%20data%20to%20send` 
      }, 
      statusCode: 302
    }
  }
  
  console.log(event)
  
  // let's just check that shall we?
  if(!payload?.data) {
    return {
      headers: {
        'Location': `${host}/404?success=false&error=No%20data%20to%20send` 
      }, 
      statusCode: 302
    }
  }
  const url = new URL(host);
  const validReferrers = ['localhost', 'deliciousreverie.co.uk'];
  
  if (!validReferrers.includes(url.hostname)) {
    console.log('invalid referrer');
    return { message: 'Invalid referrer', statusCode: 405 };
  }
  if(!host.includes('localhost')) {
    console.log('invalid domain')
    return { message: 'Invalid domain', statusCode: 405 }
  }
  if(payload.data.message.length > 500) {
    console.log('message too long')
    return { message: 'Message too long', statusCode: 405 }
  }
  if(payload.data.name.length > 100) {
    console.log('Name too long')
    return { message: 'Name too long', statusCode: 405 }
  }
  if(payload.data.email.length > 100) {
    console.log('Email too long')
    return { message: 'Email too long', statusCode: 405 }
  }
  if(!/^[\w\-\s]+$/.test(payload.data.message)) {
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
            name: payload.data.name,
            email: payload.data.email,
            body: payload.data.message,
            article: payload.data.slug,
          }
        }
      })
    })
    const { data, errors } = await result.json();
    if(errors || data.error) {
      return {
        headers: {
          'Location': `${host}?success=false&error=${errors.map(e => e.message).join(', ')}` 
        }, 
        statusCode: 302
      }
    }
    return {
      headers: {
        'Location': `${host}?success=true` 
      }, 
      statusCode: 200 
  }
  } catch (error) {
    return {
      headers: {
        'Location': `${host}?success=false&error=${error.toString()}` 
      }, 
      statusCode: 302
    }
  }
}

module.exports = { handler }