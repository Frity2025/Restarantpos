"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "cashier" | "kitchen" | "waiter" | "manager"
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo
const mockUsers: Record<string, User> = {
  "admin@restaurant.com": {
    id: "1",
    email: "admin@restaurant.com",
    name: "Administrator",
    role: "admin",
    permissions: ["all"],
  },
  "cashier@restaurant.com": {
    id: "2",
    email: "cashier@restaurant.com",
    name: "Cashier",
    role: "cashier",
    permissions: ["pos", "orders", "payments"],
  },
  "kitchen@restaurant.com": {
    id: "3",
    email: "kitchen@restaurant.com",
    name: "Kitchen Staff",
    role: "kitchen",
    permissions: ["kitchen", "orders"],
  },
}

const mockPasswords: Record<string, string> = {
  "admin@restaurant.com": "admin",
  "cashier@restaurant.com": "cashier",
  "kitchen@restaurant.com": "kitchen",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem("user")
    const sessionExpiry = localStorage.getItem("sessionExpiry")

    if (storedUser && sessionExpiry) {
      const expiry = new Date(sessionExpiry)
      if (expiry > new Date()) {
        setUser(JSON.parse(storedUser))
      } else {
        // Session expired
        localStorage.removeItem("user")
        localStorage.removeItem("sessionExpiry")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    try {
      // Mock authentication
      const mockUser = mockUsers[email]
      const mockPassword = mockPasswords[email]

      if (mockUser && mockPassword === password) {
        setUser(mockUser)

        // Store session
        localStorage.setItem("user", JSON.stringify(mockUser))

        // Set session expiry (24 hours if remember me, 8 hours otherwise)
        const expiryHours = rememberMe ? 24 : 8
        const expiry = new Date(Date.now() + expiryHours * 60 * 60 * 1000)
        localStorage.setItem("sessionExpiry", expiry.toISOString())

        // Redirect based on role
        switch (mockUser.role) {
          case "admin":
            router.push("/admin")
            break
          case "cashier":
            router.push("/")
            break
          case "kitchen":
            router.push("/kitchen")
            break
          default:
            router.push("/")
        }

        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("sessionExpiry")
    router.push("/login")
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
