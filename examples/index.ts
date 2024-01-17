// Import the Router and Route interfaces

import OpenAI from "openai";
import { Route, Router } from "../src";

// Define some routes with associated samples and callbacks
const routes: Route[] = [
    {
        name: 'greeting',
        text: 'Hello, how are you?',
        samples: ['Hi', 'Hey', 'Greetings'],
        callback: (input) => console.log(`Greeting route executed with input: ${input}`),
    },
    {
        name: 'farewell',
        text: 'Goodbye, take care!',
        samples: ['Bye', 'See you later', 'Farewell'],
        callback: (input) => console.log(`Farewell route executed with input: ${input}`),
    },
    {
        name: 'question',
        text: 'What is your favorite color?',
        samples: ['Tell me your color', 'What color do you like?'],
        callback: (input) => console.log(`Question route executed with input: ${input}`),
    },
    {
        name: 'default',
        text: 'This is a default route',
        samples: [
            'This is a default route',
            'This is a default route with a long sample',
            'This is a default route with a long sample that is very long',
        ],
        callback: (input) => console.log(`Default route executed with input: ${input}`),
    },
];
const ai = new OpenAI({
    apiKey: "sk-",
    baseURL: "http://127.0.0.1:8000",
    defaultHeaders: {
        "HTTP-Referer": "http://localhost", // Optional, for including your app on openrouter.ai rankings.
        "X-Title": "rag test", // Optional. Shows in rankings on openrouter.ai.
    },
});
const openaiEmbeddings = async (text) => {
    return await ai.embeddings.create({
        model: "",
        input: text,
        encoding_format: "float"
    });
}
const encoder = async (text) => {
    const res = await openaiEmbeddings(text);
    return res.data[0].embedding;
}
const router = new Router(routes, encoder);

// Simulate user inputs
const userInputs: string[] = [
    "Hi",
    'what is your name?',
    "whats up?",
    'Hi, how are you doing?',
    'good to see you',
    'See you later!',
    'What color do you like?',
    'Random input for testing',
];

// Route each user input through the router
for (const input of userInputs) {
    await router.routeInput(input);
}