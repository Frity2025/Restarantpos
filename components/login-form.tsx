"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { restaurantInfo } from "@/config/restaurant-config"

export function LoginForm() {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await login(credentials)
      if (!response.success) {
        setError(response.message)
      }
    } catch (err) {
      setError("የመግቢያ ስህተት ተከስቷል")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={restaurantInfo.logo || "/placeholder.svg"} alt="Logo" className="w-16 h-16" />
          </div>
          <CardTitle className="text-2xl font-bold">{restaurantInfo.name}</CardTitle>
          <p className="text-gray-600">የሰራተኞች መግቢያ</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">ኢሜይል</Label>
              <Input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">የይለፍ ቃል</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="የይለፍ ቃልዎን ያስገቡ"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
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

          {/* ለሙከራ ዓላማ */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-2">የሙከራ መግቢያዎች:</p>
            <div className="text-xs space-y-1">
              <p>
                <strong>አስተዳዳሪ:</strong> admin@restaurant.com / admin123
              </p>
              <p>
                <strong>ሥራ አስኪያጅ:</strong> manager@restaurant.com / manager123
              </p>
              <p>
                <strong>ገንዘብ ተቀባይ:</strong> cashier@restaurant.com / cashier123
              </p>
              <p>
                <strong>አስተናጋጅ:</strong> waiter@restaurant.com / waiter123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
