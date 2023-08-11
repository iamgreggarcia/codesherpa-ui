import { AIStream } from './stream-transformer';
import { parseOpenAIStreamData } from './parser';
import { setup } from '@/tests/utils/mock-service';
if (typeof fetch === 'undefined') {
    global.fetch = require('node-fetch');
  }
  
describe('AIStream', () => {
    let mockService: ReturnType<typeof setup>;

    beforeAll(() => {
        mockService = setup();
    });

    afterAll((done) => {
        mockService.teardown(done);
    });



    it('should handle streaming response correctly', async () => {
        const url = `${mockService.api}?service=openai&type=chat`;
        const response = await fetch(url, {
            headers: {
                'x-mock-service': 'openai',
                'x-mock-type': 'chat',
            },
        });

        const callbacks = {
            onStart: jest.fn(),
            onToken: jest.fn(),
            onCompletion: jest.fn(),
        };

        const stream = AIStream(response, parseOpenAIStreamData, callbacks);

        const reader = stream.getReader();
        let result = '';
        let chunk;
        while (!(chunk = await reader.read()).done) {
            result += new TextDecoder().decode(chunk.value);
        }

        expect(callbacks.onStart).toHaveBeenCalled();
        expect(callbacks.onToken).toHaveBeenCalledTimes(mockService.getRecentFlushed().length);
        expect(callbacks.onCompletion).toHaveBeenCalledWith(result.trim());
        expect(result).toBe("Hello! How can I assist you today?");
    });
});
