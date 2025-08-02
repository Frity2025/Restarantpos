"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const success = await login(email, password)
      if (!success) {
        setError("የመግቢያ መረጃዎች ትክክል አይደሉም")
      }
    } catch (err) {
      setError("የመግቢያ ስህተት ተከስቷል")
    } finally {
      setIsLoading(false)
    }
  }

  const quickLogin = (role: "admin" | "cashier" | "kitchen") => {
    const credentials = {
      admin: { email: "admin@restaurant.com", password: "admin" },
      cashier: { email: "cashier@restaurant.com", password: "cashier" },
      kitchen: { email: "kitchen@restaurant.com", password: "kitchen" },
    }

    setEmail(credentials[role].email)
    setPassword(credentials[role].password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">የባህል ምግብ ቤት</CardTitle>
          <CardDescription>የሰራተኛ መግቢያ</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">ኢሜይል</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">የይለፍ ቃል</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "እየገባ..." : "ግባ"}
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-sm text-gray-600 text-center mb-3">ፈጣን መግቢያ:</p>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => quickLogin("admin")} className="text-xs">
                አስተዳዳሪ
              </Button>
              <Button variant="outline" size="sm" onClick={() => quickLogin("cashier")} className="text-xs">
                ገንዘብ ተቀባይ
              </Button>
              <Button variant="outline" size="sm" onClick={() => quickLogin("kitchen")} className="text-xs">
                ኩሽና
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
