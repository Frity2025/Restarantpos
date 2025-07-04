"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ChefHat } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const result = await login(username, password)
    if (!result.success) {
      setError(result.error || "ግባ አልተሳካም")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <ChefHat className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">ቺሊ POS</CardTitle>
          <CardDescription>የምግብ ቤት አስተዳደር ስርዓት</CardDescription>
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
            <p className="text-sm font-medium text-gray-700 mb-2">የሙከራ መለያዎች:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>
                <strong>አድሚን:</strong> admin / admin123
              </p>
              <p>
                <strong>ገንዘብ ተቀባይ:</strong> cashier / cashier123
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
