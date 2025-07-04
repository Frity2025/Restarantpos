"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, LogIn } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
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
      setError(result.error || "የመግቢያ ስህተት ተከስቷል")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <LogIn className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">ወደ ስርዓቱ ይግቡ</CardTitle>
          <CardDescription className="text-center">የተጠቃሚ ስምዎን እና የይለፍ ቃልዎን ያስገቡ</CardDescription>
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
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="የይለፍ ቃል ያስገቡ"
                disabled={isLoading}
              />
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

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">የሙከራ መለያዎች:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div>
                <strong>አድሚን:</strong> admin / admin123
              </div>
              <div>
                <strong>ገንዘብ ተቀባይ:</strong> cashier / cashier123
              </div>
              <div>
                <strong>ኩሽና:</strong> kitchen / kitchen123
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
