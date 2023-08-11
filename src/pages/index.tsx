import {
  useState,
  useEffect,
  useContext,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GetServerSideProps } from 'next';
import { Chat as ChatType } from '@/types/chat';
import {
  saveConversation,
  saveConversations,
  getConversations,
  getSelectedConversation
} from '@/utils/app/chat';
import { DEFAULT_SYSTEM_PROMPT, Model } from '@/constants/openai';

import { Sidebar, ToggleSidebar } from '@/components/sidebar';
import { Chat, ChatContext } from '@/components/chat'
import Modal from '@/components/ui/modal';
import { ModalContext } from '@/components/ui/modal.context';
import { PromptContext } from '@/components/prompt';
import { useLocalStorage, useMediaQuery } from '@/hooks';

interface HomeProps {
  serverSideApiKeySet: boolean;
}

export default function Home({ serverSideApiKeySet }: HomeProps) {
  const [conversations, setConversations] = useState<ChatType[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ChatType | null>(null);
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(true);
  const [isNewChat, setIsNewChat] = useState<boolean>(false);
  const [messageIsStreaming, setMessageIsStreaming] = useState<boolean>(false);

  const { dispatch: modalDispatch } = useContext(ModalContext);
  const { state: { prompt }, dispatch: promptDispatch } = useContext(PromptContext);
  const [localPrompt] = useLocalStorage('customPrompt', DEFAULT_SYSTEM_PROMPT);

  const isMobile = useMediaQuery('xs');
  const isSmall = useMediaQuery('sm');
  const isMedium = useMediaQuery('md')
  
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const removeConversation = (id: string) => {
    setConversations(prevConversations => {
      const updatedConversations = prevConversations.filter(c => c.id !== id);
      saveConversations(updatedConversations);
      return updatedConversations;
    });
  };

  const addNewChat = () => {
    const newChat: ChatType = {
      id: uuidv4(),
      title: "New Chat",
      messages: [{ role: "system", content: prompt }],
      model: Model.GPT3_5_TURBO_16K_0613,
      systemPrompt: prompt
    };

    setIsNewChat(true);

    setConversations(prevConversations => {
      const updatedConversations = [newChat, ...prevConversations];
      saveConversation(newChat);
      saveConversations(updatedConversations);
      return updatedConversations;
    });
    setCurrentConversation(newChat)
  };

  const selectConversation = (conversation: ChatType) => {
    setIsNewChat(false);
    setCurrentConversation(conversation);
    setConversations(prevConversations => {
      const updatedConversations = prevConversations.map((c: ChatType) => {
        if (c.id === conversation.id) {
          return conversation;
        }
        if (currentConversation && c.id === currentConversation.id) {
          return currentConversation;
        }
        return c;
      });

      const updatedSelectedConversation = updatedConversations.find(c => c.id === conversation.id);

      setCurrentConversation(updatedSelectedConversation || null);
      saveConversation(updatedSelectedConversation || conversation);

      saveConversations(updatedConversations);
      return updatedConversations;
    });
  };

  const updateChat = (updatedChat: ChatType) => {
    const updatedConversations = conversations.map((c: ChatType) => {
      if (c.id === updatedChat.id) {
        return updatedChat;
      }
      return c;
    });
    saveConversations(updatedConversations);
    const afterSaveConversations = getConversations();
    saveConversation(updatedChat);
    const afterSaveConversation = getSelectedConversation();
    setConversations(afterSaveConversations);
    setCurrentConversation(afterSaveConversation);
  };

  useEffect(() => {
    const mostRecentConversation = conversations.length > 0 ? conversations[0] : null;
    if (!currentConversation || !conversations.some(c => c.id === currentConversation.id)) {
      if (mostRecentConversation) {
        selectConversation(mostRecentConversation);
      }
    }

    if (serverSideApiKeySet) {
      localStorage.removeItem('apiKey');
      modalDispatch({ type: 'SERVER_SIDE_API_KEY_SET', payload: serverSideApiKeySet });
    } else if (localStorage.getItem('apiKey')) {
      modalDispatch({ type: 'LOCAL_STORAGE_API_KEY_SET', payload: true });
    }

    if (localPrompt) {
      promptDispatch({ type: 'SET_PROMPT', payload: localPrompt });
    }

    if (conversations.length > 1) {
      modalDispatch({ type: 'SET_CHATS_CLEARED', payload: false });
    }

  }, [conversations, currentConversation, serverSideApiKeySet]);


  // On mount
  useEffect(() => {
    const savedConversations = getConversations();
    const savedCurrentConversation = getSelectedConversation();
    setConversations(savedConversations);
    setCurrentConversation(savedCurrentConversation);

    const mostRecentConversation = savedConversations.length > 0 ? savedConversations[0] : null;
    if (!mostRecentConversation) {
      addNewChat();
    } else {
      selectConversation(mostRecentConversation);
    }
  }, []);

  useEffect(() => {
    // Update isSidebarVisible based on isMobile after component mounts
    setSidebarVisible(!isMedium && !isSmall && !isMobile);
  }, [isMedium, isSmall, isMobile]);

  return (
    <ChatContext.Provider value={{
      conversations,
      setConversation: setCurrentConversation, updateChat, removeConversation, setMessageIsStreaming, messageIsStreaming, isNewChat, setIsNewChat
    }}>
      <main className={`flex ${isSidebarVisible ? 'flex-row' : ''}`}>
        {!isSidebarVisible &&
          (<div className='fixed left-2 top-4 z-50 md:inline-block'>
            <ToggleSidebar onClick={toggleSidebar} visible={isSidebarVisible} />
          </div>)
        }
        <div className='z-50'>
          <Sidebar
            onClick={toggleSidebar}
            visible={isSidebarVisible}
            addNewChat={addNewChat}
            selectConversation={selectConversation}
            currentConversation={currentConversation}
          />
        </div>
        <div className={`flex-1 transition-all duration-200 ${isSidebarVisible ? 'md:ml-64' : ''}`}>
          {currentConversation &&
            <Chat
              conversation={currentConversation}
              setConversation={setCurrentConversation}
              updateChat={updateChat}
              selectedModel={currentConversation.model}
              setSelectedModel={(model: Model) => {
                if (currentConversation) {
                  const updatedConversation = { ...currentConversation, model };
                  updateChat(updatedConversation);
                }
              }}
            />
          }
        </div>
        <Modal />
      </main>
    </ChatContext.Provider>
  );
}

// Users can set the OPENAI_API_KEY environment variable in .env.local 
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      serverSideApiKeySet: !!process.env.OPENAI_API_KEY
    }
  };
}