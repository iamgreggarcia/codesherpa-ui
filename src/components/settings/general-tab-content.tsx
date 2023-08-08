import React, { useContext, useEffect } from 'react';
import { ModalContext } from '@/components/ui/modal.context';
import { EditIcon, SaveIcon, CancelIcon } from '@/components/icons';
import { saveApiKey } from '@/utils/app/chat';

const GeneralTabContent: React.FC = () => {
  const { state, dispatch } = useContext(ModalContext);
  const { apiKeyIsSet, chatsCleared } = state;

  const [isClearingChats, setIsClearingChats] = React.useState(false);
  const [showConfirmClearChats, setShowConfirmClearChats] = React.useState(false);
  const [apiKeyInput, setApiKeyInput] = React.useState('placeholder');
  const [isEditingApiKey, setIsEditingApiKey] = React.useState(false);
  const [showConfirmClearAPIKey, setShowConfirmClearAPIKey] = React.useState(false);

  const handleOnInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKeyInput(event.target.value);
  };

  const handleClearApiKey = () => {
    setShowConfirmClearAPIKey(true);
  };

  const handleConfirmClearApiKey = () => {
    setApiKeyInput('');
    saveApiKey('');
    dispatch({ type: 'LOCAL_STORAGE_API_KEY_SET', payload: false });
  };

  const handleCancelClearingAPIKey = () => {
    setShowConfirmClearAPIKey(false);
  };
  const handleEditApiKey = () => {
    setIsEditingApiKey(true);
  };

  const handleSaveApiKey = () => {
    dispatch({ type: 'LOCAL_STORAGE_API_KEY_SET', payload: true });
    saveApiKey(apiKeyInput);
    setApiKeyInput(apiKeyInput);
    setIsEditingApiKey(false);
  };

  const handleCancelApiKey = () => {
    setApiKeyInput(apiKeyInput);
    setIsEditingApiKey(false);
  };

  const handleClearChats = () => {
    setShowConfirmClearChats(true);
  };

  const cancelClearChats = () => {
    setShowConfirmClearChats(false);
  }

  const confirmClearChats = () => {
    setIsClearingChats(true);
    setTimeout(() => {
      dispatch({ type: 'CLEAR_CHATS' });
      console.log('CLEAR_CHATS', chatsCleared)
      setIsClearingChats(false);
      setShowConfirmClearChats(false);
      // TODO: consolidate ChatContext and ModalContext. For now we'll reload the window.
      window.location.reload();
    }, 2000);
  }

  useEffect(() => {
    setApiKeyInput(apiKeyInput);
    if (showConfirmClearAPIKey && !apiKeyIsSet) {
      setIsEditingApiKey(false);
      setShowConfirmClearAPIKey(false);
    }
    console.log('chatsCleared', chatsCleared);
  }, [apiKeyIsSet, showConfirmClearAPIKey, chatsCleared]);


  return (
    <div className='text-gray-900 dark:text-gray-200'>
      <div className='flex items-center min-h-16 justify-between border-b pb-3 last-of-type:border-b-0 dark:border-gray-700 transition-all duration-700'>
        {!showConfirmClearChats &&
          <>
            <div>Clear all chats</div>
            <button onClick={handleClearChats} disabled={chatsCleared} className='btn bg-red-600 hover:bg-red-700 text-white disabled:btn-disabled'>
              <div className='flex w-full gap-2 items-center justify-center'>Clear</div>
            </button>
          </>
        }
        {showConfirmClearChats && !isClearingChats &&
          <>
            <div className='font-semibold w-full'>Are you sure?</div>
            <div className='flex flex-row items-center justify-end gap-2 w-full'>
              <button onClick={cancelClearChats} className='btn btn-neutral text-white disabled:btn-disabled'>
                <div className='flex w-full gap-2 items-center justify-center'>Cancel</div>
              </button>
              <button onClick={confirmClearChats} disabled={chatsCleared} className='btn bg-green-600 hover:bg-green-700 text-white disabled:btn-disabled'>
                <div className='flex w-full gap-2 items-center justify-center'>Clear all</div>
              </button>
            </div>
          </>
        }
        {isClearingChats &&
          <div className='flex flex-row items-center justify-center gap-2 w-full'>
            <span className="loading loading-spinner text-secondary"></span>
          </div>
        }
      </div>
      <div>
        {!showConfirmClearChats && !showConfirmClearAPIKey &&
          <>
            <div className='flex flex-row items-center justify-between pb-3last-of-type:border-b-0 dark:border-gray-700 min-h-16'>
              <div className='w-full'>API Key</div>
              {isEditingApiKey ? (
                <div className='flex items-center'>
                  <input type='password' value={apiKeyInput} onChange={handleOnInputChange} className='border rounded-md px-2 py-1' />
                  <button onClick={handleSaveApiKey} className='btn btn-xs relative bg-green-600 hover:bg-green-700 text-white ml-2 '>
                    <SaveIcon />
                  </button>
                  <button onClick={handleCancelApiKey} className='btn btn-xs relative btn-primary ml-2'>
                    <CancelIcon />
                  </button>
                </div>
              ) : (
                <div className='flex items-center'>
                  <input type='password' value={apiKeyInput} disabled className='border-gray-500 text-gray-500 border rounded-md px-2 py-1' />
                  <button onClick={handleEditApiKey} className='btn btn-sm relative btn-primary ml-2'>
                    <EditIcon />
                  </button>
                </div>
              )}
            </div>
            {isEditingApiKey && apiKeyIsSet &&
              <div className='flex flex-row items-center justify-end mt-2'>
                <button onClick={handleClearApiKey} className='btn btn-md relative bg-red-600 hover:bg-red-700 text-white ml-2'>Clear API Key</button>
              </div>
            }
          </>
        }
        {showConfirmClearAPIKey && isEditingApiKey &&
          <>
            <div className='font-semibold w-full'>Are you sure you want to clear the saved API key?</div>
            <div className='flex flex-row items-center justify-end gap-2 w-full'>
              <button onClick={handleCancelClearingAPIKey} className='btn btn-neutral text-white disabled:btn-disabled'>
                <div className='flex w-full gap-2 items-center justify-center'>Cancel</div>
              </button>
              <button onClick={handleConfirmClearApiKey} className='btn bg-green-600 hover:bg-green-700 text-white disabled:btn-disabled'>
                <div className='flex w-full gap-2 items-center justify-center'>Clear</div>
              </button>
            </div>
          </>
        }
      </div>
    </div>
  );
};

export { GeneralTabContent };
