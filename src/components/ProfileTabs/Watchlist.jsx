import Link from "next/link";
import { createSlug } from "../Utilities/slug";

const WatchlistTabs = ({ watchlist = []}) => {
    if (watchlist.length === 0) {
        return (
            <p className="text-text/50">
                Your watchlist is currently empty.
            </p>
        )
    }

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-5 gap-y-8">
            {watchlist.map((item) => {
                const anime = item.anime;

                if(!anime || !anime.sourceId) return null

                const slug = createSlug(anime.title)

                return (
                    <Link
                        key={item.id}
                        href={`/anime/${anime.sourceId}/${slug}`}
                        className="group"
                    >
                        <div className="aspect-3/4 overflow-hidden bg-accent">
                            <img
                                src={anime.coverImage}
                                alt={anime.title}
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            />
                        </div>

                        <h3 className="text-text text-xs sm:text-base leading-snug font-semibold mt-2 line-clamp-2 group-hover:text-accent transition">
                            {anime.title}
                        </h3>

                        <p className="text-text/50 text-[10px] sm:text-sm mt-1">
                            {item.status}
                        </p>
                    </Link>                    
                )
            })}
        </div>
    )
}

export default WatchlistTabs