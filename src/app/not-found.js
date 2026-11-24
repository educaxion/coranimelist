const NotFound = () => {
    return (
        <div className="relative left-1/2 flex w-screen min-h-[60vh] -translate-x-1/2 flex-col items-center justify-center px-4 text-center">
            <h2 className="text-2xl font-bold text-text">
                No Results
            </h2>

            <p className="mt-2 text-sm text-text/50">
                We couldn't find anything matching your search.
            </p>
        </div>
    );
};

export default NotFound;
