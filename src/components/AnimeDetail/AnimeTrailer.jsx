const AnimeTrailer = ({ trailer }) => {
    // trailer checking
    if(!trailer || trailer.site?.toLowerCase() !== "youtube" || !trailer.id) {
        return null;
    }

    return (
        <div className="mt-10">
            <h2 className="text-lg font-semibold text-text mb-4">Trailer</h2>
            <div className="relative w-80 aspect-video overflow-hidden shadow-lg">
                <iframe
                    src={`https://www.youtube-nocookie.com/embed/${trailer.id}`}
                    title="Anime Trailer"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    )
}

export default AnimeTrailer