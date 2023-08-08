import { Message } from '@/types/message';
import { Model, modelMap } from '@/constants/openai';

export interface FetchOptions {
  headers: {
    'Content-Type': string;
    Authorization: string;
  };
  method: string;
  body: string;
  signal?: AbortSignal;
}

/**
 * Creates the payload for an OpenAI API request.
 * @param model - The name of the OpenAI model to use.
 * @param messages - An array of messages to send to the model.
 * @param functions - An optional object containing custom functions to use with the model.
 * @param function_call - An optional string specifying the name of the function to call.
 * @param max_tokens - An optional number specifying the maximum number of tokens to generate.
 * @param temperature - An optional number specifying the "creativity" of the generated text.
 * @param stream - An optional boolean specifying whether to stream the response.
 * @returns The payload object to send in the API request.
 */
function createOpenAIPayload(
  model: string,
  messages: Message[],
  functions?: any,
  function_call?: string,
  max_tokens?: number,
  temperature?: number,
  stream?: boolean
) {
  let payload;
  // TODO: Add support for custom functions
  payload = {
    model: modelMap[model as Model].name,
    messages,
    max_tokens,
    temperature,
    stream,
  };

  return payload;
}

/**
 * Returns the options object for a fetch request to the OpenAI API.
 * @param model - The name of the OpenAI model to use.
 * @param messages - An array of messages to send to the model.
 * @param functions - An optional object containing custom functions to use with the model.
 * @param function_call - An optional string specifying the name of the function to call.
 * @param max_tokens - An optional number specifying the maximum number of tokens to generate.
 * @param temperature - An optional number specifying the "creativity" of the generated text.
 * @param stream - An optional boolean specifying whether to stream the response.
 * @param signal - An optional AbortSignal object to use for cancelling the request.
 * @returns The options object to use in a fetch request to the OpenAI API.
 */
export function getFetchOptions(model: string, messages: Message[], key: string, functions?: any, function_call?: string, max_tokens?: number, temperature?: number, stream?: boolean, signal?: AbortSignal) {

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${key ? key : process.env.OPENAI_API_KEY}`,
  };
  
  const options = {
    headers,
    method: 'POST',
    body: JSON.stringify(createOpenAIPayload(model, messages, functions, function_call, max_tokens, temperature, stream)),
    signal,
  };
  return options;
}