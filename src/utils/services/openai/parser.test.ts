import { parseOpenAIStreamData } from './parser';

describe('parseOpenAIStreamData', () => {
  it('should return an empty string if the input data is not valid JSON', () => {
    const invalidData = 'not valid JSON';
    expect(parseOpenAIStreamData(invalidData)).toEqual('error parsing JSON');
  });

  it('should return an empty string if the input JSON does not contain the expected structure', () => {
    const invalidData = '{"foo": "bar"}';
    expect(parseOpenAIStreamData(invalidData)).toEqual('');
  });

  it('should return the content of the first choice in the input JSON', () => {
    const validData = '{"choices": [{"delta": {"content": "hello world"}}]}';
    expect(parseOpenAIStreamData(validData)).toEqual('hello world');
  });

  it('should return an empty string if the input JSON does not contain any choices', () => {
    const invalidData = '{"foo": "bar"}';
    expect(parseOpenAIStreamData(invalidData)).toEqual('');
  });
});