/**
 * Based on code from vercel/ai-chatbot.tsx: https://github.com/vercel-labs/ai-chatbot/blob/main/components/chat-scroll-anchor.tsx
 */
import { useEffect, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import { useAtBottom } from '@/hooks'

/**
 * Props for the ChatScrollAnchor component.
 */
interface ChatScrollAnchorProps {
    /**
     * Whether to track the visibility of the anchor element.
     */
    trackVisibility?: boolean;
}

/**
 * A component that serves as an anchor for scrolling to the bottom of a chat window.
 * @param trackVisibility Whether to track the visibility of the anchor element.
 * @returns A div element that serves as the anchor.
 * @example
 * import { ChatScrollAnchor } from '@/components'
 * 
 * <div className="chat-container">
 *   // ..
 *   <ChatScrollAnchor trackVisibility={true} />
 * </div>
 */
export function ChatScrollAnchor({ trackVisibility }: ChatScrollAnchorProps) {
    const isAtBottom = useAtBottom();

    const inViewConfig = useMemo(() => ({
        trackVisibility,
        delay: 100,
        rootMargin: '0px 0px -150px 0px'
    }), [trackVisibility]);

    const { ref, entry, inView } = useInView(inViewConfig);

    useEffect(() => {
        if (isAtBottom && trackVisibility && !inView) {
            entry?.target.scrollIntoView({
                block: 'start'
            });
        }
    }, [inView, entry, isAtBottom, trackVisibility]);

    return <div ref={ref} className="h-px w-full" />;
}
