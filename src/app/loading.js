import Skeleton from "@/components/AnimeList/Skeleton"

const Loading = () => {
    const skeletonCounts = [...Array(6)]
    
    return (
        <main className="space-y-12 smLspace-y-16 p-4"> 
            {[1, 2, 3].map((sectionIndex) => (
                <section key={sectionIndex} className="space-y-4">
                    <div className="flex justify-between items-center px-1 animate-pulse">
                        <div className="h-8 bg-gray-700/70 w-40"></div>
                        <div className="h-8 bg-gray-700/70 w-20"></div>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {skeletonCounts.map((_, index) => (
                            <Skeleton key={index}/>
                        ))}
                    </div>
                </section>
            ))}
        </main>
    )
}

export default Loading