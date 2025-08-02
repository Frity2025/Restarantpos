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
  lastLogin?: string
}

interface AuthContextType {
  employee: Employee | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: string) => boolean
  switchRole: (role: Employee["role"]) => void
  isLoading: boolean
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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth data
    const storedEmployee = localStorage.getItem("employee")
    if (storedEmployee) {
      try {
        setEmployee(JSON.parse(storedEmployee))
      } catch (error) {
        console.error("Error parsing stored employee data:", error)
        localStorage.removeItem("employee")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login logic with better validation
    const foundEmployee = mockEmployees.find((emp) => emp.email === email)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (foundEmployee && foundEmployee.isActive) {
      // In a real app, you'd validate the password here
      const employeeWithLastLogin = {
        ...foundEmployee,
        lastLogin: new Date().toISOString(),
      }

      setEmployee(employeeWithLastLogin)
      localStorage.setItem("employee", JSON.stringify(employeeWithLastLogin))
      return true
    }

    return false
  }

  const logout = () => {
    setEmployee(null)
    localStorage.removeItem("employee")
    // In a real app, you might want to redirect to login page here
  }

  const hasPermission = (permission: string): boolean => {
    if (!employee) return false
    if (employee.role === "admin") return true
    return employee.permissions.includes(permission) || false
  }

  const switchRole = (role: Employee["role"]) => {
    if (!employee) return

    const roleEmployee = mockEmployees.find((emp) => emp.role === role)
    if (roleEmployee) {
      const employeeWithLastLogin = {
        ...roleEmployee,
        lastLogin: new Date().toISOString(),
      }
      setEmployee(employeeWithLastLogin)
      localStorage.setItem("employee", JSON.stringify(employeeWithLastLogin))
    }
  }

  const value: AuthContextType = {
    employee,
    login,
    logout,
    hasPermission,
    switchRole,
    isLoading,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">እየጫን...</p>
        </div>
      </div>
    )
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
