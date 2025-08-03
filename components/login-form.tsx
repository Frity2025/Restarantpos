"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, User, Shield, ChefHat, Clock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { ForgotPasswordForm } from "./forgot-password-form"

const quickLoginUsers = [
  {
    email: "admin@restaurant.com",
    password: "admin",
    role: "admin",
    name: "አስተዳዳሪ",
    nameEn: "Administrator",
    icon: Shield,
    description: "adminDescription",
    permissions: ["allReports", "employeeManagement", "foodManagement", "inventoryManagement"],
  },
  {
    email: "cashier@restaurant.com",
    password: "cashier",
    role: "cashier",
    name: "ገንዘብ ተቀባይ",
    nameEn: "Cashier",
    icon: User,
    description: "cashierDescription",
    permissions: ["orderManagement", "paymentProcess", "customerService"],
  },
  {
    email: "kitchen@restaurant.com",
    password: "kitchen",
    role: "kitchen",
    name: "ኩሽና ሰራተኛ",
    nameEn: "Kitchen Staff",
    icon: ChefHat,
    description: "kitchenDescription",
    permissions: ["orderView", "foodPreparation", "inventoryView", "kitchenReport"],
  },
]

export function LoginForm() {
  const { t, language } = useLanguage()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!email || !password) {
      setError(t("auth.fillAllFields"))
      setIsLoading(false)
      return
    }

    try {
      const success = await login(email, password, rememberMe)
      if (!success) {
        setError(t("auth.invalidCredentials"))
      }
    } catch (error) {
      setError(t("auth.loginError"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = async (user: (typeof quickLoginUsers)[0]) => {
    setIsLoading(true)
    setError("")

    try {
      const success = await login(user.email, user.password, false)
      if (!success) {
        setError(t("auth.loginError"))
      }
    } catch (error) {
      setError(t("auth.loginError"))
    } finally {
      setIsLoading(false)
    }
  }

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">{t("auth.loginTitle")}</CardTitle>
          <CardDescription className="text-center">{t("auth.loginSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm">
                {t("auth.rememberMe")}
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("common.loading") : t("auth.login")}
            </Button>
          </form>

          <div className="text-center">
            <Button variant="link" className="text-sm" onClick={() => setShowForgotPassword(true)}>
              {t("auth.forgotPassword")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Login Section */}
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {language === "am" ? "ፈጣን መግቢያ" : "Quick Login"}
          </CardTitle>
          <CardDescription>
            {language === "am" ? "ለሙከራ ዓላማ የሚያገለግሉ መለያዎች" : "Demo accounts for testing purposes"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickLoginUsers.map((user) => {
            const Icon = user.icon
            return (
              <Button
                key={user.email}
                variant="outline"
                className="w-full h-auto p-4 flex flex-col items-start space-y-2 bg-transparent"
                onClick={() => handleQuickLogin(user)}
                disabled={isLoading}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{language === "am" ? user.name : user.nameEn}</span>
                  </div>
                  <Badge variant="secondary">{user.role}</Badge>
                </div>
                <p className="text-sm text-muted-foreground text-left">{t(`auth.${user.description}`)}</p>
                <div className="flex flex-wrap gap-1">
                  {user.permissions.slice(0, 3).map((permission) => (
                    <Badge key={permission} variant="outline" className="text-xs">
                      {t(`auth.${permission}`)}
                    </Badge>
                  ))}
                  {user.permissions.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{user.permissions.length - 3}
                    </Badge>
                  )}
                </div>
              </Button>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
