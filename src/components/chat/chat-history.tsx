import { Chat as ChatType } from '@/types/chat'
import { ChatContext, ChatItem } from '@/components/chat'
import { useContext } from 'react'

interface ChatHistoryProps {
    selectConversation: (conversation: ChatType) => void;
    currentConversation: ChatType | null;
}

const ChatHistory = ({ selectConversation, currentConversation }: ChatHistoryProps) => {
    const { conversations: chats, messageIsStreaming } = useContext(ChatContext);

        return (
            <div className={`${messageIsStreaming ? "pointer-events-none opacity-50 cursor-not-allowed" : ""} overflow-y-auto overflow-x-hidden scrollbar-trigger relative h-full w-full flex-1 items-start border-white/20`}>
                <h2 style={{ position: 'absolute', border: '0px', width: '1px', height: '1px', padding: '0px', margin: '-1px', overflow: 'hidden', clip: 'rect(0px, 0px, 0px, 0px)', whiteSpace: 'nowrap', overflowWrap: 'normal' }}>Chat history</h2>
                <nav className={`flex h-full w-full flex-col p-2`} aria-label="Chat history">
                    {chats.map((chat) => (
                        <div className='' key={chat.id} onClick={() => selectConversation(chat)}>
                            <ChatItem id={chat.id} name={chat.title} isSelected={currentConversation?.id === chat.id} />
                        </div>
                    ))}
                </nav>
            </div>
        );
    };

    export { ChatHistory };
