import { useContext } from "react";
import { PromptContext } from "./prompt.context";

interface PromptInputProps {
    children?: React.ReactNode;
}

const PromptInput: React.FC<PromptInputProps> = ({ children }) => {
    const { state: { prompt, isDefault }, dispatch } = useContext(PromptContext);

    const handlePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch({ type: 'SET_PROMPT', payload: event.target.value });
    }

    return (
        <div className="collapse border border-gray-500 bg-base-200 sm:w-full mx-4 lg:w-2/5 mt-4 collapse-plus">
            <input type="checkbox" className="peer" />
            <div className="collapse-title bg-gray-800 text-gray-400  peer-checked:bg-gray-900 peer-checked:text-gray-300">
                <div className="flex flex-row items-center justify-around">
                    <p>System prompt: <code className={`font-semibold ${isDefault ? '' : 'text-green-600'}`}>{isDefault ? 'Default' : 'Custom'}</code></p>
                </div>
            </div>
            <div className="collapse-content bg-gray-900 text-primary-content peer-checked:bg-gray-900 peer-checked:text-gray-400">
                <div className="flex flex-row items-center justify-start m-4">
                    {children} {/* Render the children */}
                </div>
                <div className="m-4">
                    <a href="https://platform.openai.com/docs/guides/gpt-best-practices" target="_blank" className="link text-gray-300">
                        GPT Best Practices
                    </a>
                </div>

                <div className="flex flex-row items-center">
                    <div className="w-full m-2">
                        <textarea
                            className={`w-full h-32 p-2 rounded-md shadow-md bg-gray-700 dark:bg-gray-700 text-gray-200 dark:text-200 `}
                            value={prompt}
                            onChange={handlePromptChange}
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { PromptInput }
