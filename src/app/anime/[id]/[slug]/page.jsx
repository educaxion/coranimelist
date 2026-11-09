import { getAnimeResponse } from "@/libs/api-libs"
import { ANIME_DETAIL_QUERY } from "@/graphql/anime-detail-queries"
import Image from "next/image"
import { notFound } from "next/navigation"
import AnimeInfo from "@/components/AnimeDetail/AnimeInformation"
import AnimeSynopsis from "@/components/AnimeDetail/AnimeSynopsis"
import AnimeTrailer from "@/components/AnimeDetail/AnimeTrailer"
import AnimeCharacters from "@/components/AnimeDetail/AnimeCharacters"

const Page = async ({ params }) => {
  const { id } = await params
  const data = await getAnimeResponse(ANIME_DETAIL_QUERY,{ id: Number(id) })

  const anime = data?.Media
  return (
    <>
    <div className="min-h-screen flex flex-col gap-4">
      {/* banner */}
      <div className="relative w-full h-40 sm:h-48 lg:h-64 overflow-hidden">
        {anime.bannerImage && (
          <Image src={anime.bannerImage} alt="banner" fill priority sizes="100vw" className="object-cover object-center"/>
        )}
      </div>
      
      {/* === MAIN CONTENT === */}
      <div className="w-full px-12 sm:px-16 lg:px-24">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT COL : poster & info table */}
          <div className="w-full -mt-24 w-32 shrink-0 sm:-mt-24 sm:w-40 lg:-mt-32 lg:w-48 z-10 space-y-4"> 
            {/* poster */}
            <div className="relative aspect-[3/4] overflow-hidden shadow-2xl ">
              {anime.coverImage?.large && (
                <Image src={anime.coverImage.large} alt="poster" fill priority sizes="(max-width: 640px) 144px, (max-width: 1024px) 224px, 240px" className="object-cover"/>
              )}
            </div>
            <AnimeInfo anime={anime}/>
          </div>
              
           {/* title */}
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-semibold leading-tight">
                {anime.title.english || anime.title.romaji}
            </h1>
            {anime.title?.romaji && anime.title?.english && (
              <p className="mt-1 text-sm text-text">
                {anime.title.romaji}
              </p>
            )}
            <AnimeSynopsis anime={anime}/>

            <AnimeTrailer trailer={anime.trailer}/>

            <AnimeCharacters characters={anime.characters}/>
          </div>
        </div>

        
      </div>

      <div>
      </div>
    </div>
    </>
  )
}

export default Page