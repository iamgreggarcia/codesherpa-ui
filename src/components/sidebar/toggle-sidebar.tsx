export interface ToggleSidebarProps {
    onClick: () => void;
    visible?: boolean;
}

const ToggleSidebar = ({ onClick, visible }: ToggleSidebarProps) => {

    return (
        <span>
            <button
                aria-label="Show sidebar"
                className={`flex p-3 items-center gap-3 transition-colors duration-200 cursor-pointer text-sm rounded-md border ${visible ? 'bg-gray-700 hover:bg-gray-500 ' : 'bg-white hover:bg-gray-200'} dark:bg-gray-800 border-black/10 dark:border-white/20  dark:hover:bg-gray-700 h-11`}
                onClick={onClick}
            >
                {visible && <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`h-5 w-5 ${visible ? 'dark:text-white text-white' : 'text-black'} `}
                >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <path d="M9 3v18"></path>
                    <path d="m16 15-3-3 3-3"></path>
                </svg>}
                {!visible && <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-black dark:text-white"
                >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <path d="M9 3v18"></path>
                    <path d="m13 9 3 3-3 3"></path>
                </svg>}
            </button>
        </span>
    );
};

export { ToggleSidebar };