export const Dropdown = () => {
    return (
        <div className="dropdown">
            <label tabIndex={0} className="btn m-1">Click</label>
            <div tabIndex={0} className="dropdown-content z-[1] card card-compact w-64 p-2 shadow bg-primary text-primary-content">
                <div className="card-body">
                    <h3 className="card-title">Card title!</h3>
                    <p>you can use any element as a dropdown.</p>
                </div>
            </div>
        </div>
    )
}