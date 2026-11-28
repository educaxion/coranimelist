const Item = ({label, children}) => (
    <div className="shrink-0 lg:shrink">
        <h4 className="text-xs font-semibold text-text uppercase tracking-wider">
            {label}
        </h4>
        <div className="text-text/50 mt-0.5 whitespace-nowrap lg:whitespace-normal">
            {children}
        </div>
    </div>
)

const AnimeInfo = ({ anime }) => {
    const formatDate = (date) => {
        if(!date?.year) return "N/A"
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return `${months[(date.month || 1) - 1]} ${date.day || 1}, ${date.year}`
    }

    const studios = anime?.studios?.nodes?.filter(s => s.isAnimationStudio).map(s => s.name).join(", ") || "N/A"
    return (
        <div className="bg-box p-4 text-sm space-y-4 shadow-lg flex flex-row gap-6 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden lg:flex-col lg:gap-4 lg:overflow-visible">
            <Item label="Format">{anime?.format || "N/A"}</Item>

            <Item label="Episodes">{anime?.episodes || "N/A"}</Item>

            {anime?.duration && 
            <Item label="Episode Duration">{anime.duration} MINS</Item>
            }

            <Item label="Status">{anime?.status || "N/A"}</Item>

            <Item label="Release Date">{formatDate(anime?.startDate)}</Item>

            {anime?.season && (
                <Item label="Season">{anime.season} {anime.seasonYear}</Item>
            )}

            <Item label="Average Score">{anime?.averageScore ? `${anime.averageScore}%` : "N/A"}</Item>

            <Item label="Mean Score">{anime?.meanScore ? `${anime.meanScore}%` : "N/A"}</Item>

            <Item label="Studios">{studios}</Item>
            
            <Item label="Source">{anime?.source || "N/A"}</Item>

            <Item label="Hashtag">{anime?.hashtag || "N/A"}</Item>
            
            {/* Genres */}
            {anime?.genres?.length > 0 && (
                <div className="bg-box shadow-lg shrink-0 lg:shrink">
                    <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Genres</h4>
                    <div className="flex flex-nowrap lg:flex-wrap gap-1.5 mt-1">
                        {anime.genres.map((genre) => (
                            <span key={genre} className="bg-white/5 hover:bg-white/10 text-xs text-text/90 px-2.5 py-1 rounded-full transition whitespace-nowrap">{genre}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Alternative Titles */}
            {anime?.title?.romaji && <Item label="Romaji">{anime.title.romaji}</Item>}
            {anime?.title?.english && <Item label="English">{anime.title.english}</Item>}
            {anime?.title?.native && <Item label="Native">{anime.title.native}</Item>}   
        </div>
    )
}

export default AnimeInfo