
export async function handler(event) {
  const content = JSON.parse(event.body)
  return {
    body: JSON.stringify({
      message: `Hello, ${content}!`,
    }),
    statusCode: 200,
  };
}
