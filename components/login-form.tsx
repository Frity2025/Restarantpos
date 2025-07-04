"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChefHat, LogIn } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function LoginForm() {
  const { login } = useAuth()
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const success = await login(credentials.username, credentials.password)
      if (!success) {
        setError("የተሳሳተ የተጠቃሚ ስም ወይም የይለፍ ቃል")
      }
    } catch (error) {
      setError("የመግቢያ ስህተት ተፈጥሯል")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">ቺሊ POS</CardTitle>
          <CardDescription>ወደ ምግብ ቤት አስተዳደር ስርዓት ይግቡ</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">የተጠቃሚ ስም</Label>
              <Input
                id="username"
                type="text"
                placeholder="የተጠቃሚ ስም ያስገቡ"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">የይለፍ ቃል</Label>
              <Input
                id="password"
                type="password"
                placeholder="የይለፍ ቃል ያስገቡ"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                "እየገባ ነው..."
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  ግባ
                </>
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">የሙከራ መለያዎች:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>አስተዳዳሪ: admin / admin123</p>
              <p>ሰራተኛ: waiter1 / waiter123</p>
              <p>ኩሽና: kitchen1 / kitchen123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
