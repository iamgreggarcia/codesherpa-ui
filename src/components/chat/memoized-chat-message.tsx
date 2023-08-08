import { FC, memo } from 'react';
import {ChatMessage, ChatMessageProps } from '@/components/chat';

const MemoizedChatMessage: FC<ChatMessageProps> = memo(ChatMessage,
    (prevProps, nextProps) => {
        return prevProps.message.content === nextProps.message.content;
    }
);

export { MemoizedChatMessage }