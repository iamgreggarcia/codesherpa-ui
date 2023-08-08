import { useContext } from "react";
import { ChatContext } from "@/components/chat";

interface NewChatButtonProps {
    addNewChat: () => void;
    disabled?: boolean;
}

const NewChatButton: React.FC<NewChatButtonProps> = ({ addNewChat, disabled }) => {
    const { messageIsStreaming } = useContext(ChatContext);
    return (
        <button
            className={`disabled:pointer-events-none flex p-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer disabled:text-gray-400 disabled:border-gray-400 text-sm rounded-md border border-white/20 hover:bg-gray-500/10 h-11 flex-shrink-0 flex-grow ${messageIsStreaming ? 'disabled:cursor-not-allowed' : ''}`}
            onClick={addNewChat}
            disabled={messageIsStreaming || disabled}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Chat
        </button>
    );
};

export { NewChatButton };

