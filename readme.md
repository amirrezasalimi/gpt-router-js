# Gpt Router Js

A simple router implementation for routing user inputs to predefined actions based on cosine similarity with token embeddings.

## Usage

1. Import the `Router` and `Route` interfaces:

    ```javascript
    import { Route, Router } from ".";
    ```

2. Define routes with associated samples and callbacks:

    ```javascript
    const routes: Route[] = [
        // ... define your routes ...
    ];
    ```

3. Implement an encoder function to convert input text into embeddings. Example using OpenAI embeddings:

    ```javascript
    import OpenAI from "openai";

    const ai = new OpenAI({
        apiKey: "your-openai-api-key",
        baseURL: "http://127.0.0.1:8000", // adjust as needed
        // ... other OpenAI configurations ...
    });

    const openaiEmbeddings = async (text) => {
    return await ai.embeddings.create({
        model: "",
        input: text,
    });
    };

    const encoder = async (text) => {
        const res = await openaiEmbeddings(text);
        return res.data[0].embedding;
    };
    ```

4. Create a new `Router` instance:

    ```javascript
    const router = new Router(routes, encoder);
    ```

5. Simulate user inputs and route them through the router:

    ```javascript
    const userInputs: string[] = [
        // ... provide user inputs for testing ...
    ];

    for (const input of userInputs) {
        await router.routeInput(input);
    }
    ```

Feel free to customize the routes, encoder, and user inputs for your specific use case.

## Contributing

Contributions are welcome! Feel free to submit issues or create pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
