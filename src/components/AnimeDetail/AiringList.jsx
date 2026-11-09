import Image from "next/image"
import Link from "next/link"
import { createSlug } from "../Utilities/slug";

const AiringList = ({ list }) => {
    if(!list || list.length === 0) return null;

    return (
        <div className="flex flex-col gap-4">
            {list.map((anime, index) => {
                const title = anime.title?.english || anime.title?.romaji || "Untitled Anime"
                const slug = createSlug(title);
                
                return (
                    <Link
                        key={anime.id}
                        href={`/anime/${anime.id}/${slug}`}
                        className="group flex items-center justify-between bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 hover:border-white/10 p-3 sm:p-4 gap-4 transition duration-300"
                    >
                        <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                            {/* ranking number */}
                            <span className="text-lg sm:text-2xl font-bold text-sub w-8 sm:w-10 text-center shrink-0">#{index + 1}</span>

                            {/* poster */}
                            <div className="relative w-12 h-16 sm:w-16 sm:h-20 shrink-0 overflow-hidden shadow-md">
                                {anime.coverImage?.large && (
                                    <Image
                                        src={anime.coverImage.large}
                                        alt={title}
                                        fill
                                        sizes="80px"
                                        className="object-cover"
                                    />
                                )}
                            </div>

                            {/** Title & genre */}
                            <div className="min-w-0 flex-1 pr-2">
                                <h3 className="font-semibold text-sm sm:text-base text-text truncate group-hover:text-accent transition">{title}</h3>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {anime.genres?.slice(0, 3).map((genre, idx) => (
                                        <span
                                            key={idx}
                                            className="text-[12px] sm:text-xs px-2 py-0.5 bg-accent font-medium capitalize"
                                        >
                                            {genre.toLowerCase()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Link> 
                )
            })}
        </div>
    )
}

export default AiringList