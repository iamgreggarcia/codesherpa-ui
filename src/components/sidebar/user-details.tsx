import { useState, useContext, useEffect } from 'react';
import { RoughNotation } from "react-rough-notation";
import Image from 'next/image';

import { ModalContext } from '@/components/ui/modal.context';


const UserDetails = () => {
    const { state: { apiKeyIsSet, serverSideApiKeySet }, dispatch } = useContext(ModalContext);
    const [showRoughNotation, setShowRoughNotation] = useState<boolean>(false);

    const openSettings = () => {
        dispatch({ type: 'OPEN_MODAL' })
    }

    useEffect(() => {
        !apiKeyIsSet && !serverSideApiKeySet ? setShowRoughNotation(true) : setShowRoughNotation(false);
    }, [apiKeyIsSet, serverSideApiKeySet]);

    return (
        <div className="relative">
            <div className='divider px-4'></div>
            <button
                className="w-60 flex flex-row justify-between items-center gap-2.5 rounded-md p-2 m-2 text-sm transition-colors duration-200 hover:bg-gray-700 group-ui-open:bg-gray-700"
                onClick={openSettings}
            >
                <div className="flex-shrink-0">
                    <Image src='/user-avatar-white.svg' alt="User avatar" width={30} height={30}
                        className={'p-2 rounded-md shadow-xl bg-fuchsia-600'} />
                </div>
                <div className='w-full text-left pl-4 text-gray-200 dark:text-white font-semibold'>
                    <RoughNotation animationDelay={4000} type="box" padding={14} animationDuration={2000} color="rgb(253 224 71)" strokeWidth={2} show={showRoughNotation}>
                        <p>Settings</p>
                    </RoughNotation>
                </div>
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 flex-shrink-0 text-gray-500" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                </svg>
            </button>
        </div>
    );
};

export { UserDetails };
