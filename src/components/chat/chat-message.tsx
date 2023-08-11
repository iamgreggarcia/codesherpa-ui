import { useEffect, useState, useRef, useContext } from 'react';
import { Message } from '@/types/message';
import Image from "next/image";
import { EditIcon } from '@/components/icons';
import { ChatContext, MemoizedReactMarkdown, CodeBlock } from '@/components/chat';
import { useMediaQuery } from '@/hooks';

import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';


export type ChatMessageProps = {
  message: Message;
  lastMessage: Message;
  streamingMessageIndex?: number;
  isCurrentMessage: boolean;
  messageIndex: number;
  hoveredMessageIndex: number | null;
  setHoveredMessageIndex: React.Dispatch<React.SetStateAction<number | null>>;
  onEdit?: (editedMessage: Message) => void;
};

type AvatarProps = {
  role: string;
  lastMessageRole: string;
};

const Avatar: React.FC<AvatarProps> = ({ role, lastMessageRole }) => {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);
    const listener = (e: { matches: boolean | ((prevState: boolean) => boolean); }) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  if (role === 'assistant' || role === 'function') {
    return (
      <Image src={darkMode ? "/openai-white-logomark.svg" : "/openai-logomark.svg"} alt="Assistant avatar" width={40} height={40} className='p-2 rounded-md shadow-xl dark:bg-black bg-white' />
    );
  } else if (role === 'user') {
    return (
      <Image src={darkMode ? "/user-avatar-white.svg" : "/user-avatar-white.svg"} alt="User avatar" width={40} height={40}
        className={'p-2 rounded-md shadow-xl dark:bg-fuchsia-600 bg-black'} />
    );
  } else if (role === 'function') {
    return (
      <Image src={darkMode ? "/function-avatar-white.svg" : "/function-avatar.svg"} alt="Function avatar" width={30} height={30} />
    );
  } else {
    return null;
  }
};

type CollapsibleSectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  isStreaming?: boolean;
  isCurrentMessage?: boolean;
};

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, className = "", isStreaming, isCurrentMessage }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`flex flex-col items-start ${className}`}
    >
      <div className="flex items-center text-xs rounded p-3 text-gray-900 bg-gray-100" onClick={() => setIsOpen(!isOpen)}>
        <span className={`text-secondary mr-2 ${isStreaming && isCurrentMessage ? 'loading loading-spinner loading-sm' : 'hidden'}`} style={{ width: '1.5rem' }}></span>
        <div>{title}</div>
        <div className="ml-12 flex items-center gap-2" role="button">
          <div className="text-xs text-gray-600">{isOpen ? 'Hide work' : 'Show work'}</div>
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <polyline points={isOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
          </svg>
        </div>
      </div>
      {isOpen && <div className="mt-3 self-stretch">{children}</div>}
    </div>
  );
};

function checkContent(content: string) {
  return content.includes('{"function_call":') || content.includes('result:');
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentMessage, streamingMessageIndex, lastMessage, messageIndex, hoveredMessageIndex, setHoveredMessageIndex, onEdit }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [textAreaStartHeight, setTextAreaStartHeight] = useState<number>();
  const [newMessage, setNewMessage] = useState('');
  const { messageIsStreaming } = useContext(ChatContext);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isMobile = useMediaQuery('xs');

  const handleToggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }

  const handleCancelEditMessage = () => {
    setNewMessage(message.content || '');
    setIsEditing(false);
  };

  const handleSaveAndSubmitMessage = () => {
    if (onEdit) {
      onEdit({ ...message, content: newMessage });
    }
    setIsEditing(false);
  }

  const copyToClipboard = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  };

  let content = message.content;
  if (messageIsStreaming && isCurrentMessage && message.role !== 'user') {
    content += '▍';
  }


  useEffect(() => {
    if (message.content) {
      setNewMessage(message.content);
    }
  }, [message.content]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);


  return (
    <div
      className={`group md:px-4 w-full ${message.role === 'user'
        ? 'border-b border-black/15  text-[#1e232a] dark:border-gray-900/50'
        : 'border-0 border-black/15 bg-slate-100 dark:border-gray-900/50 dark:bg-gray-700'
        }`}
      style={{ overflowWrap: 'anywhere' }}
      onMouseEnter={() => setHoveredMessageIndex(messageIndex)}
      onMouseLeave={() => setHoveredMessageIndex(null)}
    >
      <div className="overflow-x-auto w-full relative m-auto flex p-4  md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
        <div className="min-w-[40px] text-right font-bold mr-5 sm:mr-4">
          {((message.role === 'user') ||
            (message.role === 'assistant' && lastMessage.role === 'user') ||
            (message.role === 'function' && lastMessage?.role === 'user')) &&
            <Avatar role={message.role} lastMessageRole={lastMessage.role} />}
        </div>
        {!isEditing && (
          <div>
            {/** Copy to clipboard button */}
            <button onClick={copyToClipboard} className="w-5 h-5 hover:text-gray-700 text-gray-900 dark:hover:text-gray-200 dark:text-gray-300 absolute right-1 top-1 transition-all duration-300 ease-in-out" style={{ opacity: hoveredMessageIndex === messageIndex ? 1 : 0, visibility: hoveredMessageIndex === messageIndex ? 'visible' : 'hidden' }}>
              {copySuccess ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
              )}
            </button>
            {message.role === 'user' && (
              <button onClick={handleToggleEditing} className="w-5 h-5 hover:text-gray-700 text-gray-900 dark:hover:text-gray-200 dark:text-gray-300 absolute right-6 top-1 transition-all duration-300 ease-in-out" style={{ opacity: hoveredMessageIndex === messageIndex ? 1 : 0, visibility: hoveredMessageIndex === messageIndex ? 'visible' : 'hidden' }} >
                <EditIcon />
              </button>
            )}
          </div>
        )}

        <div className="mt-[-2px] w-full">
          {isEditing && (
            <div>
              <div className="flex flex-col h-full">
                <textarea
                  ref={textareaRef}
                  className="outline-none m-0 w-full border-none resize-none bg-transparent sm:pl-8  text-black dark:bg-transparent dark:text-white md:pl-[30px] rounded-md placeholder:text-gray-400 dark:placeholder:text-gray-300"
                  value={newMessage}
                  style={{
                    lineHeight: 'inherit',
                    cursor: 'text',
                    paddingLeft: `30px'`,
                    paddingRight: '34px',
                    overflow: 'hidden',
                  }}
                  rows={1}
                  onCompositionStart={() => setIsTyping(true)}
                  onCompositionEnd={() => setIsTyping(false)}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mt-10 flex justify-center space-x-4">
                <button
                  onClick={handleSaveAndSubmitMessage}
                  className="btn btn-primary"
                  disabled={message.content === newMessage || newMessage.trim() === '' || isTyping}
                >Save & Submit</button>
                <button onClick={handleCancelEditMessage} className="btn btn-outline bg-gray-100 text-black dark:text-white hover:text-black hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-700">Cancel</button>
              </div>
            </div>
          )}

          {!isEditing && content && (
              checkContent(content) ?
              <CollapsibleSection title="Function call" isStreaming={messageIsStreaming} isCurrentMessage={isCurrentMessage} >
                <MemoizedReactMarkdown
                  className="dark:text-gray-50 prose break-words bg-gray-950 overflow-x-scroll p-4 dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                  remarkPlugins={[remarkGfm, remarkMath]}
                  components={{
                    p({ children }) {
                      return <p className="mb-2 last:mb-0">{children}</p>
                    },
                    code({ node, inline, className, children, ...props }) {
                      if (children.length) {
                        if (children[0] == '▍') {
                          return (
                            <span className="mt-1 animate-pulse cursor-default">▍</span>
                          )
                        }

                        children[0] = (children[0] as string).replace('▍', '▍')
                      }

                      const match = /language-(\w+)/.exec(className || '')

                      if (inline) {
                        return (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        )
                      }

                      return (
                        <>
                          <CodeBlock
                            key={Math.random()}
                            language={(match && match[1]) || ''}
                            value={String(children).replace(/\n$/, '')}
                            isCurrentMessage={isCurrentMessage}
                            isStreaming={messageIsStreaming}
                            {...props}
                          />
                        </>
                      )
                    }
                  }}
                >
                  {content}

                </MemoizedReactMarkdown >
              </CollapsibleSection>
              :
              <MemoizedReactMarkdown
                className="dark:text-slate-200 text-black prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                remarkPlugins={[remarkGfm, remarkMath]}
                components={{
                  p({ children }) {
                    return <p className="mb-2 last:mb-0">{children}</p>
                  },
                  code({ node, inline, className, children, ...props }) {
                    if (children.length) {
                      if (children[0] == '▍') {
                        return (
                          <span className="mt-1 animate-pulse cursor-default">▍</span>
                        )
                      }

                      children[0] = (children[0] as string).replace('▍', '▍')
                    }

                    const match = /language-(\w+)/.exec(className || '')

                    if (inline) {
                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    }

                    return (
                      <>
                        <CodeBlock
                          key={Math.random()}
                          language={(match && match[1]) || ''}
                          value={String(children).replace(/\n$/, '')}
                          isCurrentMessage={isCurrentMessage}
                          isStreaming={messageIsStreaming}
                          {...props}
                        />
                      </>
                    )
                  }
                }}
              >
                {content}
              </MemoizedReactMarkdown>
          )}
        </div>
      </div>
    </div >
  );
};

export { ChatMessage };