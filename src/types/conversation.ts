/**
 * Represents the author of a message.
 */
export type Author = {
    role: "system" | "user" | "assistant | function";
    name?: string;
    metadata: Record<string, any>;
}

/**
 * Represents the content of a message.
 */
export type Content = {
    content_type: "text";
    parts: string[];
}

/**
 * Represents a detailed message in a conversation.
 */
export type DetailedMessage = {
    id: string;
    author: Author;
    create_time: number;
    update_time: number | null;
    content: Content;
    status: "finished_successfully";
    end_turn: boolean | null;
    weight: number;
    metadata: Record<string, any>;
    recipient: "all";
}

/**
 * Represents a single node in the conversation mapping.
 */
export type ConversationNode = {
    id: string;
    message: DetailedMessage | null;
    parent: string | null;
    children: string[];
}

/**
 * Represents the mapping of a conversation.
 */
export type ConversationMapping = Record<string, ConversationNode>;

/**
 * Represents a conversation.
 */
export type Conversation = {
    title: string;
    create_time: number;
    update_time: number;
    mapping: ConversationMapping;
    moderation_results: any[];
    current_node: string;
    plugin_ids: null | string[];
    id: string;
}
