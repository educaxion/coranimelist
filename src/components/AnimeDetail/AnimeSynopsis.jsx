"use client"

import { useState } from "react"

const AnimeSynopsis = ({anime}) => {
    const [isExpanded, setIsExpanded] = useState(false)
    if(!anime.description) return null;
    
    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold text-text mb-2">Synopsis</h2>

            <div className="relative">
                <div className={`text-sm text-sub leading-relaxed space-y-2 [&>br]:content-[''] [&>br]:block [&>br]:my-2 transition-all duration-300 ${!isExpanded ? "line-clamp-4 overflow-hidden" : ""}`} dangerouslySetInnerHTML={{__html: anime.description}}/>
                <button onClick={() => setIsExpanded(!isExpanded)} className="mt-2 text-xs font-semibold text-sub hover:text-accent focus:outline-none">{isExpanded ? "Show Less" : "Read More"}</button>
            </div>
        </div>
    )
}

export default AnimeSynopsis