async function getComments() {
    try {
      const res = await fetch(`${import.meta.env.WEBINY_API_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.WEBINY_API_KEY}`
        },
        body: JSON.stringify({
            query: `
            query getComments {
              listComments {
                data {
                  id
                  body
                  name
                  article
                }
              }
            }
          `,
        })
    });
    const data = await res.json();
    if(!data) {
      console.log('No data');
      return;
    }
    if(data.errors) {
      console.log(data.errors);
      return;
    }
    return data.data.listComments.data;
    } catch (error) {
      console.log(error);
    }
}
export default getComments;