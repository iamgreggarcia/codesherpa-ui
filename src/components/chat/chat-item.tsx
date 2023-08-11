import { useState, useContext, useRef, useEffect } from 'react';
import { ChatContext } from '@/components/chat';
import { EditIcon, DeleteIcon, SaveIcon, CancelIcon, ChatIcon } from '@/components/icons';

type ChatItemProps = {
    id: string;
    name: string;
    isSelected: boolean;
};

const ChatItem = ({ id, name, isSelected }: ChatItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const currentNameRef = useRef(name);
    const chatClass = isSelected ? 'bg-opacity-50 bg-gray-700' : '';
    const inputRef = useRef<HTMLInputElement>(null);

    const { conversations, updateChat, removeConversation, messageIsStreaming } = useContext(ChatContext);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleDeleteClick = () => {
        setIsDeleting(true);
    };

    const handleCheckClick = () => {
        if (isEditing) {
            const chatToUpdate = conversations.find((chat) => chat.id === id);
            if (chatToUpdate) {
                chatToUpdate.title = currentNameRef.current;
                updateChat(chatToUpdate);
            }
        } else if (isDeleting) {
            removeConversation(id);
        }
        setIsEditing(false);
        setIsDeleting(false);
    };

    const handleXClick = () => {
        currentNameRef.current = name;
        setIsEditing(false);
        setIsDeleting(false);
    };


    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing, name, isDeleting, isSelected, conversations, inputRef]);

    return (
        <div className={`relative z-10 pl-2 right-1 py-1 ${messageIsStreaming ? 'pointer-events-none opacity-50' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <li className={`flex flex-row justify-between p-1 items-center gap-3 relative rounded-md cursor-pointer break-all  hover:bg-gray-700 transition-all  ${chatClass}`}>
                <div className="text-white pl-2">
                    <ChatIcon />
                </div>
                <div className={`flex-1 overflow-hidden whitespace-nowrap ${isEditing || isDeleting ? ' relative' : ''}`}>
                    {isEditing || isDeleting ? (
                        <input
                            type="text"
                            defaultValue={name}
                            onChange={(e) => {
                                currentNameRef.current = e.target.value;
                            }}
                            className="p-3 text-left left-0 gap-3 transition-colors duration-100 text-white dark:text-white text-sm rounded-md outline-none bg-transparent bg-opacity-30 h-11 flex-shrink-0 flex-grow cursor-text"
                            ref={inputRef}
                        />
                    ) : (
                        <>
                            <button
                                disabled={messageIsStreaming}
                                className={` ${messageIsStreaming ? 'disabled:cursor-not-allowed' : ''} flex p-3 items-center gap-3 transition-colors duration-100 text-white dark:text-white text-sm rounded-md h-11 flex-shrink-0 flex-grow text-left overflow-hidden text-ellipsis`}
                            >
                                {name}
                            </button>
                            {!isSelected && !isHovered && (
                                <div className="absolute inset-y-0 right-0 w-20 z-10 dark:bg-gradient-to-l dark:from-gray-900"></div>
                            )}
                        </>
                    )}
                </div>
                {isSelected &&
                    <div className="flex gap-2">
                        {isEditing || isDeleting ? (
                            <>
                                <button onClick={handleCheckClick} className={`text-gray-100 disabled:cursor-not-allowed`} disabled={messageIsStreaming}>
                                    <SaveIcon />
                                </button>
                                <button onClick={handleXClick} className={`text-gray-100 disabled:cursor-not-allowed`} disabled={messageIsStreaming}>
                                    <CancelIcon />
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={handleEditClick} className={`text-gray-100 disabled:cursor-not-allowed outline-none`} disabled={messageIsStreaming}>
                                    <EditIcon />
                                </button>
                                <button onClick={handleDeleteClick} className={`text-gray-100 disabled:cursor-not-allowed outline-none`} disabled={messageIsStreaming}>
                                    <DeleteIcon />
                                </button>
                            </>
                        )}
                    </div>}
            </li>
        </div>
    );
};

export { ChatItem };