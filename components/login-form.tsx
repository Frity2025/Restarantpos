"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, Store } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username || !password) {
      setError("እባክዎ የተጠቃሚ ስም እና የይለፍ ቃል ያስገቡ")
      return
    }

    const result = await login(username, password)
    if (!result.success) {
      setError(result.error || "የመግቢያ ስህተት ተፈጥሯል")
    }
  }

  const demoAccounts = [
    { username: "admin", password: "admin123", role: "አስተዳዳሪ" },
    { username: "cashier", password: "cashier123", role: "ገንዘብ ተቀባይ" },
    { username: "kitchen", password: "kitchen123", role: "ኩሽና ሰራተኛ" },
    { username: "waiter", password: "waiter123", role: "አስተናጋጅ" },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Store className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurant POS</h1>
          <p className="text-gray-600 mt-2">የምግብ ቤት አስተዳደር ስርዓት</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ወደ ስርዓቱ ይግቡ</CardTitle>
            <CardDescription>የተጠቃሚ ስምዎን እና የይለፍ ቃልዎን ያስገቡ</CardDescription>
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
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">የይለፍ ቃል</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="የይለፍ ቃል ያስገቡ"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
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
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    እየገባ ነው...
                  </>
                ) : (
                  "ግባ"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">የሙከራ መለያዎች</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <div
                  key={account.username}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setUsername(account.username)
                    setPassword(account.password)
                  }}
                >
                  <div>
                    <p className="text-sm font-medium">{account.role}</p>
                    <p className="text-xs text-gray-500">{account.username}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    ተጠቀም
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
