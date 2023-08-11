
/**
 * Based on code from vercel/ai-chatbot.tsx: https://github.com/vercel-labs/ai-chatbot/blob/main/lib/hooks/use-at-bottom.tsx
 */
import { useEffect, useState } from 'react';

/**
 * A hook that returns whether the user has scrolled to the bottom of the page or a specific element.
 * @param offset The offset from the bottom of the page or element at which to trigger the "at bottom" state.
 * @param elementRef A ref to the element to check for scrolling. If null, the entire page will be checked.
 * @returns A boolean indicating whether the user has scrolled to the bottom.
 */
export function useAtBottom(offset: number = 0, elementRef: React.RefObject<HTMLElement> | null = null) {
    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            let scrollY: number;
            let innerHeight: number;
            let offsetHeight: number;

            if (elementRef?.current) {
                scrollY = elementRef.current.scrollTop;
                innerHeight = elementRef.current.clientHeight;
                offsetHeight = elementRef.current.scrollHeight;
            } else {
                scrollY = window.scrollY;
                innerHeight = window.innerHeight;
                offsetHeight = document.body.offsetHeight;
            }

            setIsAtBottom(
                innerHeight + scrollY >= offsetHeight - offset
            );
        };

        const target = elementRef?.current ? elementRef.current : window;

        target.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            target.removeEventListener('scroll', handleScroll);
        };
    }, [offset, elementRef]);

    return isAtBottom;
}
