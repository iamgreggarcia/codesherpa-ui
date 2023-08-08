import { escapeJsonString } from "@/utils/util";
import { StreamResponse } from "@/types/streaming";

let buffer: string = "";
let isFirst: boolean = true;

/**
 * Parses the OpenAI streaming data and returns the parsed results as a string.
 * @param data The streaming data received from OpenAI's API.
 * @returns The parsed results as a string.
 */
export function parseOpenAIStreamData(data: string): string {
    // Split the data into individual events
    const dataPrefix: string = "data: ";
    const events: string[] = data.split('\n').filter(event => event.startsWith(dataPrefix));

    let results: string[] = [];

    for (const event of events) {
        let trimmedEvent: string = event.trim().substring(dataPrefix.length);

        // Check if the event indicates the end of a response
        if (trimmedEvent === "[DONE]") {
            if (buffer) {
                processBufferedData(buffer, results);
                buffer = "";
            }
            continue;
        }

        buffer += trimmedEvent;

        let match: RegExpExecArray | null;
        let regex: RegExp = /\{.*?\}(?=\{|$)/g;

        // Process the buffered data using regular expressions
        while ((match = regex.exec(buffer)) !== null) {
            processBufferedData(match[0], results);
            buffer = buffer.substring(match.index + match[0].length);
        }
    }

    // Process any remaining buffered data
    if (buffer) {
        processBufferedData(buffer, results);
        buffer = "";
    }

    return results.length > 0 ? results.join('') : "";
}

/**
 * Processes the buffered data received from OpenAI's API and appends the parsed results to the provided array.
 * @param data The data to be processed.
 * @param results The array to which the parsed results will be appended.
 * @returns void
 */
function processBufferedData(data: string, results: string[]): void {
    try {
        const jsonData: StreamResponse = JSON.parse(data);

        // Check if the response contains a function call name
        if (jsonData.choices[0]?.delta?.function_call?.name) {
            isFirst = true;
            results.push(`{"function_call": {"name": "${jsonData.choices[0]?.delta?.function_call.name}", "arguments": "`);
        }
        // Check if the response contains function call arguments
        else if (jsonData.choices[0]?.delta?.function_call?.arguments) {
            const argumentChunk: string = isFirst ? jsonData.choices[0].delta.function_call.arguments.trim() : jsonData.choices[0].delta.function_call.arguments;
            isFirst = false;
            results.push(`${escapeJsonString(argumentChunk)}`);
        }
        // Check if the response indicates the end of a function call
        else if (jsonData.choices[0]?.finish_reason === 'function_call') {
            isFirst = true;
            results.push('"}}');
        }
        // Check if the response contains content
        else if (jsonData.choices[0]?.delta?.content) {
            results.push(jsonData.choices[0]?.delta?.content);
            isFirst = true;
        }
    } catch (e) {
        console.error("Error parsing JSON:", e);
        console.error("JSON data:", data);
    }
}