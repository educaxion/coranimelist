"use client"
import { useEffect, useState } from "react"
import { syncAnime, getAnimeReviews } from "@/libs/user-api"
import { useAuth } from "@/context/AuthContext"
import { createReview } from "@/libs/user-api"

const AnimeReview = ({ anime }) => {
    const {user, loading: authLoading} = useAuth()
    const [content, setContent] = useState("")
    const [saving, setSaving] = useState(false)
    const [localAnimeId, setLocalAnimeId] = useState(null)
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const handleSubmit = async () => {
        if(!user || !localAnimeId || !content.trim() || saving) return

        try {
            setSaving(true)
            setError("")

            await createReview(localAnimeId, content)

            setContent("")

            const updateReviews = await getAnimeReviews(localAnimeId)
            setReviews(updateReviews)

        } catch (error) {
            console.error("Failed to submit comment:", error)
            setError(error.message || "Failed to submit comment")
        } finally {
            setSaving(false)
        }
    }
 
    useEffect(() => {
        if (!anime) return

        const fetchReviews = async () => {
            try {
                setLoading(true)
                setError("")

                const syncedAnime = await syncAnime({
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
                    averageScore: anime.averageScore ?? undefined,
                    popularity: anime.popularity ?? undefined,
                })

                setLocalAnimeId(syncedAnime.id)

                // Fetch anime reviews
                const result = await getAnimeReviews(syncedAnime.id)
                setReviews(result)
            } catch (error) {
                console.error("Failed to fetch reviews:", error)
                setError(error.message || "Failed to load comments")
            } finally {
                setLoading(false)
            }
        }

        fetchReviews()
    }, [anime])
    
    return (
        <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold text-text mb-4">Review</h2>
            <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Write your thoughts here..."
                className="w-full min-h-32 p-4 border border-white/10 rounded-md text-text placeholder:text-text/40 outline-none focus:border-accent"
            />

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={authLoading || !user || !localAnimeId || !content.trim() || saving}
                    className="px-6 py-2 bg-accent text-text hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? "Sending..." : "Send"}
                </button>
            </div>

            {!authLoading && !user && (
                <p className="text-sm text-text/50">
                    Please log in to leave comment
                </p>
            )}

            <div className="mt-4 space-y-4">
                <h2 className="text-lg font-semibold text-text mb-4">
                    Community Review
                </h2>

                {reviews.length === 0 ? (
                    <p className="text-sm text-text/50">
                        No review yet. Be the first to review!
                    </p>
                ) :(
                    reviews.map((review) => (
                        <div
                            key={review.id}
                            className="p-4 border border-white/10 rounded-md"
                        >
                            <p className="text-xs text-text">
                                Review by{" "}
                                <span className="font-semibold">{review.user.username}</span>
                            </p>

                            <p className="mt-2 text-sm text-text/80 whitespace-pre-wrap"> 
                                {review.content}
                            </p>

                            <p className="mt-3 text-xs text-text/40">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                            
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default AnimeReview