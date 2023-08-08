import { OpenAIEndpoints } from '@/constants/openai';
import { getFetchOptions, FetchOptions } from '@/utils/app/fetch';
import { AIStream, AIStreamCallbacks } from './stream-transformer';
import { Message } from '@/types/message'; 
import { parseOpenAIStreamData } from '@/utils/services/openai/parser';

export class OpenAIError extends Error {
    type: string;
    param: string;
    code: string;

    constructor(message: string, type: string, param: string, code: string) {
        super(message);
        this.name = 'OpenAIError';
        this.type = type;
        this.param = param;
        this.code = code;
    }
}

export async function OpenAIStream(
    model: string, 
    messages: Message[], 
    key: string, 
    functions?: any, 
    function_call?: string, 
    max_tokens?: number, 
    temperature?: number, 
    stream?: boolean, 
    signal?: AbortSignal,
    callbacks?: AIStreamCallbacks
  ): Promise<ReadableStream<string>> {
  
      const api_url = OpenAIEndpoints.CHAT_COMPLETIONS;
      const fetchOptions: FetchOptions = getFetchOptions(model, messages, key, functions, function_call, max_tokens, temperature, stream, signal);
  
      let response;
      try {
          response = await fetch(api_url, fetchOptions);
      } catch (error) {
          throw new Error(`Network error: ${(error as Error).message}`);
      }
  
      if (response.status !== 200) {
          let result;
          try {
              result = await response.json();
          } catch (error) {
              throw new Error(`Response parsing error: ${(error as Error).message}`);
          }
          if (result.error) {
              throw new OpenAIError(
                  result.error.message,
                  result.error.type,
                  result.error.param,
                  result.error.code,
              );
          } else {
              const decoder = new TextDecoder();
              throw new Error(
                  `OpenAI API returned an error: ${decoder.decode(result?.value) || result.statusText
                  }`,
              );
          }
      }
  
      if (response.body) {
          // Removed the reading of response body here
          return AIStream(response, parseOpenAIStreamData, callbacks);
      } else {
          throw new Error('OpenAI API response body is null');
      }
  }
  
