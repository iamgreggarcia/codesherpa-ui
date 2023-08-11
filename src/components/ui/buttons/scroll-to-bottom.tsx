
interface ScrollToBottomProps {
    onClick: () => void
}

const ScrollToBottom = ({ onClick }: ScrollToBottomProps) => {
    return (
        <button className='fixed btn btn-md btn-circle bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600' onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
        </button >
    )
}

export { ScrollToBottom };