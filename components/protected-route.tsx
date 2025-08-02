"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "./login-form"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermissions?: string[]
}

export function ProtectedRoute({ children, requiredPermissions = [] }: ProtectedRouteProps) {
  const { employee, hasPermission } = useAuth()

  if (!employee) {
    return <LoginForm />
  }

  // Check if user has required permissions
  if (requiredPermissions.length > 0) {
    const hasRequiredPermission = requiredPermissions.some((permission) => hasPermission(permission))

    if (!hasRequiredPermission) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">መዳረሻ የለም</h2>
            <p className="text-gray-600">ይህንን ገጽ ለማየት ፈቃድ የለዎትም።</p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}
