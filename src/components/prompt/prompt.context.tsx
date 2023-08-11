import { createContext, useReducer, useMemo } from 'react'
import { useLocalStorage } from '@/hooks';
import { DEFAULT_SYSTEM_PROMPT } from '@/constants/openai';

interface PromptState {
    prompt: string;
    isDefault: boolean;
}

type PromptAction =
    { type: 'SET_PROMPT', payload: string }
    | { type: 'SET_LOCAL_PROMPT', payload: string }

const initialState: PromptState = {
    prompt: '',
    isDefault: true,
}

export const PromptContext = createContext<{ state: PromptState; dispatch: React.Dispatch<PromptAction> }>({
    state: initialState,
    dispatch: () => null,
})

export const PromptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [localPrompt, setLocalPrompt] = useLocalStorage('customPrompt', DEFAULT_SYSTEM_PROMPT);

    const reducer = (state: PromptState, action: PromptAction) => {
        switch (action.type) {
            case 'SET_PROMPT':
                const newPrompt = action.payload;
                setLocalPrompt(newPrompt);
                const isDefault = newPrompt === DEFAULT_SYSTEM_PROMPT;
                return { ...state, prompt: newPrompt, isDefault };
            case 'SET_LOCAL_PROMPT':
                const isDefaultLocal = action.payload === DEFAULT_SYSTEM_PROMPT;
                const prompt = isDefaultLocal ? DEFAULT_SYSTEM_PROMPT : localPrompt;
                return { ...state, prompt, isDefault: isDefaultLocal };
            default:
                return state;
        }
    }

    const initialStateWithPrompt = {
        ...initialState,
        prompt: localPrompt,
        isDefault: localPrompt === DEFAULT_SYSTEM_PROMPT
    };

    const [state, dispatch] = useReducer(reducer, initialStateWithPrompt)

    const value = useMemo(() => {
        return { state, dispatch }
    }, [state])

    return <PromptContext.Provider value={value}>{children}</PromptContext.Provider>
}