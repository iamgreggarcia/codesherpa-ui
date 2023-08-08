import { createContext, useReducer, useMemo } from 'react';
import { clearConversations } from '@/utils/app/chat';

interface ModalState {
  modalIsOpen: boolean;
  activeTab: string;
  apiKey: string;
  serverSideApiKeySet: boolean;
  chatsCleared: boolean;
  apiKeyIsSet: boolean;
}

type ModalAction =
  { type: 'OPEN_MODAL' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_ACTIVE_TAB', payload: string }
  | { type: 'SET_API_KEY', payload: string }
  | { type: 'CLEAR_CHATS' }
  | { type: 'CLEAR_API_KEY' }
  | { type: 'SET_CHATS_CLEARED', payload: boolean }
  | { type: 'SERVER_SIDE_API_KEY_SET', payload: boolean }
  | { type: 'LOCAL_STORAGE_API_KEY_SET', payload: boolean}

const initialState: ModalState = {
  modalIsOpen: false,
  activeTab: 'General',
  apiKey: '',
  serverSideApiKeySet: false,
  chatsCleared: false,
  apiKeyIsSet: false,
};

export const ModalContext = createContext<{ state: ModalState; dispatch: React.Dispatch<ModalAction> }>({
  state: initialState,
  dispatch: () => null,
});

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const reducer = (state: ModalState, action: ModalAction) => {
    switch (action.type) {
      case 'OPEN_MODAL':
        return { ...state, modalIsOpen: true };
      case 'CLOSE_MODAL':
        return { ...state, modalIsOpen: false };
      case 'SET_ACTIVE_TAB':
        return { ...state, activeTab: action.payload };
      case 'SET_API_KEY':
        return { ...state, apiKey: action.payload };
      case 'CLEAR_API_KEY':
        return { ...state, apiKey: '' };
      case 'SET_CHATS_CLEARED':
        return { ...state, chatsCleared: action.payload };
      case 'SERVER_SIDE_API_KEY_SET':
        return { ...state, serverSideApiKeySet: action.payload };
      case 'LOCAL_STORAGE_API_KEY_SET':
        return { ...state, apiKeyIsSet: action.payload };
      default:
        return state;
    }
  };

  const [state, rawDispatch] = useReducer(reducer, initialState);

  const middleware = (dispatch: React.Dispatch<ModalAction>) => (action: ModalAction) => {
    if (action.type === 'CLEAR_CHATS') {
      clearConversations().then(chatsCleared => {
        dispatch({ type: 'SET_CHATS_CLEARED', payload: chatsCleared });
      });
    } else {
      dispatch(action);
    }
  }

  const dispatch = useMemo(() => middleware(rawDispatch), [rawDispatch]);

  return (
    <ModalContext.Provider value={{ state, dispatch }}>
      {children}
    </ModalContext.Provider>
  );
};
