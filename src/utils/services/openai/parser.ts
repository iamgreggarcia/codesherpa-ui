/**
 * Parses the data received from an OpenAI stream and returns a string representation of the parsed data.
 * @param data The data received from the OpenAI stream.
 * @returns A string representation of the parsed data.
 */
import { escapeJsonString } from "@/utils/util";
import { StreamResponse } from "@/types/streaming";


let buffer = "";
let isFirst = true;

export function parseOpenAIStreamData(data: string): string {
    const dataPrefix = "data: ";
    const events = data.split('\n').filter(event => event.startsWith(dataPrefix));

    let results = [];

    for (const event of events) {
        // Trim the prefix to get the data part
        let trimmedEvent = event.trim().substring(dataPrefix.length);

        if (trimmedEvent === "[DONE]") {
            if (buffer) {
                processBufferedData(buffer, results);
                buffer = "";
            }
            results.push("");
            continue;
        }

        buffer += trimmedEvent;

        if (buffer.endsWith('}')) {
            processBufferedData(buffer, results);
            buffer = "";
        }
    }

    // Adding a condition to check if the results array is not empty to prevent returning an undefined object.
    return results.length > 0 ? results.join('') : "";
}

function processBufferedData(data: string, results: string[]) {
    try {
        // Parse the JSON data
        const jsonData: StreamResponse = JSON.parse(data);

        if (jsonData.choices[0]?.delta?.function_call?.name) {
            isFirst = true;
            results.push(`{"function_call": {"name": "${jsonData.choices[0]?.delta?.function_call.name}", "arguments": "`);
        } else if (jsonData.choices[0]?.delta?.function_call?.arguments) {
            const argumentChunk: string = isFirst ? jsonData.choices[0].delta.function_call.arguments.trim() : jsonData.choices[0].delta.function_call.arguments;
            isFirst = false;
            results.push(`${escapeJsonString(argumentChunk)}`);
        } else if (jsonData.choices[0]?.finish_reason === 'function_call') {
            isFirst = true;
            results.push('"}}');
        } else {
            // Adding null check before pushing to results
            if (jsonData.choices[0]?.delta?.content) {
                results.push(jsonData.choices[0]?.delta?.content);
            }
            isFirst = true;
        }
    } catch (e) {
        console.log("Error at parseOpenAIStreamData")
        console.error("Error parsing JSON:", e);
        console.error("JSON data:", data);
    }
}
