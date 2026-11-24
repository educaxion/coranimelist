"use client"

import { useAuth } from "@/context/AuthContext"
import { 
    syncAnime, 
    getFavorites, 
    getWatchlist, 
    addFavorite, 
    removeFavorite, 
    addToWatchlist, 
    updateWatchlistStatus, 
    removeFromWatchlist,  
} from "@/libs/user-api"
import { useEffect, useState } from "react"
import { ChevronDown, Heart } from "react-feather";

const WATCH_STATUS = [
    "PLANNING",
    "WATCHING",
    "COMPLETED",
    "PAUSED",
    "DROPPED",
]

const AnimeWatch = ({ anime }) => {
    const { user, loading } = useAuth()
    const[localAnimeId, setLocalAnimeId] = useState(null)
    const[isFavorite, setIsFavorite] = useState(false)
    const[watchStatus, setWatchStatus] = useState(null)
    const[saving, setSaving] = useState(false)
    const[initializing, setInitializing] = useState(false)
    const[error, setError] = useState(" ")

    useEffect(() => {
        if (loading || !user || !anime) return

        const initializeAnime = async () => {
            try {
                setInitializing(true)
                setError("")

                const syncedAnime = await syncAnime ({
                    sourceId: String(anime.id),
                    title: anime.title.english || anime.title.romaji,
                    titleNative: anime.title.native || undefined,
                    description: anime.description || undefined,
                    coverImage: anime.coverImage?.large || undefined,
                    bannerImage: anime.bannerImage || undefined,
                    format: anime.format || undefined,
                    status: anime.status || undefined,
                    episodes: anime.episodes ?? undefined,
                    duration: anime.duration ?? undefined,
                    season: anime.season || undefined,
                    seasonYear: anime.seasonYear ?? undefined,
                    averageScore: 
                        anime.averageScore != null
                        ? anime.averageScore
                        : undefined,
                    popularity: anime.popularity ?? undefined,
                });
        
                setLocalAnimeId(syncedAnime.id)
        
                const [favorites, watchlist] = await Promise.all([
                    getFavorites(),
                    getWatchlist(),
                ]);
        
                setIsFavorite(
                    favorites.some((item) => item.animeId == syncedAnime.id)
                )
        
                const currentWatchlistItem = watchlist.find(
                    (item) => item.animeId === syncedAnime.id
                )
        
                setWatchStatus(currentWatchlistItem?.status || null)
            } catch (error) {
                console.error("Failed to initialize anime", error)
                setError(error.message || "Failed to load anime status")
            } finally {
                setInitializing(false)
            }
        }
        initializeAnime()
    }, [anime, user, loading])

    const handleFavorite = async() => {
        if(!user || !localAnimeId || saving) return

        try {
            setSaving(true)
            setError("")

            if(isFavorite) {
                await removeFavorite(localAnimeId)
                setIsFavorite(false)
            } else {
                await addFavorite(localAnimeId)
                setIsFavorite(true)
            }
        } catch (error) {
            setError(error.message || "Failed to update favorite")
        } finally {
            setSaving(false)
        }
    }

    const handelWatchlist = async (status) => {
        if(!user || !localAnimeId || saving) return

        try {
            setSaving(true)
            setError("")

            if (watchStatus) {
                await updateWatchlistStatus(localAnimeId, status)
            } else {
                await addToWatchlist(localAnimeId)

                if(status !== "PLANNING") {
                    await updateWatchlistStatus(localAnimeId, status)
                }
            }

            setWatchStatus(status)
        } catch (error) {
            setError(error.message || "Failed to update watchlist")
        } finally {
            setSaving(false)
        }
    }

    const handleRemoveWatchlist = async () => {
        if (!user || !localAnimeId || saving) return

        try {
            setSaving(true)
            setError("")

            await removeFromWatchlist(localAnimeId)
            setWatchStatus(null)
        } catch (error) {
            setError(error.message || "Failed to remove from watchlist")
        } finally {
            setSaving(false)
        }
    }

    const formatStatus = (status) => {
        if (!status) return "Add to list"

        return status.charAt(0) + status.slice(1).toLowerCase()
    }

    if (!user || loading) {
        return null
    }

    return (
        <div className="space-y-2">
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <select
                        value={watchStatus || ""}
                        onChange={(event) => {
                            if (event.target.value === "REMOVE") {
                                handleRemoveWatchlist()
                            } else {
                                handelWatchlist(event.target.value)
                            }
                        }}
                        disabled={initializing || saving || !localAnimeId}
                        className="w-full h-11 appearance-none bg-sky-500 hover:bg-sky-400 text-text text-center cursor-pointer focus:outline-none"
                    >
                        <option value="" disabled>
                            Add to List
                        </option>
                        {WATCH_STATUS.map((status) => (
                            <option key={status} value={status}>
                                {formatStatus(status)}
                            </option>
                        ))}

                        {watchStatus && (
                            <option value="REMOVE">
                                Remove from list
                            </option>
                        )}
                    </select>  
                </div>

                <button 
                    type="button" 
                    onClick={handleFavorite} 
                    disabled={initializing || saving || !localAnimeId}
                    aria-label={
                        isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                    className={`w-13 h-11 flex items-center justify-center transition disabled:opacity-50 ${
                        isFavorite 
                        ? "bg-pink-600 text-text"
                        : "bg-pinlk-600/20 text-pink-500 hover:bg-pink-600 hover:text-text"
                    }`}
                    >
                    <Heart
                        size={24}
                        fill={isFavorite ? "currentColor" : "none"}
                        strokeWidth={2}
                    />
                </button>
            </div>

            {error && (
                <p className="text-accent text-xs">{error}</p>
            )}
        </div>
    )
}

export default AnimeWatch