"use client"

import { useRef } from "react";
import { useRouter } from "next/navigation"
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

const InputSearch = () => {
    const searchRef = useRef()
    const router = useRouter()

    const handleSearch = (event) => {
        if(event.key === "Enter" || event.type === "click"){
            event.preventDefault()
            const keyword = searchRef.current.value
            
            if(keyword) {
                router.push(`/search/${keyword}`);
            }
        }
    }

    return (
            <div className="relative">
                <input 
                type="text"
                placeholder="Search Anime..." 
                className="text-text bg-[#040021] p-2 rounded w-full min-w-64"
                ref={searchRef}
                onKeyDown={handleSearch}
            />
                <button className="absolute top-2 end-4" onClick={handleSearch}>
                <MagnifyingGlassIcon size={24} />
                </button>
            </div>
    )
}

export default InputSearch