"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { loginUser } from "@/app/actions/user-actions"

// Sample user data
const SAMPLE_USER = {
  id: "1",
  name: "Rhed Maldo",
  email: "maldo.rhed@minsu.edu.ph",
  rank: "Helper",
  points: 75,
  avatar: "RM",
}

interface User {
  id: string
  name: string
  email: string
  rank: "Newbie" | "Helper" | "Expert"
  points: number
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("minsu-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))

      // If user is logged in and on the landing page, redirect to dashboard
      if (pathname === "/") {
        router.push("/dashboard")
      }
    }
    setIsLoading(false)
  }, [pathname, router])

  // Update the login function to handle different error cases
  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Simple validation check for domain
    if (!email.endsWith("@minsu.edu.ph")) {
      setIsLoading(false)
      return {
        success: false,
        message: "Email must be from the @minsu.edu.ph domain",
      }
    }

    // Password validation check
    if (password.length < 12) {
      setIsLoading(false)
      return {
        success: false,
        message: "Password must be at least 12 characters long",
      }
    }

    try {
      const result = await loginUser(email, password)
      if (result.success && result.user) {
        const allowedRanks = ["Newbie", "Helper", "Expert"] as const;
        const userObj: User = {
          ...result.user,
          id: String(result.user.id),
          rank: allowedRanks.includes(result.user.rank as any) ? result.user.rank as User["rank"] : "Newbie",
          avatar: result.user.avatar ?? undefined,
        }
        setUser(userObj)
        localStorage.setItem("minsu-user", JSON.stringify(userObj))
        setIsLoading(false)
        router.push("/dashboard")
        return { success: true }
      } else {
        setIsLoading(false)
        return { success: false, message: result.message }
      }
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return {
        success: false,
        message: "An error occurred during login. Please try again.",
      }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("minsu-user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
