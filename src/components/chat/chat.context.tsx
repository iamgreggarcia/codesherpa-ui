import { createContext } from 'react';
import { Chat } from '@/types/chat';

/**
 * Context for managing chat conversations and messages.
 */
interface ChatContextType {
    conversations: Chat[]; 
    setConversation: React.Dispatch<React.SetStateAction<Chat | null>>; 
    updateChat: (updatedChat: Chat) => void; 
    removeConversation: (id: string) => void;
    setMessageIsStreaming: React.Dispatch<React.SetStateAction<boolean>>;
    messageIsStreaming: boolean; 
    isNewChat: boolean;
    setIsNewChat: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * React context for managing chat conversations and messages.
 */
const ChatContext = createContext<ChatContextType>({
    conversations: [],
    setConversation: () => { },
    updateChat: () => { },
    removeConversation: () => { },
    setMessageIsStreaming: () => { },
    messageIsStreaming: false,
    isNewChat: false,
    setIsNewChat: () => {},
});

export { ChatContext };
