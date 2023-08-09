export type ChatCompletionChunk = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content: string;
    };
    finish_reason: null;
  }>;
};

export const chatCompletionChunks = [
  {
    "id": "chatcmpl-7lMq5uZDjWhEhaXhw2tQ1rwzTIWDn",
    "object": "chat.completion.chunk",
    "created": 1691523565,
    "model": "gpt-3.5-turbo-16k-0613",
    "choices": [
      {
        "index": 0,
        "delta": {
          "content": "Hello"
        },
        "finish_reason": null
      }
    ]
  },
  {
    "id": "chatcmpl-7lMq5uZDjWhEhaXhw2tQ1rwzTIWDn",
    "object": "chat.completion.chunk",
    "created": 1691523565,
    "model": "gpt-3.5-turbo-16k-0613",
    "choices": [
      {
        "index": 0,
        "delta": {
          "content": "!"
        },
        "finish_reason": null
      }
    ]
  },
  {
    "id": "chatcmpl-7lMq5uZDjWhEhaXhw2tQ1rwzTIWDn",
    "object": "chat.completion.chunk",
    "created": 1691523565,
    "model": "gpt-3.5-turbo-16k-0613",
    "choices": [
      {
        "index": 0,
        "delta": {
          "content": " How"
        },
        "finish_reason": null
      }
    ]
  },
  {
    "id": "chatcmpl-7lMq5uZDjWhEhaXhw2tQ1rwzTIWDn",
    "object": "chat.completion.chunk",
    "created": 1691523565,
    "model": "gpt-3.5-turbo-16k-0613",
    "choices": [
      {
        "index": 0,
        "delta": {
          "content": " can"
        },
        "finish_reason": null
      }
    ]
  },
  {
    "id": "chatcmpl-7lMq5uZDjWhEhaXhw2tQ1rwzTIWDn",
    "object": "chat.completion.chunk",
    "created": 1691523565,
    "model": "gpt-3.5-turbo-16k-0613",
    "choices": [
      {
        "index": 0,
        "delta": {
          "content": " I"
        },
        "finish_reason": null
      }
    ]
  },
  {
    "id": "chatcmpl-7lMq5uZDjWhEhaXhw2tQ1rwzTIWDn",
    "object": "chat.completion.chunk",
    "created": 1691523565,
    "model": "gpt-3.5-turbo-16k-0613",
    "choices": [
      {
        "index": 0,
        "delta": {
          "content": " assist"
        },
        "finish_reason": null
      }
    ]
  },
  {
    "id": "chatcmpl-7lMq5uZDjWhEhaXhw2tQ1rwzTIWDn",
    "object": "chat.completion.chunk",
    "created": 1691523565,
    "model": "gpt-3.5-turbo-16k-0613",
    "choices": [
      {
        "index": 0,
        "delta": {
          "content": " you"
        },
        "finish_reason": null
      }
    ]
  },
  {
    "id": "chatcmpl-7lMq5uZDjWhEhaXhw2tQ1rwzTIWDn",
    "object": "chat.completion.chunk",
    "created": 1691523565,
    "model": "gpt-3.5-turbo-16k-0613",
    "choices": [
      {
        "index": 0,
        "delta": {
          "content": " today"
        },
        "finish_reason": null
      }
    ]
  },
  {
    "id": "chatcmpl-7lMq5uZDjWhEhaXhw2tQ1rwzTIWDn",
    "object": "chat.completion.chunk",
    "created": 1691523565,
    "model": "gpt-3.5-turbo-16k-0613",
    "choices": [
      {
        "index": 0,
        "delta": {
          "content": "?"
        },
        "finish_reason": null
      }
    ]
  }
]