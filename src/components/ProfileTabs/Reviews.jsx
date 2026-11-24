import Link from "next/link";
import { createSlug } from "../Utilities/slug";

const ReviewTabs = ({ reviews = []}) => {
    if (reviews.length === 0) {
        return (
            <p className="text-text/50">
                You haven't written any reviews yet.
            </p>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            {reviews.map((item) => {
                const anime = item.anime;

                if(!anime) return null

                const slug = createSlug(anime.title)

                return (
                    <div
                        key={item.id}
                        className="flex gap-6"
                    >
                        {/** Anime Poster */}
                        <Link
                            href={`/anime/${anime.sourceId}/${slug}`}
                            className="w-24 sm:w-28 shrink-0 "
                        >
                            <div className="aspect-3/4 overflow-hidden">
                                <img
                                    src={anime.coverImage}
                                    alt={anime.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </Link>

                        {/** Information Review */}
                        <div className="flex-1 min-w-0 gap-4">
                            <Link
                                href={`/anime/${anime.sourceId}/${slug}`}
                                className="text-text text-xl font-semibold"
                            >
                                {anime.title}
                            </Link>

                            {anime.seasonYear && (
                                <span className="text-sub ml-2">
                                    {anime.seasonYear}
                                </span>
                            )}
                            <p className="text-text/50 text-sm">
                                Your review
                            </p>
                            
                            <p className="text-text/80 text-xs mt-4">
                                {item.content}
                            </p>
                        </div>
                    </div>                    
                )
            })}
        </div>
    )
}

export default ReviewTabs