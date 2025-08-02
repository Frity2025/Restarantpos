"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { employee } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (employee) {
      router.push("/")
    }
  }, [employee, router])

  if (employee) {
    return null // Will redirect
  }

  return <LoginForm />
}
