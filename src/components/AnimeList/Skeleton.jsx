const Skeleton = () => {
    return (
        <div className="flex flex-col gap-2 overflow-hidden animate-pulse">
            <div className="w-full aspect-[3/4] bg-gray-700/60 rounded"></div>
            <div className="flex flex-col mt-1 px-1 gap-1.5 rounded">
                <div className="h-4 bg-gray-700/60 w-full rounded"></div>
            </div>
        </div>
    )
}

export default Skeleton