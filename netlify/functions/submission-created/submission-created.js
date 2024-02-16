const handler = async (event) => {
  if(!event.body) {
    return Response.redirect('https//deliciousreverie.co.uk/404?success=false&error=No%20data%20to%20send', 302)
  }
  
  const { payload } = JSON.parse(event.body)
  
  // let's just check that shall we?
  if(!payload?.data) {
    return Response.redirect('https//deliciousreverie.co.uk/404?success=false&error=No%20data%20to%20send', 302)
  }
  const url = new URL(payload.data.referrer);
  const validReferrers = ['localhost', 'deliciousreverie.co.uk'];
  
  if (!validReferrers.includes(url.hostname)) {
    console.log('invalid referrer');
    return new Response('Invalid referrer', { status: 405 });
  }
  if(!payload.data.referrer.includes('localhost')) {
    console.log('invalid domain')
    return new Response('Invalid domain', { status: 405 })
  }
  if(payload.data.message.length > 500) {
    console.log('message too long')
    return new Response('Message too long', { status: 405 })
  }
  if(payload.data.name.length > 100) {
    console.log('Name too long')
    return new Response('Name too long', { status: 405 })
  }
  if(payload.data.email.length > 100) {
    console.log('Email too long')
    return new Response('Email too long', { status: 405 })
  }
  if(!/^[\w\-\s]+$/.test(payload.data.message)) {
    console.log('dodgy message')
    return new Response('Looks dodgy to me', { status: 405 })
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
      return Response.redirect(`${payload.data.referrer}?success=false&error=${errors.map(e => e.message).join(', ')}`, 302)
    }
    return Response.redirect(`${payload.data.referrer}?success=true`, 200)
  } catch (error) {
    return Response.redirect(`${payload.data.referrer}?success=false&error=${error.toString()}`, 302)
  }
}

module.exports = { handler }