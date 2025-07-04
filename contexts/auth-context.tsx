"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authenticateUser, hasPermission as checkPermission } from "@/lib/auth"

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
  hasPermission: (permission: string) => boolean
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

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await authenticateUser(username, password)
      if (result.success && result.employee) {
        setEmployee(result.employee)
        localStorage.setItem("employee", JSON.stringify(result.employee))
        return { success: true }
      }
      return { success: false, error: result.error }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setEmployee(null)
    localStorage.removeItem("employee")
  }

  const hasPermission = (permission: string): boolean => {
    return checkPermission(employee, permission)
  }

  return (
    <AuthContext.Provider value={{ employee, login, logout, isLoading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
