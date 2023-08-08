
import { useContext } from 'react';

import { FunctionCallingTabContent, GeneralTabContent } from '@/components/settings'

import { ModalContext } from '@/components/ui/modal.context';

interface ModalProps {
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  const { state, dispatch } = useContext(ModalContext);

  const setActiveTab = (tabName: string) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tabName });

  const onClose = () => dispatch({ type: 'CLOSE_MODAL' });

  const stopPropagation = (event: React.MouseEvent) => event.stopPropagation();

  const tabs = ['General'];

  if (!state.modalIsOpen) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-50" onClick={onClose}>
      <div className="fixed inset-0 bg-gray-500/90 dark:bg-gray-800/90">
        <div className="grid-cols-[10px_1fr_10px] grid h-full w-full grid-rows-[minmax(10px,_1fr)_auto_minmax(10px,_1fr)] md:grid-rows-[minmax(20px,_1fr)_auto_minmax(20px,_1fr)] ">
          <div role="dialog" className="overflow-y-auto relative col-auto col-start-2 row-auto row-start-2 w-full rounded-lg text-left shadow-xl transition-all left-1/2 -translate-x-1/2 bg-gray-200 dark:bg-gray-900 md:max-w-[680px]" tabIndex={-1} onClick={stopPropagation}>
            <div className="px-4 pb-4 pt-5 sm:p-6 flex items-center justify-between border-b border-black/10 dark:border-white/10">
              <div className="flex items-center">
                <div className="text-center sm:text-left">
                  <h2 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200">Settings</h2>
                </div>
              </div>
              <button className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" onClick={onClose}>
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="p-4 sm:p-6 sm:pt-4 flex flex-col gap-6 md:flex-row">
              <div role="tablist" aria-orientation="vertical" className="-ml-[8px] flex min-w-[180px] flex-shrink-0 flex-col">
                {tabs.map(tab => (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={state.activeTab === tab}
                    aria-controls={`${tab}-content`}
                    onClick={() => setActiveTab(tab)}
                    key={tab}
                    className={`group flex items-center justify-start gap-2 rounded-md px-2 py-1.5 text-sm ${state.activeTab === tab ? 'bg-gray-800 text-white' : 'text-gray-500'}`}
                    tabIndex={-1}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="w-full md:min-h-[300px]">
                {tabs.map(tab => (
                  <div
                    data-orientation="vertical"
                    role="tabpanel"
                    aria-labelledby={`${tab}-trigger`}
                    id={`${tab}-content`}
                    tabIndex={0}
                    className="w-full md:min-h-[300px]"
                    style={state.activeTab === tab ? {} : { display: 'none' }}
                    key={tab}>
                    {tab === 'General' && <GeneralTabContent />}
                    {tab === 'Function Calling' && <FunctionCallingTabContent />}
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
