# codesherpa-ui

A chatbot interface. I extracted the frontend from [codesherpa](https://github.com/iamgreggarcia/codesherpa-fe) and made it better.

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/codesherpa-ui.git
```
```bash
cd codesherpa-ui
```

# Install dependencies
```bash
npm install
```

# Start the development server
```bash
npm run dev
```

## Configuration

### OpenAI API Key

You can add the API key in two ways:

1. **Via Settings**: Open settings within the app and add your API key. This will save the key to `localStorage`.
2. **Environment Variable (Recommended)**: Add the API key in `.env.local` under `OPENAI_API_KEY`.

## Components Structure

- `Home`: The main container for managing chats, conversations, sidebar, and modals.
- `Chat`: Handles the chat interaction including sending, receiving, and displaying messages.
- `Sidebar`: Manages the chat list and options to create or select chats.
- `Welcome`: Displays an animated welcome message when the API key is not set.

## Contributing

Feel free to contribute to this project by submitting issues, pull requests, or providing feedback.

## License

[MIT](LICENSE)

---

Please make sure to replace `https://github.com/your-username/codesherpa-ui.git` with the correct repository URL if needed.