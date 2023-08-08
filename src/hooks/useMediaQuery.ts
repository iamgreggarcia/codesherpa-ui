import { useState, useEffect } from 'react';

const screenSizes = {
    xs: '(max-width: 575px)',
    sm: '(min-width: 576px) and (max-width: 767px)',
    md: '(min-width: 768px) and (max-width: 991px)',
    lg: '(min-width: 992px) and (max-width: 1199px)',
    xl: '(min-width: 1200px)'
};

/**
 * Custom hook to evaluate and respond to media queries.
 * 
 * @param size - The predefined screen size key.
 * @returns Boolean indicating if the media query matches.
 */
const useMediaQuery = (size: keyof typeof screenSizes): boolean => {
    const query = screenSizes[size];
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const isClient = typeof window === 'object';
        if (!isClient) return;

        const mediaQueryList = window.matchMedia(query);
        setMatches(mediaQueryList.matches);

        const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
        mediaQueryList.addEventListener('change', handler);

        return () => mediaQueryList.removeEventListener('change', handler);
    }, [query]);

    return matches;
};

export { useMediaQuery };
