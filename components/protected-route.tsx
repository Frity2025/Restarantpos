"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "./login-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldX } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string
  requiredRole?: string
}

export function ProtectedRoute({ children, requiredPermission, requiredRole }: ProtectedRouteProps) {
  const { employee, hasPermission, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>እየጫን ነው...</p>
        </div>
      </div>
    )
  }

  if (!employee) {
    return <LoginForm />
  }

  // የደረጃ ፍተሻ
  if (requiredRole && employee.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Alert className="max-w-md">
          <ShieldX className="h-4 w-4" />
          <AlertDescription>ይህንን ገጽ ለማየት ፈቃድ የለዎትም።</AlertDescription>
        </Alert>
      </div>
    )
  }

  // የፈቃድ ፍተሻ
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Alert className="max-w-md">
          <ShieldX className="h-4 w-4" />
          <AlertDescription>ይህንን ተግባር ለመፈጸም ፈቃድ የለዎትም።</AlertDescription>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}
