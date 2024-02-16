// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  console.log({ event })
  try {
    const subject = event.queryStringParameters.name || 'World'
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello ${subject}` }),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }


// body: '{"payload":{"name":"ben","email":"endymion1818@gmail.com","data":{"name":"ben","email":"endymion1818@gmail.com","message":"test","slug":"","ip":"::ffff:127.0.0.1","user_agent":"Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0","referrer":"http://localhost:8888/posts/2023-site-rebuild"},"created_at":"2024-02-16T19:41:24.598Z","human_fields":{"Name":"ben","Email":"endymion1818@gmail.com","Message":"test","Slug":""},"ordered_human_fields":[{"title":"Name","name":"name","value":"ben"},{"title":"Email","name":"email","value":"endymion1818@gmail.com"},{"title":"Message","name":"message","value":"test"},{"title":"Slug","name":"slug","value":""}],"site_url":"https://deliciousreverie.co.uk"}}',