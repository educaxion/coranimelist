const AnimeRecommendation = ({ recommendation }) => {
    const recList = recommendations?.notes?.map((node) => note.mediaRecommendation).filter(Boolean);
    if(!recList || recList.length === 0) return null;

    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text mb-4">Recommendations</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {recList.map((anime) => {
                    const title = anime.title?.english || anime.title?.romaji || "Untitled Anime"
                    const slug = createSlug(title)

                    return (
                        <Link
                        href={`/anime/${anime.id}/${slug}`} 
                        key={anime.id}
                        className="group cursor-pointer flex flex-col"
                        >
                            <div>
                                {anime.coverImage?.large &&(
                                    <Image
                                        src={anime.coverImage.extraLarge || anime.coverImage.large}
                                        alt={title}
                                        fill
                                        sizes="(max-width: 640px) "
                                    />
                                )}
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
        
    )
}

export default AnimeRecommendation