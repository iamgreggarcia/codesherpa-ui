/**
 * Represents a chat conversation.
 */
import { Model } from '@/constants/openai';
import { Message } from '@/types/message';

export interface Chat extends Record<string, any> {
    /** The unique identifier for the chat. */
    id: string
    /** The title of the chat. */
    title: string
    /** The list of messages in the chat. */
    messages: Message[]
    /** The OpenAI model used for generating responses. */
    model: Model
    /** The system prompt used for generating responses. */
    systemPrompt: string
}
