import { components } from '@/types/openai';

/**
 * Type definition for a stream response from the OpenAI API.
 */
export type StreamResponse = components['schemas']['CreateChatCompletionStreamResponse']

/**
 * Type definition for a response delta from a stream response.
 */
export type ResponseDelta = components['schemas']['ChatCompletionStreamResponseDelta'];