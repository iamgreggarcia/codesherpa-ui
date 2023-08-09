import {  AIStreamParser } from './stream-transformer'

export const parseOpenAIStreamData: AIStreamParser = (data: string): string => {
  try {
    const jsonData = JSON.parse(data);
    const content = jsonData.choices?.[0]?.delta?.content || '';
    return content;
  } catch (error) {
    return 'error parsing JSON';
  }
};