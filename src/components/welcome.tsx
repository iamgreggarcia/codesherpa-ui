import React, { useState } from 'react'
import Typewriter from 'typewriter-effect'

export default function Welcome() {
    const [showStatic, setShowStatic] = useState(false);

    const handleToggleAnimation = () => {
        setShowStatic(!showStatic);
    }

    return (
        <div className='flex flex-col items-center justify-between w-full px-4 md:px-24 text-2xl md:text-6xl text-black dark:text-fuchsia-100 pt-32'>
            <div className='flex-1 font-semibold'>API Key Required</div>
            <div className="flex-1 space-y-4 ">
                {showStatic ? (
                    <>
                        <div className="flex-1 md:text-5xl sm:text-3xl mt-12">
                            Open settings and add your  key or add it to <b><code>.env.local</code></b>.
                        </div>
                    </>
                ) : (
                    <div className='flex items-center text-5xl flex-row mt-12'>
                        <Typewriter
                            onInit={(typewriter) => {
                                typewriter
                                    .pauseFor(1000)
                                    .typeString('Open settings and add your  key')
                                    .pauseFor(2000)
                                    .deleteAll()
                                    .pauseFor(1000)
                                    .typeString('Or add it to <b><code>.env.local</code></b>')
                                    .pauseFor(2000)
                                    .deleteAll()
                                    .start()
                            }}
                            options={{
                                loop: true,
                                delay: 10,
                            }}
                        />
                    </div>
                )}
            </div>
            <div className='fixed bottom-4 right-4'>
                <div className='flex flex-col items-center justify-between h-24'>
                    <a href='https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key' target="_blank"
                        className="link link-accent text-sm">Where do I find my API key?</a>
                    <button className="btn btn-md sm:btn-md md:btn-md lg:btn-md btn-outline" onClick={handleToggleAnimation}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {showStatic ? (' Show animation') : (' Hide animation')}
                    </button>
                </div>
            </div>
        </div>

    );
}