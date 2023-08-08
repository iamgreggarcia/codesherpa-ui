import { Chat } from '@/types/chat';

/**
 * Retrieves the list of all conversations from local storage.
 * @returns The list of all conversations.
 */
export const getConversations = (): Chat[] => {
  // console.log('Inside getConversations');
  if (typeof window === 'undefined') return [];
  const savedConversations = JSON.parse(localStorage.getItem('conversationHistory') || '[]');
  // console.log('Retrieved conversations from local storage: ' + JSON.stringify(savedConversations));
  return savedConversations;
};

/**
 * Retrieves the selected conversation from local storage.
 * @returns The selected conversation.
 */
export const getSelectedConversation = (): Chat | null => {
  if (typeof window === 'undefined') return null;
  const savedConversation = JSON.parse(localStorage.getItem('selectedConversation') || 'null');
  return savedConversation;
};

/**
 * Saves the given conversation to local storage at key "selectedConversation".
 * @param conversation The conversation to be saved.
 */
export const saveConversation = (conversation: Chat): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('selectedConversation', JSON.stringify(conversation));
    const savedConversation = localStorage.getItem('selectedConversation');
  }
};

/**
 * Saves the given conversations to local storage.
 * @param conversations An array of Chat objects representing the conversations to be saved.
 * @returns void
 */
export const saveConversations = (conversations: Chat[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('conversationHistory', JSON.stringify(conversations));
    const savedConversations = localStorage.getItem('conversationHistory');
  }
};

/**
 * Clears the conversations from local storage.
 * @returns A promise that resolves to a boolean indicating whether the conversations were successfully cleared.
 */
export const clearConversations = (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('selectedConversation');
        localStorage.removeItem('conversationHistory');
      }
      resolve(true);
    } catch (error) {
      console.error(error);
      resolve(false);
    }
  });
};

/**
 * Saves the API key to local storage.
 * @param apiKey - The API key to be saved.
 * @returns A promise that resolves to a boolean indicating whether the API key was successfully saved.
 */
export const saveApiKey = (apiKey: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('apiKey', apiKey);
      }
    } catch (error) {
      console.error(error);
      resolve(false);
    }
  })
};