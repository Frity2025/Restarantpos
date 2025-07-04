"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { authenticateUser } from "@/lib/auth"

interface Employee {
  id: string
  name: string
  role: string
  permissions: string[]
}

interface AuthContextType {
  employee: Employee | null
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await authenticateUser(username, password)
      if (result.success && result.employee) {
        setEmployee(result.employee)
        return { success: true }
      }
      return { success: false, error: result.error }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setEmployee(null)
  }

  return <AuthContext.Provider value={{ employee, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
