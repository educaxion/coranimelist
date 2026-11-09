const AnimeInfo = ({ anime }) => {
    const formatDate = (date) => {
        if(!date?.year) return "N/A"
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return `${months[(date.month || 1) - 1]} ${date.day || 1}, ${date.year}`
    }

    const studios = anime?.studios?.nodes?.filter(s => s.isAnimationStudio).map(s => s.name).join(", ") || "N/A"
    return (
        <div className="bg-[#040021] p-4 text-secondary text-sm space-y-4 shadow-lg border border-white/5">
            {/* format */}
            <div>
                <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Format</h4>
                <p className="text-sub mt-0.5">{anime?.format || "N/A"}</p>
            </div>

            {/* episodes */}
            <div>
                <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Episodes</h4>
                <p className="text-sub mt-0.5">{anime?.episodes || "N/A"}</p>
            </div>

            {/* episode duration */}
            {anime?.duration && (
            <div>
                <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Episode Duration</h4>
                <p className="text-sub mt-0.5">{anime.duration} MINS</p>
            </div>
            )}

            {/*=== status ===*/}
            <div>
                <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Status</h4>
                <p className="text-sub mt-0.5">{anime?.status}</p>
            </div>

            {/* start date */}
            <div>
                <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Release Date</h4>
                <p className="text-sub mt-0.5">{formatDate(anime?.startDate)}</p>
            </div>

            {/* season */}
            {anime?.season && (
            <div>
                <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Season</h4>
                <p className="text-sub mt-0.5">{anime?.season} {anime?.seasonYear}</p>
            </div>
            )}
            {/*=== average score ==== */}
            <div>
                <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Average Score</h4>
                <p className="text-sub mt-0.5">{anime?.averageScore ? `${anime.averageScore}%` : "N/A"}</p>
            </div>

            {/*=== mean score ==== */}
            <div>
                <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Mean Score</h4>
                <p className="text-sub mt-0.5">{anime?.meanScore ? `${anime.meanScore}%` : "N/A"}</p>
            </div>

            {/* studios */}
            <div>
                <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Studios</h4>
                <p className="text-sub mt-0.5">{studios}</p>
            </div>
            
            {/* Source */}
            <div>
                <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Source</h4>
                <p className="text-sub mt-0.5">{anime?.source || "N/A"}</p>
            </div>

            {/* Hashtag */}
            <div>
                <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Hashtag</h4>
                <p className="text-sub mt-0.5">{anime?.hashtag || "N/A"}</p>
            </div>
            
            {/* Genres */}
            {anime?.genres?.length > 0 && (
            <div>
                <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Genres</h4>
                <div className="flex flex-wrap gap-0.5">
                    {anime.genres.map((genre) => (
                        <span key={genre} className="bg-white/5 hover:bg-white/10 text-xs text-zinc-200 px-2.5 py-1 rounded-full transition">{genre}</span>
                    ))}
                </div>
            </div>
            )}

            {/* Alternative Titles */}
            <div className="pt-2 border-t space-y-3">
                {anime?.title?.romaji && (
                <div>
                    <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Romaji</h4>
                    <p className="text-sub mt-0.5">{anime.title.romaji}</p>
                </div>
                )}
                {anime?.title?.english && (
                <div>
                    <h4 className="text-xs font-semibold text-text uppercase tracking-wider">English</h4>
                    <p className="text-sub mt-0.5">{anime.title.english}</p>
                </div>
                )}
                {anime?.title?.native && (
                <div>
                    <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Native</h4>
                    <p className="text-sub mt-0.5">{anime.title.native}</p>
                </div>
                )}
            </div>
        </div>
    )
}

export default AnimeInfo