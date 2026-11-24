const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

const userApiRequest = async(endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            Accept: "application/json", "Content-Type": "application/json",
            ...options.headers,
        },
        credentials: "include",
        cache: "no-store",
    });

    const result = await response.json();

    if(!response.ok) {
        throw new Error(result.message || "Something went wrong")
    }

    return result
}

export const getProfileCollections = async () => {
    return userApiRequest("/users/me/collections")
}

//SYNC
export const syncAnime = async(animeData) => {
    return userApiRequest("/anime/sync", {
        method: "POST",
        body: JSON.stringify(animeData)
    })
}

// FAVORITES
export const getFavorites = async () => {
    return userApiRequest("/users/me/favorites")
}

export const addFavorite = async (animeId) => {
    return userApiRequest(`/users/me/favorites/${animeId}`, {
        method: "POST"
    })
}

export const removeFavorite = async (animeId) => {
    return userApiRequest(`/users/me/favorites/${animeId}`, {
        method: "DELETE"
    })
}

//WATCHLIST
export const getWatchlist = async () => {
    return userApiRequest("/users/me/watchlist")
}

export const addToWatchlist = async (animeId) => {
    return userApiRequest(`/users/me/watchlist/${animeId}`, {
        method: "POST"
    })
}

export const updateWatchlistStatus = async (animeId, status) => {
    return userApiRequest(`/users/me/watchlist/${animeId}/status`, {
        method: "PATCH",
        body: JSON.stringify({status})
    })
}

export const removeFromWatchlist = async (animeId) => {
    return userApiRequest(`/users/me/watchlist/${animeId}`, {
        method: "DELETE"
    })
}

// REVIEWS
export const getAnimeReviews = async (animeId) => {
    return userApiRequest(`/anime/${animeId}/reviews`)
}

export const createReview = async(animeId, content) => {
    return userApiRequest(`/users/me/reviews/${animeId}`, {
        method: "POST",
        body: JSON.stringify({content})
    })
}

export const removeReview = async (animeId) => {
    return userApiRequest(`users/me/reviews/${animeId}`, {
        method: "DELETE"
    })
}

