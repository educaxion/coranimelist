import Image from "next/image";
import Link from "next/link";
import { createSlug } from "../Utilities/slug";

const AnimeList = ({ list }) => {

  return (
  <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-4 px-4">
    {list.map((anime) => {
      const title = anime.title?.english || anime.title?.romaji || "Untitled Anime"
      const slug = createSlug(title);

      return (
        <Link 
          href={`/anime/${anime.id}/${slug}`} 
          key={anime.id} 
          className="group cursor-pointer flex flex-col justify-between">

          <div className="relative w-full aspect-[3/4] overflow-hidden">
            <Image
            src={anime.coverImage.large}
            alt={anime.title?.english || anime.title?.romaji || "Anime cover"} fill
            sizes="(max-width: 512) 50vw, (max-width: 800) 20vw, 15vw"
            className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col flex-grow justify-between p-2">
            <h3 className="font-bold text-md line-clamp-2 overflow-hidden leading-snug group-hover:text-accent transition-all min-h-[2.8rem] pt-1 px-1 ">
              {anime.title?.english || anime.title?.romaji || "Untitled Anime"}
            </h3>   
          </div>
        </Link>
      )
    })}
  </div>
  );
};

export default AnimeList;