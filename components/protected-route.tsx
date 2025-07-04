"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { useEffect, useState } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string
  requiredPermissions?: string[]
}

export function ProtectedRoute({ children, requiredPermission, requiredPermissions }: ProtectedRouteProps) {
  const { employee, isLoading, hasPermission } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!employee) {
    return <LoginForm />
  }

  // Check single permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">መዳረሻ ተከልክሏል</h1>
          <p className="text-gray-600">ይህንን ገጽ ለማየት የሚያስፈልግ ፈቃድ የለዎትም።</p>
        </div>
      </div>
    )
  }

  // Check multiple permissions (user needs at least one)
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAnyPermission = requiredPermissions.some((permission) => hasPermission(permission))
    if (!hasAnyPermission) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">መዳረሻ ተከልክሏል</h1>
            <p className="text-gray-600">ይህንን ገጽ ለማየት የሚያስፈልግ ፈቃድ የለዎትም።</p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}
