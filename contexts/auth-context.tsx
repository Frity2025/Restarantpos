"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Employee } from "@/types/auth"
import { authenticateUser } from "@/lib/auth"

interface AuthContextType {
  employee: Employee | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for saved session
    const savedEmployee = localStorage.getItem("employee")
    if (savedEmployee) {
      try {
        setEmployee(JSON.parse(savedEmployee))
      } catch (error) {
        console.error("Error parsing saved employee:", error)
        localStorage.removeItem("employee")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const authenticatedEmployee = await authenticateUser(username, password)

      if (authenticatedEmployee) {
        setEmployee(authenticatedEmployee)
        localStorage.setItem("employee", JSON.stringify(authenticatedEmployee))
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    setEmployee(null)
    localStorage.removeItem("employee")
  }

  return <AuthContext.Provider value={{ employee, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
