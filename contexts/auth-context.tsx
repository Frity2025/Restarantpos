"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Employee, LoginCredentials, AuthResponse } from "@/types/auth"
import { authService } from "@/lib/auth"

interface AuthContextType {
  employee: Employee | null
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  logout: () => void
  hasPermission: (permissionId: string) => boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // ከ localStorage የተቀመጠ ሰራተኛ መረጃ መጫን
    const savedEmployee = localStorage.getItem("current_employee")
    if (savedEmployee) {
      try {
        const parsedEmployee = JSON.parse(savedEmployee)
        setEmployee(parsedEmployee)
      } catch (error) {
        console.error("Error parsing saved employee:", error)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await authService.login(credentials)
    if (response.success && response.employee) {
      setEmployee(response.employee)
      localStorage.setItem("current_employee", JSON.stringify(response.employee))
      localStorage.setItem("auth_token", response.token || "")
    }
    return response
  }

  const logout = () => {
    authService.logout()
    setEmployee(null)
    localStorage.removeItem("current_employee")
    localStorage.removeItem("auth_token")
  }

  const hasPermission = (permissionId: string): boolean => {
    return authService.hasPermission(permissionId)
  }

  return (
    <AuthContext.Provider value={{ employee, login, logout, hasPermission, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
