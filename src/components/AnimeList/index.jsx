import Image from "next/image";
import Link from "next/link";
import { createSlug } from "../Utilities/slug";

const AnimeList = ({ list }) => {

  return (
  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4 px-4">
    {list.map((anime) => {
      const title = anime.title?.english || anime.title?.romaji || "Untitled Anime"
      const slug = createSlug(title);

      return (
        <Link 
          href={`/anime/${anime.id}/${slug}`} 
          key={anime.id} 
          className="group cursor-pointer flex flex-col justify-between min-w-0">

          <div className="relative w-full aspect-3/4 overflow-hidden">
            <Image
            src={anime.coverImage.large}
            alt={anime.title?.english || anime.title?.romaji || "Anime cover"} fill
            sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
            className="w-full h-full object-cover"
            />
          </div>
          <h3 className="mt-2 font-bold text-xs sm:text-base line-clamp-2 overflow-hidden leading-snug group-hover:text-accent transition-all min-h-[2.8rem] pt-1 px-1 ">
            {anime.title?.english || anime.title?.romaji || "Untitled Anime"}
          </h3>   
        </Link>
      )
    })}
  </div>
  );
};

export default AnimeList;