async function getNows() {
  try {
    const res = await fetch(`${import.meta.env.WEBINY_API_READ_URL}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.WEBINY_API_KEY}`
      },
      body: JSON.stringify({
          query: `
          query getNows {
            listNows {
              data {
                id
                createdOn
                description
                image
                link
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
  return data.data.listNows.data;
  } catch (error) {
    console.log(error);
  }
}
export default getNows;