import {
  createParser,
  EventSourceParser,
  ParsedEvent,
  ReconnectInterval
} from 'eventsource-parser'

export interface AIStreamCallbacks {
  onStart?: () => Promise<void> | void
  onCompletion?: (completion: string) => Promise<void> | void
  onToken?: (token: string) => Promise<void> | void
}

export interface AIStreamParser {
  (data: string): string | void
}

export function createEventStreamTransformer(
  customParser: AIStreamParser
): TransformStream<Uint8Array, string> {
  const textDecoder = new TextDecoder()
  let eventSourceParser: EventSourceParser

  return new TransformStream({
    async start(controller): Promise<void> {
      eventSourceParser = createParser(
        (event: ParsedEvent | ReconnectInterval) => {
          if (
            'data' in event &&
            event.type === 'event' &&
            event.data === '[DONE]'
          ) {
            controller.terminate()
            return
          }

          if ('data' in event) {
            const parsedMessage = customParser(event.data)
            if (parsedMessage) controller.enqueue(parsedMessage)
          }
        }
      )
    },

    transform(chunk) {
      eventSourceParser.feed(textDecoder.decode(chunk))
    }
  });
}

export function createCallbacksTransformer(
  callbacks: AIStreamCallbacks | undefined
): TransformStream<string, Uint8Array> {
  const textEncoder = new TextEncoder()
  let aggregatedResponse = ''
  const { onStart, onToken, onCompletion } = callbacks || {}

  return new TransformStream({
    async start(): Promise<void> {
      if (onStart) await onStart()
    },

    async transform(message, controller): Promise<void> {
      controller.enqueue(textEncoder.encode(message))

      if (onToken) await onToken(message)
      if (onCompletion) aggregatedResponse += message
    },

    async flush(): Promise<void> {
      if (onCompletion) await onCompletion(aggregatedResponse)
    }
  })
}

export function AIStream(
  response: Response,
  customParser: AIStreamParser,
  callbacks?: AIStreamCallbacks
): ReadableStream {
  if (!response.ok) {
    if (response.body) {
      const reader = response.body.getReader()
      return new ReadableStream({
        async start(controller) {
          const { done, value } = await reader.read()
          if (!done) {
            const errorText = new TextDecoder().decode(value)
            controller.error(new Error(`Response error: ${errorText}`))
          }
        }
      })
    } else {
      return new ReadableStream({
        start(controller) {
          controller.error(new Error('Response error: No response body'))
        }
      })
    }
  }

  const responseBodyStream = response.body || createEmptyReadableStream()

  return responseBodyStream
    .pipeThrough(createEventStreamTransformer(customParser))
    .pipeThrough(createCallbacksTransformer(callbacks))
}

function createEmptyReadableStream(): ReadableStream {
  return new ReadableStream({
    start(controller) {
      controller.close()
    }
  })
}
