"use client"
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null)
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const[loading, setLoading] = useState(true)

    const fetchCurrentUser = async() => {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });

            if(!response.ok){
                setUser(null)
                return(null)
            }

            const data = await response.json()
            setUser(data)
            return data
        } catch (error) {
            console.log("Failed to fetch current user:", error);
            setUser(null);
            return null;
        }
    }

    const refreshUser = fetchCurrentUser;

    useEffect(() => {
        const initializeAuth = async() => {
            await fetchCurrentUser()
            setLoading(false)
        }
        initializeAuth()
    }, [])

    const register = async (formData) => {
        const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
        throw new Error(
            Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message || "Registration failed"
        );
        }

        setUser(data.user);
        return data;
    };

    const login = async (formData) => {
        const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
        });

        const data = await response.json()

        if (!response.ok) {
        throw new Error(
            Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message || "Login failed"
        );
        }

        setUser(data.user);
        return data;
    }

    
    const logout = async () => {
    try {
        const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
        throw new Error(data.message || "Logout failed");
        }

        setUser(null);

        // Redirect ke halaman login
        window.location.assign("/login");

    } catch (error) {
        console.error("Logout error:", error);
        alert(error.message || "Logout failed");
    }
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, register, login, logout, fetchCurrentUser, refreshUser }}
            >
            {children}
            </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if(!context) {
        throw new Error("useAuth must be used inside AuthProvider")
    }

    return context
}