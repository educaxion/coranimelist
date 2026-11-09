import Image from "next/image"
import Link from "next/link"

const HeroSection = ({ hero }) => {
    if(!hero || hero.length === 0) return null;
    const anime = hero[0]

    const crunchyrollLink = anime.externalLinks?.find(
        (link) => link.site.toLowerCase() === "crunchyroll"
    )?.url;

    const watchUrl = crunchyrollLink || `/anime/${anime.id}/${anime.title}`

    return (
        <div className="relative w-full h-[450px] sm:h-[500px] lg:h-[550px] overflow-hidden mb-8">
        {anime.bannerImage ? (
            <Image
                src={anime.bannerImage}
                alt={anime.title.english || anime.title.romaji}
                fill
                priority
                quality={100}
                className="object-cover object-center brightness-75"
                />
            ) : (
            <div className="absolute inset-0 bg-slate-800" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0e17] via-[#0f0e17]/60 to-transparent"/>
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-12 max-w-2xl z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text leading-tight drop-shadow-md">
                {anime.title.english || anime.title.romaji}
            </h1>

            <div className="mt-2 text-sm text-sub line-clamp-2 sm:line-clamp-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: anime.description}}/>

            {/* Tombol Action */}
        <div className="flex items-center gap-4 mt-6">
          <Link
            href={watchUrl}
            // Jika link-nya mengarah ke luar (Crunchyroll), buka di tab baru agar user tidak meninggalkan web kamu
            target={crunchyrollLink ? "_blank" : "_self"}
            rel={crunchyrollLink ? "noopener noreferrer" : ""}
            className="bg-accent hover:bg-accent-hover text-text font-semibold px-6 py-3 rounded-xl transition duration-300 shadow-lg"
          >
            Watch Now
          </Link>

          <Link
            href={`/anime/${anime.id}`}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl backdrop-blur-md transition duration-300 border border-white/10"
          >
            See Detail
          </Link>
        </div>
        </div>
        </div>
    )
}

export default HeroSection