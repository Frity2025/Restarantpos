"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { restaurantInfo } from "@/config/restaurant-config"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const success = await login(username, password)
      if (!success) {
        setError("የተሳሳተ የተጠቃሚ ስም ወይም የይለፍ ቃል")
      }
    } catch (err) {
      setError("የመግቢያ ስህተት ተከስቷል")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img
              src={restaurantInfo.logo || "/placeholder.svg"}
              alt={restaurantInfo.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          </div>
          <CardTitle className="text-2xl font-bold">{restaurantInfo.name}</CardTitle>
          <CardDescription>የምግብ ቤት POS ስርዓት</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">የተጠቃሚ ስም</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="የተጠቃሚ ስም ያስገቡ"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">የይለፍ ቃል</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="የይለፍ ቃል ያስገቡ"
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "እየገባ..." : "ግባ"}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">የሙከራ መግቢያ መረጃ:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                <strong>አስተዳዳሪ:</strong> admin / admin123
              </p>
              <p>
                <strong>ሰራተኛ:</strong> cashier / cashier123
              </p>
              <p>
                <strong>ኩሽና:</strong> kitchen / kitchen123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
