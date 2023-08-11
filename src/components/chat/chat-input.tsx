import { useState, MutableRefObject } from 'react';
import { Message } from '@/types/message';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { TextAreaInput } from '@/components/ui/text-area-input';
import { ScrollToBottom } from '@/components/ui/buttons'

interface ChatInputProps {
    newMessage: string;
    setNewMessage: (newMessage: string) => void;
    messageIsStreaming: boolean;
    handleSendMessage: (message: Message) => void;
    stopConversationHandler: () => void;
    regenerateResponseHandler: () => Promise<void>;
    textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
    conversationLength: number;
    fileIsAttached: boolean;
    isMobile: boolean;
    showScrollToBottom: boolean;
    onScrollToBottomClick: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
    newMessage,
    setNewMessage,
    messageIsStreaming,
    handleSendMessage,
    stopConversationHandler,
    regenerateResponseHandler,
    textareaRef,
    conversationLength,
    fileIsAttached,
    isMobile,
    showScrollToBottom,
    onScrollToBottomClick
}) => {

    const [isTyping, setIsTyping] = useState<boolean>(false);
    const handleSend = () => {
        if (messageIsStreaming) {
            return;
        }

        if (newMessage.length > 0) {
            handleSendMessage({ role: 'user', content: newMessage });
        }
    };

    const handleOnKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {

        if (event.key === 'Enter' && !isTyping && !isMobile && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage({ role: 'user', content: newMessage });
        }
    }

    const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(event.target.value);
    };

    return (
        <div className='flex items-center justify-center'>
            <div className="fixed bottom-0 border-0 w-full dark:border-orange-200 bg-gradient-to-b from-transparent via-white to-white pt-6 dark:from-transparent dark:via-gray-800 dark:to-gray-800 md:pt-2">
                <div className="stretch mt-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:mt-[52px] md:last:mb-6 lg:mx-auto lg:max-w-3xl">
                    <div className="relative flex h-full flex-1 items-stretch md:flex-col" role="presentation">
                        <div className="h-full flex flew-row ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-around">
                            {messageIsStreaming ? (
                                <button
                                    className=" bg-white text-black dark:text-gray-100 dark:bg-gray-500 dark:hover:bg-gray-500 hover:bg-gray-200  hidden md:block btn btn-md relative btn-neutral -z-0 border-0 md:border"
                                    onClick={stopConversationHandler}
                                >
                                    <div className="flex w-full gap-2 items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                                        </svg>
                                        Stop Generating
                                    </div>
                                </button>
                            ) : conversationLength > 1 ? (
                                <button
                                    className=" bg-white text-black dark:text-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-200 hidden md:block btn btn-md relative btn-neutral -z-0 border-0 md:border"
                                    onClick={regenerateResponseHandler}
                                >
                                    <div className="flex w-full gap-2 items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                        </svg>
                                        Regenerate Response
                                    </div>
                                </button>

                            ) : null}
                            <div className="fixed right-20 mb-2 mr-2 hidden md:block">
                                <ScrollToBottom onClick={onScrollToBottomClick} />
                            </div>
                        </div>
                        <div className="relative flex mx-1 flex-col h-full flex-1 items-stretch border-black/10 bg-slate-100 shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:bg-gray-700 dark:text-white dark:focus:border-12 dark:shadow-[0_0_20px_rgba(0,0,0,0.10)] sm:mx-4 rounded-xl dark:outline-none outline-none">
                            <div className="flex flex-row md:flex-col pr-10 items-center w-full md:w-auto mr-0">
                                <TextAreaInput
                                    textareaRef={textareaRef}
                                    placeholder={`Send a message`}
                                    value={newMessage}
                                    onChange={handleOnChange}
                                    onKeyDown={handleOnKeyDown}
                                    onCompositionStart={() => setIsTyping(true)}
                                    onCompositionEnd={() => setIsTyping(false)}

                                />
                            </div>
                            <button
                                type="submit"
                                className={`absolute right-3 bottom-3.5 p-1 rounded-md text-neutral-800 opacity-90 ${newMessage.length === 0 && !fileIsAttached ? 'bg-transparent text-neutral-800 opacity-60' : 'bg-fuchsia-400 text-neutral-100'} dark:bg-opacity-50 dark:text-neutral-100 dark:hover:text-neutral-900 duration-100 transition-all`}
                                onClick={handleSend}
                                disabled={newMessage.length === 0 && !fileIsAttached || messageIsStreaming}
                                hidden={messageIsStreaming}
                            >
                                <PaperAirplaneIcon className={`duration-100 text-slate-100 transition-all ${newMessage.length === 0 && !fileIsAttached ? 'h-0 w-0' : 'h-5 w-5'}`} />
                            </button>
                            {messageIsStreaming && <span className="absolute right-3 bottom-4 loading loading-bars loading-md text-fuchsia-400"></span>
                            }
                        </div>
                        {/* Mobile buttons container */}
                        <div className="md:hidden flex flex-col gap-2 mx-2 mt-1">

                            {messageIsStreaming ? (
                                <button className="btn btn-square btn-outline" onClick={stopConversationHandler}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            ) : conversationLength > 1 ? (
                                <button className="btn btn-square btn-outline" onClick={regenerateResponseHandler}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { ChatInput };