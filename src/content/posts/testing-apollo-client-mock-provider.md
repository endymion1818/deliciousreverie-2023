---
title: "Testing with Apollo Client mock provider"
description: "Apollo's MockProvider is a great tool for testing mutations, however it's a little bit magical, making errors a little difficult to find. If your testing your error state, this might come in handy.
"
tags: 
  - javascript
  - graphql
datePublished: 2022-01-02
---

Published on Sunday, 2 January 2022

Apollo's MockProvider is a great tool for testing mutations, however it's a little bit magical, making errors a little difficult to find. If your testing your error state, this might come in handy.

I'm currently building a UI for a messages app, but encountered issues when testing sending new messages. Here's my component:

```javascript
export function SubmitForm() {
    const [message, setMessage] = useState('');
    const [submitMessage, { loading, error }] = useMutation(MESSAGE_MUTATION);

    return (
        <form
            onSubmit={event => {
                event.preventDefault();

                try {
                    submitMessage({
                        variables: {
                            SendMessageInput: {
                                body: message,
                            },
                        },
                    });
                    setMessage('');
                } catch {
                    console.log(error);
                }
            }}
        >
            {error && (
                <div>Sorry, there was a problem submitting your message</div>
            )}
            <fieldset>
                <label htmlFor="input">Compose message</label>
                <input
                    type="text"
                    id="input"
                    value={message}
                    onChange={event => setMessage(event.target.value)}
                />
            </fieldset>
            <button type="submit">Send message {loading && <Spinner />}</button>
        </form>
    );
}
```

I wrote a test suite for this component, all of which worked correctly, until I got to the stage when I was testing the error state:

```javascript
it('should render the error state UI', async () => {
        const mockErrorMutation = {
            request: {
                query: MESSAGE_MUTATION,
                variables: {
                    SendMessageInput: {
                        body: 'test',
                    },
                },
            },
            error: new Error('drat'),
        };

        render(
            <ThemeProvider theme={defaultTheme}>
                <MockedProvider mocks={[mockErrorMutation as any]}>
                    <SubmitForm />
                </MockedProvider>
            </ThemeProvider>
        );

        const inputField = screen.getByLabelText(/compose message/i);
        const button = screen.getByText('Send message');

        userEvent.type('test');
        fireEvent.click(button);

        await waitFor(() => {
            expect(
                screen.getByText(
                    /sorry, there was a problem submitting your message/i
                )
            ).toBeInTheDocument();
        });
    });
```

This test consistently failed, because all we ever got was the loading state. Yet manual testing passed fine.

The solution? Async the submitMessage() function:

```javascript
            onSubmit={async event => {
                event.preventDefault();

                try {
                    await submitMessage({
                        variables: {
                            SendMessageInput: {
                                body: message,
                            },
                        },
                    });
                    setMessage('');
                } catch {
                    console.log(error);
                }
            }}
```

Without making this asynchronous it would always fail. Ah well. All's well that ends well."