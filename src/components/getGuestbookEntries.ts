async function getGuestbookEntries() {
  try {
    const res = await fetch(`${import.meta.env.WEBINY_API_READ_URL}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.WEBINY_API_KEY}`
      },
      body: JSON.stringify({
          query: `
          query getEntries {
            listEntries {
              data {
                id
                createdOn
                title
                description
                link
              }
            }
          }
        `,
      })
  });
  if(res.status > 299) {
    console.log(JSON.stringify(res));
    return;
  }
  const data = await res.json();
  if(!data) {
    console.log('No data');
    return;
  }
  if(data.errors) {
    console.log(data.errors);
    return;
  }
  return data.data.listEntries.data;
  } catch (error) {
    console.log(error);
  }
}
export default getGuestbookEntries;