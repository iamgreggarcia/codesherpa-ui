import { useState, useEffect, useRef, MutableRefObject, useCallback, useContext } from 'react';
import { Model, pathMap, serverUrl } from '@/constants/openai';
import { operations } from '@/utils/services/plugin-protocol/codesherpa';
import { ModelSelector } from '@/components/model-settings';
import { ChatMessage, ChatInput } from '@/components/chat';
import Welcome from '@/components/welcome';
import { OpenAIError } from '@/utils/util';
import { useMediaQuery } from '@/hooks';

import { Chat as ChatType } from '@/types/chat';
import { Message } from '@/types/message';

import "react-toastify/dist/ReactToastify.css";

import { ChatContext } from '@/components/chat/chat.context';
import { ModalContext } from '@/components/ui/modal.context';
import { PromptInput } from '@/components/prompt';

export interface ChatProps {
  conversation: ChatType;
  setConversation: React.Dispatch<React.SetStateAction<ChatType | null>>;
  updateChat: (updatedChat: ChatType) => void;
  selectedModel: Model;
  setSelectedModel: (model: Model) => void;
}

export function Chat({ conversation, setConversation, updateChat, selectedModel, setSelectedModel }: ChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isFunctionCall, setIsFunctionCall] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const cancelStreamRef: MutableRefObject<boolean> = useRef(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileIsAttached, setFileIsAttached] = useState<boolean>(false);
  const [resubmitLastMessage, setResubmitLastMessage] = useState(false);
  const [hoveredMessageIndex, setHoveredMessageIndex] = useState<number | null>(null);

  const { messageIsStreaming, setMessageIsStreaming, isNewChat, setIsNewChat } = useContext(ChatContext);
  const { state: { apiKeyIsSet, serverSideApiKeySet } } = useContext(ModalContext);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery('xs');

  const fetchChat = async (messages: Message[], abortController: AbortController) => {
    const key = localStorage.getItem('apiKey');
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: abortController.signal,
      body: JSON.stringify({ messages, model: selectedModel, key }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let assistantMessageContent = '';
    let isFunction = false;
    let first = true;
    let done = false;

    if (reader) {
      while (!done) {
        setMessageIsStreaming(true);
        if (cancelStreamRef.current === true) {
          abortController.abort();
          done = true;
          break;
        }
        const { done: doneReading, value } = await reader.read();
        done = doneReading;
        if (done) {
          break;
        }
        let decodedValue = decoder.decode(value);
        assistantMessageContent += decodedValue;

        try {
          const parsed = JSON.parse(assistantMessageContent);
          if (parsed.function_call) {
            isFunction = true;
            setIsFunctionCall(true);
          }
        } catch (error) { }

        setConversation(prevConversation => {
          if (prevConversation === null) {
            return null;
          }
          const updatedMessages = [...prevConversation.messages];
          const lastMessage = updatedMessages[updatedMessages.length - 1];
          if (isFunction) {
            if (first) {
              first = false;
              const assistantMessage: Message = { role: 'assistant', name: 'function_call', content: decodedValue ?? '' };
              const updatedConversation = { ...prevConversation, messages: [...prevConversation.messages, assistantMessage] };
              updateChat(updatedConversation);
              return updatedConversation;
            } else {
              lastMessage.content = assistantMessageContent;
              const updatedConversation = { ...prevConversation, messages: updatedMessages };
              updateChat(updatedConversation);
              return updatedConversation;
            }
          } else {
            if (first) {
              first = false;
              const assistantMessage: Message = { role: 'assistant', content: `\`\`\`${decodedValue}` ?? '' };
              const updatedConversation = { ...prevConversation, messages: [...prevConversation.messages, assistantMessage] };
              updateChat(updatedConversation);
              return updatedConversation;
            } else {
              lastMessage.content = assistantMessageContent;
              const updatedConversation = { ...prevConversation, messages: updatedMessages };
              updateChat(updatedConversation);
              return updatedConversation;
            }
          }
        });
      }
      setMessageIsStreaming(false);
    }
    return assistantMessageContent;
  };

  const handleSendMessage = useCallback(
    async (message: Message, deleteCount: number = 0) => {
      setMessageIsStreaming(true);
      setConversationStarted(true);

      let chatHistory: Message[] = [...conversation.messages];
      if (deleteCount) {
        chatHistory = chatHistory.slice(0, -deleteCount);
      }

      if (message) {
        const newUserMessage: Message = { role: 'user', content: message.content };
        setNewMessage('');

        chatHistory = [...chatHistory, newUserMessage];

        setConversation(prevConversation => {
          if (prevConversation === null) {
            return null;
          }
          const updatedConversation = { ...prevConversation, messages: chatHistory };
          updateChat(updatedConversation);
          return updatedConversation;
        });

        if (textareaRef.current) {
          textareaRef.current.style.height = "56px";
        }
        if (uploadedFileUrl) {
          newUserMessage.content += `\n\(Uploaded file: ${uploadedFileName})`;
          setFileIsAttached(false);
          setUploadedFileUrl(null);
          setUploadedFileName(null);
          setFileIsAttached(false);
        }
      }

      const abortController = new AbortController();
      try {
        let assistantMessageContent = await fetchChat(chatHistory, abortController);
        const functionCallIndex = assistantMessageContent.indexOf('{"function_call":');
        if (functionCallIndex !== -1) {
          const functionCallStr = assistantMessageContent.slice(functionCallIndex);
          console.log('functionCallStr: ', functionCallStr)
          const parsed = JSON.parse(functionCallStr);
          let functionName = parsed.function_call.name
          let functionArgumentsStr = parsed.function_call.arguments;
          const requestBody = functionArgumentsStr;
          let endpoint = pathMap[functionName as keyof operations];
          if (!endpoint) {
            const functionCallMessage: Message = { role: 'assistant', content: `I'm sorry, I used the incorrect function name '${functionName}'. Let me try again:\n` };
            setConversation(prevConversation => {
              if (prevConversation === null) {
                // Handle the case where the previous conversation is null
                return null;
              }
              const updatedConversation = { ...prevConversation, messages: [...prevConversation.messages, functionCallMessage] };
              updateChat(updatedConversation);
              return updatedConversation;
            });
            fetchChat([...conversation.messages, functionCallMessage], abortController);
          } else {
            const pluginResponse = await fetch(`${serverUrl}${endpoint}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: requestBody
            });
            const parsedFunctionCallResponse = await pluginResponse.json();
            const functionCallMessage: Message = { role: 'function', name: functionName, content: `result: ${parsedFunctionCallResponse.result}` ?? 'result: ok' };
            setConversation(prevConversation => {
              if (prevConversation === null) {
                // Handle the case where the previous conversation is null
                return null;
              }
              const updatedConversation = { ...prevConversation, messages: [...prevConversation.messages, functionCallMessage] };
              updateChat(updatedConversation);
              return updatedConversation;
            });
            fetchChat([...conversation.messages, functionCallMessage], abortController);
          }
        }
      } catch (error) {
        if (error instanceof OpenAIError) {
          alert(`OpenAIError: ${error.message}`);
        } else if (error instanceof Error) {
          alert(`Error: ${error.message}`);
        }
        setMessageIsStreaming(false);
        setIsFunctionCall(false);
        setNewMessage('');
      }
      setMessageIsStreaming(false);
      setIsFunctionCall(false);
      setNewMessage('');
    },
    [conversation, newMessage, selectedModel, cancelStreamRef, uploadedFileUrl, uploadedFileName, messageIsStreaming],
  );

  const stopConversationHandler = () => {
    setMessageIsStreaming(false);
    setNewMessage('');
    cancelStreamRef.current = true;
    setTimeout(() => {
      cancelStreamRef.current = false;
    }, 1000);
  };

  const regenerateResponseHandler = async () => {
    setMessageIsStreaming(true);
    const lastUserMessageIndex = conversation.messages.reduce((lastIndex, message, index) => {
      return message.role === 'user' ? index : lastIndex;
    }, -1);

    const lastUserMessage = conversation.messages[lastUserMessageIndex];
    if (lastUserMessageIndex === -1) {
      return;
    } else {
      setResubmitLastMessage(true);
      try {
        await handleSendMessage(lastUserMessage, conversation.messages.length - lastUserMessageIndex);
      } catch (error) {
        console.error('Failed to send message: ', error);
      }
    }
  };

  const handleToggleSystemPrompt = () => {
  }

  useEffect(() => {
    if (textareaRef.current) {
      if (newMessage === '') {
        textareaRef.current.style.height = '56px';
      } else {
        textareaRef.current.style.height = 'inherit';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        textareaRef.current.style.maxHeight = '400px';
        textareaRef.current.style.overflowY = textareaRef.current.scrollHeight > 200 ? 'auto' : 'hidden';
      }
    }
  }, [newMessage, textareaRef.current]);

  useEffect(() => {
    if (messageEndRef.current && conversation) {  // Fix: Ensure 'conversation' is not null or undefined
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (conversation?.messages.length > 1) {
      setConversationStarted(true);
      setIsNewChat(false)
    }
  }, [conversation?.messages, textareaRef.current]);

  useEffect(() => {
    const userMessageExists = conversation.messages.some(message => message.role === 'user');
    if (userMessageExists) {
      setConversationStarted(true);
    }
  }, [conversation]);

  return (
    <div className="relative h-full p-6 mx-0">
      {(!apiKeyIsSet && !serverSideApiKeySet) ?
        (<div className='flex flex-col items-center justify-center h-full'>
          <Welcome />
        </div>)
        :
        <>
          <div className={`absolute top-0 left-0 w-full border-transparent dark:border-white/20 
      ${conversationStarted ? 'pt-0 md:pt-0' : 'pt-8 md:pt-6'}`}>
            <div className={`flex flex-row justify-center z-40 items-center pt-0 mx-0 md:mx-0`}>
              <ModelSelector selectedModel={selectedModel ?? Model.GPT3_5_TURBO_16K_0613} setSelectedModel={setSelectedModel} conversationStarted={conversation.messages.length > 1} />

            </div>
            <div className="flex flex-row justify-center items-center w-auto">
              {!(conversation.messages.length > 1) && <PromptInput>

              </PromptInput>}
            </div>

            <div className="mx-2 mt-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:mt-[52px] md:last:mb-6 lg:mx-auto">
              <div className="flex-1 overflow-y-auto mt-12 mb-40 bg-transparent">
                {
                  conversation.messages.map((message: Message, index: number) => {
                    const lastMessage = index > 0 ? conversation.messages[index - 1] : 'na';
                    return (
                      message.role !== 'system' && (
                        <ChatMessage
                          key={index}
                          message={message}
                          streamingMessageIndex={conversation.messages.length - 1}
                          isCurrentMessage={index === conversation.messages.length - 1}
                          lastMessage={lastMessage as Message}
                          messageIndex={index}
                          hoveredMessageIndex={hoveredMessageIndex}
                          setHoveredMessageIndex={setHoveredMessageIndex}
                          onEdit={(editedMessage) => {
                            if (editedMessage.content) {
                              handleSendMessage(editedMessage, conversation.messages.length - index);
                            }
                          }}
                        />
                      )
                    );
                  })
                }
                <div ref={messageEndRef} />
              </div>
            </div>
          </div>
          <ChatInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            messageIsStreaming={messageIsStreaming}
            handleSendMessage={handleSendMessage}
            stopConversationHandler={stopConversationHandler}
            regenerateResponseHandler={regenerateResponseHandler}
            textareaRef={textareaRef}
            conversationLength={conversation.messages.length}
            fileIsAttached={fileIsAttached}
            isMobile={isMobile}
          />
        </>
      }
    </div>
  );
}
