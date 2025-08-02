"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Employee {
  id: string
  name: string
  email: string
  role: "admin" | "cashier" | "kitchen" | "waiter"
  permissions: string[]
  isActive: boolean
}

interface AuthContextType {
  employee: Employee | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: string) => boolean
  switchRole: (role: Employee["role"]) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock employees data
const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "አህመድ አሊ",
    email: "admin@restaurant.com",
    role: "admin",
    permissions: ["admin_access", "pos_view", "pos_create", "view_orders", "kitchen_access", "view_analytics"],
    isActive: true,
  },
  {
    id: "2",
    name: "ፋጢማ መሀመድ",
    email: "cashier@restaurant.com",
    role: "cashier",
    permissions: ["pos_view", "pos_create", "view_orders"],
    isActive: true,
  },
  {
    id: "3",
    name: "ዳዊት ተስፋዬ",
    email: "kitchen@restaurant.com",
    role: "kitchen",
    permissions: ["kitchen_access", "view_orders"],
    isActive: true,
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null)

  useEffect(() => {
    // Check for stored auth data
    const storedEmployee = localStorage.getItem("employee")
    if (storedEmployee) {
      setEmployee(JSON.parse(storedEmployee))
    } else {
      // Auto-login as admin for demo
      setEmployee(mockEmployees[0])
      localStorage.setItem("employee", JSON.stringify(mockEmployees[0]))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login logic
    const foundEmployee = mockEmployees.find((emp) => emp.email === email)

    if (foundEmployee && foundEmployee.isActive) {
      setEmployee(foundEmployee)
      localStorage.setItem("employee", JSON.stringify(foundEmployee))
      return true
    }

    return false
  }

  const logout = () => {
    setEmployee(null)
    localStorage.removeItem("employee")
  }

  const hasPermission = (permission: string): boolean => {
    return employee?.permissions.includes(permission) || false
  }

  const switchRole = (role: Employee["role"]) => {
    if (!employee) return

    const roleEmployee = mockEmployees.find((emp) => emp.role === role)
    if (roleEmployee) {
      setEmployee(roleEmployee)
      localStorage.setItem("employee", JSON.stringify(roleEmployee))
    }
  }

  const value: AuthContextType = {
    employee,
    login,
    logout,
    hasPermission,
    switchRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
