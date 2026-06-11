/**
 * @type {import('@netlify/functions').Handler}
 */

/**
 * 
 * @param {Handler.event} event 
 * @returns 
 */
const handler = async (event) => {

  const { host } = event.headers;

  const validReferrers = ['localhost:8888', 'deliciousreverie.co.uk'];

  // let's just check that shall we?
  if(!event.body) {
    return {
      statusCode: 302,
      message: 'no data to send',
    }
  }

  const payload = JSON.parse(event.body);
  
  if (!validReferrers.includes(host)) {
    console.log('invalid referrer');
    return { message: `Invalid referrer (${host})`, statusCode: 405 };
  }
  if(payload.description.length > 500) {
    console.log('message too long')
    return { message: 'Message too long', statusCode: 405 }
  }
  if(payload.title.length > 100) {
    console.log('Name too long')
    return { message: 'Name too long', statusCode: 405 }
  }
  if(payload.link.length > 200) {
    console.log('Email too long')
    return { message: 'Email too long', statusCode: 405 }
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
          mutation CreateEntryMutation($EntryInput: EntryInput!) {
            createEntry(data: $EntryInput) {
              data {
                id
              }
            }
          }
        `,
        variables: {
          EntryInput: {
            title: payload.title,
            link: payload.link,
            description: payload.description ?? '',
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
      message: 'Entry sent',
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