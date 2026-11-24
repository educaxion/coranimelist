"use client"

import { useState } from "react"
import FavoriteTabs from "./Favorites"
import WatchlistTabs from "./Watchlist"
import ReviewTabs from "./Reviews"

const ProfileTabs = ({ collections }) => {
    const [activeTab, setActiveTab] = useState("favorite")
    const tabs = [
        { id:"favorites", label: "Favorites" },
        { id:"watchlist", label: "Watchlist" },
        { id: "reviews", label: "Reviews" }
    ];

    return (
        <div>
            <div className="flex gap-8 border-b border-white/50">
                {tabs.map((tab) => (
                    <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id)} 
                    className={`pb-4 text-sm font-semibold transition 
                    ${activeTab === tab.id ? "text-accent": "text-text/50 hover:text-text"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="py-6">
                {activeTab ===  "favorites" && (
                    <FavoriteTabs favorites={collections.favorites}/>
                )}

                {activeTab === "watchlist" && (
                    <WatchlistTabs watchlist={collections.watchlist}/>
                )}

                {activeTab === "reviews" && (
                    <ReviewTabs reviews={collections.reviews}/>
                )}
            </div>
        </div>
    )
}

export default ProfileTabs