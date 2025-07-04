"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Employee, LoginCredentials, AuthResponse } from "@/types/auth"
import { authService } from "@/lib/auth"

interface AuthContextType {
  employee: Employee | null
  user: Employee | null // Alias for employee for backward compatibility
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
    // Load saved employee from localStorage
    const savedEmployee = authService.getCurrentEmployee()
    if (savedEmployee) {
      setEmployee(savedEmployee)
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await authService.login(credentials)
    if (response.success && response.employee) {
      setEmployee(response.employee)
    }
    return response
  }

  const logout = () => {
    authService.logout()
    setEmployee(null)
  }

  const hasPermission = (permissionId: string): boolean => {
    return authService.hasPermission(permissionId)
  }

  return (
    <AuthContext.Provider
      value={{
        employee,
        user: employee, // Alias for backward compatibility
        login,
        logout,
        hasPermission,
        isLoading,
      }}
    >
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
