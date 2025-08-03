"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ForgotPasswordForm } from "@/components/forgot-password-form"
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  ChefHat,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Utensils,
} from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { login } = useAuth()
  const { t, language } = useLanguage()

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Basic validation
    if (!email || !password) {
      setError(t("auth.fillAllFields"))
      setIsLoading(false)
      return
    }

    try {
      const success = await login(email, password)
      if (!success) {
        setError(t("auth.invalidCredentials"))
      }
    } catch (err) {
      setError(t("auth.loginError"))
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
    setError("")
  }

  const roleInfo = {
    admin: {
      icon: Shield,
      title: t("employees.admin"),
      description: t("auth.adminDescription"),
      color: "bg-blue-500",
      permissions: [
        t("auth.allReports"),
        t("auth.employeeManagement"),
        t("auth.foodManagement"),
        t("auth.inventoryManagement"),
      ],
    },
    cashier: {
      icon: CreditCard,
      title: t("employees.cashier"),
      description: t("auth.cashierDescription"),
      color: "bg-green-500",
      permissions: [t("nav.pos"), t("auth.orderManagement"), t("auth.paymentProcess"), t("auth.customerService")],
    },
    kitchen: {
      icon: ChefHat,
      title: t("employees.kitchen"),
      description: t("auth.kitchenDescription"),
      color: "bg-orange-500",
      permissions: [t("auth.orderView"), t("auth.foodPreparation"), t("auth.inventoryView"), t("auth.kitchenReport")],
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding and Info */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-orange-500 rounded-full">
                <Utensils className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                {language === "am" ? "የባህል ምግብ ቤት" : "Cultural Restaurant"}
              </h1>
            </div>
            <p className="text-xl text-gray-600">
              {language === "am" ? "ዘመናዊ የምግብ ቤት አስተዳደር ስርዓት" : "Modern Restaurant Management System"}
            </p>
          </div>

          {/* Current Time */}
          <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-500">{language === "am" ? "አሁን ያለው ጊዜ" : "Current Time"}</span>
              </div>
              <div className="text-2xl font-mono font-bold text-gray-900">
                {currentTime.toLocaleTimeString(language === "am" ? "am-ET" : "en-US", {
                  hour12: true,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
              <div className="text-sm text-gray-600">
                {currentTime.toLocaleDateString(language === "am" ? "am-ET" : "en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">{language === "am" ? "ቀላል አጠቃቀም" : "Easy to Use"}</h3>
                <p className="text-sm text-gray-600">{language === "am" ? "ለሁሉም ሰራተኞች ቀላል" : "Simple for all staff"}</p>
              </CardContent>
            </Card>
            <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">{language === "am" ? "ደህንነት" : "Security"}</h3>
                <p className="text-sm text-gray-600">{language === "am" ? "የተጠበቀ መረጃ" : "Secure data"}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center lg:hidden space-x-3">
                  <div className="p-2 bg-orange-500 rounded-full">
                    <Utensils className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {language === "am" ? "የባህል ምግብ ቤት" : "Cultural Restaurant"}
                  </h1>
                </div>
                <LanguageSwitcher />
              </div>

              <CardTitle className="text-2xl font-bold text-gray-900 mt-4">{t("auth.loginTitle")}</CardTitle>
              <CardDescription className="text-gray-600">{t("auth.loginSubtitle")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    {t("auth.email")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11"
                      placeholder="example@restaurant.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    {t("auth.password")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11"
                      placeholder={language === "am" ? "የይለፍ ቃልዎን ያስገቡ" : "Enter your password"}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      {t("auth.rememberMe")}
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-orange-600 hover:text-orange-700 p-0"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    {t("auth.forgotPassword")}
                  </Button>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t("common.loading")}</span>
                    </div>
                  ) : (
                    t("auth.login")
                  )}
                </Button>
              </form>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">
                      {language === "am" ? "ወይም ፈጣን መግቢያ" : "or quick login"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(roleInfo).map(([role, info]) => {
                    const IconComponent = info.icon
                    return (
                      <Button
                        key={role}
                        variant="outline"
                        onClick={() => quickLogin(role as "admin" | "cashier" | "kitchen")}
                        className="h-auto p-4 justify-start hover:bg-gray-50 border-gray-200"
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <div className={`p-2 rounded-full ${info.color}`}>
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <div className="font-medium text-gray-900">{info.title}</div>
                            <div className="text-xs text-gray-500">{info.description}</div>
                          </div>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Role Information */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    {language === "am" ? "የሚና መረጃ" : "Role Information"}
                  </h4>
                  <div className="space-y-2 text-xs text-blue-800">
                    <div>
                      <strong>{t("employees.admin")}:</strong>{" "}
                      {language === "am" ? "ሙሉ የስርዓት መዳረሻ እና አስተዳደር" : "Full system access and management"}
                    </div>
                    <div>
                      <strong>{t("employees.cashier")}:</strong>{" "}
                      {language === "am" ? "የሽያጭ ነጥብ እና የክፍያ ሂደት" : "Point of sale and payment processing"}
                    </div>
                    <div>
                      <strong>{t("employees.kitchen")}:</strong>{" "}
                      {language === "am" ? "የትዕዛዝ እይታ እና የምግብ ዝግጅት" : "Order view and food preparation"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>
              {language === "am"
                ? "© 2024 የባህል ምግብ ቤት. ሁሉም መብቶች የተጠበቁ ናቸው።"
                : "© 2024 Cultural Restaurant. All rights reserved."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
