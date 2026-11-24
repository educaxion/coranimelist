import Link from "next/link";
import { createSlug } from "../Utilities/slug";

const FavoriteTabs = ({ favorites = []}) => {
    if (favorites.length === 0) {
        return (
            <p className="text-text/50">
                You haven't added any favorites yet.
            </p>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-5 gap-y-8">
            {favorites.map((item) => {
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

                        <h3 className="text-text text-sm font-semibold mt-2 line-clamp-2 group-hover:text-accent transition">
                            {anime.title}
                        </h3>
                    </Link>
                )
            })}
        </div>
    )
}

export default FavoriteTabs
