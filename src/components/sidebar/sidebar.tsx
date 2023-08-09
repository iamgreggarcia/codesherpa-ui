import { useContext } from 'react';

import { ChatHistory } from '@/components/chat';
import {UserDetails, ToggleSidebar, NewChatButton} from '@/components/sidebar';
import { Chat as ChatType } from '@/types/chat';

import { ModalContext } from '../ui/modal.context';

export interface SidebarProps {
    onClick: () => void;
    visible: boolean;
    addNewChat: () => void;
    selectConversation: (conversation: ChatType) => void;
    currentConversation: ChatType | null;
}

const Sidebar = ({ onClick, visible, addNewChat, selectConversation, currentConversation }: SidebarProps) => {
    const { state: { apiKeyIsSet, serverSideApiKeySet } } = useContext(ModalContext);

    return (
        <div className={`fixed h-screen bg-gray-700 dark:bg-gray-900 transition-transform duration-200 ease-in-out transform ${visible ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className=" w-[260px]">
                <div className="flex h-screen min-h-0 flex-col justify-between">
                    <div className="flex flex-row justify-between items-center mt-2 p-2 gap-2">
                        <NewChatButton addNewChat={addNewChat} disabled={!apiKeyIsSet && !serverSideApiKeySet} />
                        <ToggleSidebar onClick={onClick} visible={visible} />
                    </div>
                    {(apiKeyIsSet || serverSideApiKeySet) &&
                        <ChatHistory selectConversation={selectConversation} currentConversation={currentConversation} />
                    }
                    <UserDetails />
                </div>
            </div>
        </div>
    );
};
export { Sidebar };