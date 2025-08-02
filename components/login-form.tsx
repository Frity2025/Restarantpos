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
  const { login } = useAuth()

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Basic validation
    if (!email || !password) {
      setError("እባክዎ ሁሉንም መስኮች ይሙሉ")
      setIsLoading(false)
      return
    }

    try {
      const success = await login(email, password)
      if (!success) {
        setError("የመግቢያ መረጃዎች ትክክል አይደሉም። እባክዎ እንደገና ይሞክሩ።")
      }
    } catch (err) {
      setError("የመግቢያ ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።")
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
      title: "አስተዳዳሪ",
      description: "ሙሉ የስርዓት መዳረሻ",
      color: "bg-blue-500",
      permissions: ["ሁሉንም ሪፖርቶች", "የሰራተኛ አስተዳደር", "የምግብ አስተዳደር", "የክምችት አስተዳደር"],
    },
    cashier: {
      icon: CreditCard,
      title: "ገንዘብ ተቀባይ",
      description: "የሽያጭ ነጥብ መዳረሻ",
      color: "bg-green-500",
      permissions: ["የሽያጭ ነጥብ", "የትዕዛዝ አስተዳደር", "የክፍያ ሂደት", "የደንበኛ አገልግሎት"],
    },
    kitchen: {
      icon: ChefHat,
      title: "ኩሽና ሰራተኛ",
      description: "የኩሽና ዳሽቦርድ መዳረሻ",
      color: "bg-orange-500",
      permissions: ["የትዕዛዝ እይታ", "የምግብ ዝግጅት", "የክምችት እይታ", "የኩሽና ሪፖርት"],
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
              <h1 className="text-4xl font-bold text-gray-900">የባህል ምግብ ቤት</h1>
            </div>
            <p className="text-xl text-gray-600">ዘመናዊ የምግብ ቤት አስተዳደር ስርዓት</p>
          </div>

          {/* Current Time */}
          <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-500">አሁን ያለው ጊዜ</span>
              </div>
              <div className="text-2xl font-mono font-bold text-gray-900">
                {currentTime.toLocaleTimeString("am-ET", {
                  hour12: true,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
              <div className="text-sm text-gray-600">
                {currentTime.toLocaleDateString("am-ET", {
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
                <h3 className="font-semibold text-gray-900">ቀላል አጠቃቀም</h3>
                <p className="text-sm text-gray-600">ለሁሉም ሰራተኞች ቀላል</p>
              </CardContent>
            </Card>
            <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">ደህንነት</h3>
                <p className="text-sm text-gray-600">የተጠበቀ መረጃ</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="flex items-center justify-center lg:hidden space-x-3 mb-4">
                <div className="p-2 bg-orange-500 rounded-full">
                  <Utensils className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">የባህል ምግብ ቤት</h1>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">የሰራተኛ መግቢያ</CardTitle>
              <CardDescription className="text-gray-600">የስራ መለያዎን ተጠቅመው ይግቡ</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    ኢሜይል አድራሻ
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
                    የይለፍ ቃል
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11"
                      placeholder="የይለፍ ቃልዎን ያስገቡ"
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

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    ያስታውሱኝ
                  </Label>
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
                      <span>እየገባ...</span>
                    </div>
                  ) : (
                    "ግባ"
                  )}
                </Button>
              </form>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">ወይም ፈጣን መግቢያ</span>
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
                    የሚና መረጃ
                  </h4>
                  <div className="space-y-2 text-xs text-blue-800">
                    <div>
                      <strong>አስተዳዳሪ:</strong> ሙሉ የስርዓት መዳረሻ እና አስተዳደር
                    </div>
                    <div>
                      <strong>ገንዘብ ተቀባይ:</strong> የሽያጭ ነጥብ እና የክፍያ ሂደት
                    </div>
                    <div>
                      <strong>ኩሽና:</strong> የትዕዛዝ እይታ እና የምግብ ዝግጅት
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>© 2024 የባህል ምግብ ቤት. ሁሉም መብቶች የተጠበቁ ናቸው።</p>
          </div>
        </div>
      </div>
    </div>
  )
}
