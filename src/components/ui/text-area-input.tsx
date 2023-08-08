interface TextAreaInputProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    onCompositionStart: () => void;
    onCompositionEnd: () => void;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({
    value,
    onChange,
    onKeyDown,
    placeholder,
    textareaRef,
    onCompositionStart,
    onCompositionEnd,
}) => {

    return (
        <textarea
            ref={textareaRef}
            className="flex-grow outline-none m-0 w-full dark:border-none border border-black resize-none pl-4 bg-transparent py-4 sm:pl-8  text-black dark:bg-trans parent dark:text-white md:pl-[30px] rounded-md placeholder:text-gray-400 dark:placeholder:text-gray-300 pr-2 md:pr-0"
            style={{
                maxHeight: '400px',
                overflow: `${textareaRef.current && textareaRef.current.scrollHeight > 400 ? 'auto' : 'hidden'}`,
                minHeight: '56px',
                cursor: 'text',
                paddingLeft: `30px'`,
                paddingRight: '0px',
            }}
            placeholder={placeholder}
            value={value}
            rows={1}
            onCompositionStart={onCompositionStart}
            onCompositionEnd={onCompositionEnd}
            onChange={onChange}
            onKeyDown={onKeyDown}
        />
    );
};

export { TextAreaInput };