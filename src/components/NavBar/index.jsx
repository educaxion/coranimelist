"use client"

import Link from "next/link"
import Image from "next/image"
import InputSearch from "./InputSearch"
import { useAuth } from "@/context/AuthContext"

const Navbar = () => {
    const { user, loading, logout } = useAuth()

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error("Logout failed:", error)
            alert(error.message)
        }
    }

    return (
        <header className="bg-primary">
            <div className="flex flex-wrap justify-between items-center p-4 gap-2">
                <Link
                    href="/"
                    className="font-bold text-accent text-lg sm:text-3xl whitespace-nowrap px-1"
                    style={{ fontFamily: 'modern-tokyo' }}
                >
                    C o r a n i m e L i s t
                </Link>

                <div className="order-2 md:order-3 flex items-center gap-4 shrink-0">
                    {!loading && (
                        user ? (
                            <Link
                                href="/profile"
                                aria-label="Go to profile"
                                title={user.username}
                                className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-accent hover:opacity-80 transition shrink-0 bg-secondary flex items-center justify-center"
                            >
                                {user.avatar ? (
                                    <Image
                                        src={user.avatar}
                                        alt={`${user.username}'s avatar`}
                                        fill
                                        sizes="40px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <span className="text-text font-bold text-sm">
                                        {user.username?.charAt(0).toUpperCase() || "U"}
                                    </span>
                                )}
                            </Link>
                        ) : (
                            <div className="flex items-center gap-1 sm:gap-2">
                                <Link
                                    href="/login"
                                    className="text-text text-sm sm:text-base px-2 sm:px-4 py-2 whitespace-nowrap hover:text-accent transition"
                                >
                                    Sign In
                                </Link>

                                <Link
                                    href="/register"
                                    className="bg-accent text-text px-4 py-2 rounded hover:opacity-80 transition"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )
                    )}
                </div>

                <div className="order-3 md:order-2 w-full md:w-auto md:ml-auto min-w-0">
                    <InputSearch />
                </div>
            </div>
        </header>
    )
}

export default Navbar
