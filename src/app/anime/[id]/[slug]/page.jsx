import { getAnimeResponse } from "@/libs/api-libs"
import { ANIME_DETAIL_QUERY } from "@/graphql/anime-detail-queries"
import Image from "next/image"
import { notFound } from "next/navigation"
import AnimeWatch from "@/components/AnimeDetail/AnimeWatch"
import AnimeInfo from "@/components/AnimeDetail/AnimeInformation"
import AnimeSynopsis from "@/components/AnimeDetail/AnimeSynopsis"
import AnimeTrailer from "@/components/AnimeDetail/AnimeTrailer"
import AnimeCharacters from "@/components/AnimeDetail/AnimeCharacters"
import AnimeReview from "@/components/AnimeDetail/AnimeReview"

const Page = async ({ params }) => {
  const { id } = await params
  const data = await getAnimeResponse(ANIME_DETAIL_QUERY,{ id: Number(id) })

  const anime = data?.Media
  
  const mainTitle = anime.title?.english || anime.title?.romaji
  const titleRomaji = anime.title?.romaji && anime.title?.english

  return (
    <>
    <div className="w-full min-w-0 flex flex-col gap-4 pb-10">
      {/* banner */}
      <div className="relative w-full h-32 sm:h-48 lg:h-64 overflow-hidden">
        {anime.bannerImage && (
          <Image 
            src={anime.bannerImage} 
            alt="banner" 
            fill 
            priority 
            sizes="100vw" 
            className="object-cover object-center"/>
        )}
      </div>
      
      {/* === MAIN CONTENT === */}
      <div className="w-full min-w-0 px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* sidebar */}
          <aside className="w-full min-w-0 lg:w-52 lg:shrink-0 space-y-4">
            <div className="relative flex items-start gap-4 -mt-14 sm:-mt-20 lg:-mt-32 z-10"> 
              {/* mobile */}
              <div className="relative w-28 sm:w-36 lg:w-full shrink-0 aspect-3/4 overflow-hidden shadow-2xl ">
                {anime.coverImage?.large && (
                  <Image src={anime.coverImage.large} alt="poster" fill priority sizes="(max-width: 640px) 144px, (max-width: 1024px) 224px, 240px" className="object-cover"/>
                )}
              </div>

              <div className="min-w-0 flex-1 pt-[3.5rem] sm:pt-[6.5rem] lg:hidden">
                <h1 className="text-lg sm:text-2xl font-semibold leading-tight line-clamp-3">
                  {mainTitle}
                </h1>
                {titleRomaji && (
                  <p className="mt-1 text-xs sm:text-sm text-text/70 line-clamp-2">
                    {anime.title.romaji}
                  </p>
                )}
              </div>
            </div>   
              <AnimeWatch anime={anime}/>
              <AnimeInfo anime={anime}/>
          </aside>
              
          {/* DESKTOP */}
          <div className="min-w-0 flex-1 space-y-6">
            <div className="hidden lg:block">
              <h1 className="text-3xl font-semibold leading-tight">
                  {mainTitle}
              </h1>
              {titleRomaji && (
                <p className="mt-1 text-xs sm:text-sm text-text/70 line-clamp-2">
                  {titleRomaji}
                </p>
              )}
            </div>
            <AnimeSynopsis anime={anime}/>

            <AnimeTrailer trailer={anime.trailer}/>

            <AnimeCharacters characters={anime.characters}/>

            <AnimeReview anime={anime}/>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Page