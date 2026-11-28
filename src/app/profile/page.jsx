"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProfileTabs from "@/components/ProfileTabs";
import { getProfileCollections } from "@/libs/user-api";
import Link from "next/link";

const Page = () => {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [collections, setCollections] = useState ({
    favorites: [],
    watchlist: [],
    reviews: []
  })

  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [collectionsError, setCollectionsError] = useState("");

  useEffect(() => {
    if(!loading && !user) {
      router.replace("/login")
    }
  }, [loading, user, router])

  useEffect(() => {
    if (loading) return

    if (!user) {
      setCollectionsLoading(false)
      return
    }

    let isMounted = true

    const fetchCollections = async () => {
      try {
        setCollectionsLoading(true)
        setCollectionsError("")

        const data = await getProfileCollections()

        if (isMounted) {
          setCollections({
            favorites: data.favorites ?? [],
            watchlist: data.watchlist ?? [],
            reviews: data.reviews ?? []
          })
        }
      } catch (error) {
        console.error("Failed to fetch profile collections:", error)

        if (isMounted) {
          setCollectionsError(
            error.message || "Failed to load collections"
          )
        }
      } finally {
        if (isMounted) {
          setCollectionsLoading(false)
        }
      }
    }
    fetchCollections()

    return () => {
      isMounted = false
    }
  }, [user, loading])
  
  if(loading || !user) {
    return(
    <main className="min-h-screen bg-primary flex items-center justify-center">
        <p className="text-text/60 animate-pulse">
          Loading profile...
        </p>
      </main>
    );
  }

  const initial = user.username?.charAt(0).toUpperCase() || "U";
    return (
      <section>
        <div className="mx-auto px-5 md:px-8 mt-6">
            <h1 className="text-text text-2xl sm:text-3xl font-semibold mb-4">
                 My Profile
            </h1>
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-start">
                <div className="w-32 h-32 sm:w-40 sm:h-40 overflow-hidden bg-accent flex items-center justify-center text-6xl font-semibold text-text shrink-0">
                    {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={`${user.username}'s avatar`}
                          className="w-full h-full object-cover"
                        />
                    ) : (
                        initial
                    )}
                </div>

                <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl md:text-4xl text-text text-left font-semibold leading-none align-top">
                        {user.username || "Username"}
                    </h2>
                    <p className="text-text/70 text-sm mt-2 max-w-md">
                        {user.bio || "No bio yet. Write something about yourself!"}
                    </p>
                </div>
                <div className="flex shrink-0">
                    <Link href="/profile/edit" className="px-4 py-2 bg-accent hover:bg-accent-hover text-text font-semibold transition">
                        Edit Profile
                    </Link>
                </div>
            </div>

            <div className="mx-auto px-6 md:px-8 mt-12">
              <ProfileTabs collections={collections}/>
            </div>
        </div>
    </section>
  )
}

export default Page
