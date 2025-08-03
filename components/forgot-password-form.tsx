"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { passwordResetService } from "@/lib/auth/password-reset"
import { ArrowLeft, Mail, Phone, AlertCircle, CheckCircle, Eye, EyeOff, Utensils } from "lucide-react"

interface ForgotPasswordFormProps {
  onBack: () => void
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [step, setStep] = useState<"method" | "verify" | "reset">("method")
  const [method, setMethod] = useState<"email" | "sms">("email")
  const [identifier, setIdentifier] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const { t, language } = useLanguage()

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    if (!identifier) {
      setError(t("auth.fillAllFields"))
      setIsLoading(false)
      return
    }

    try {
      const result = await passwordResetService.requestPasswordReset(identifier, method, language)

      if (result.success) {
        setMessage(result.message)
        if (method === "sms") {
          setStep("verify")
        } else {
          // For email, show success message and stay on same step
          setTimeout(() => {
            setMessage("")
          }, 5000)
        }
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError(t("auth.resetError"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!verificationCode || verificationCode.length !== 6) {
      setError(t("auth.invalidCode"))
      setIsLoading(false)
      return
    }

    try {
      const verification = await passwordResetService.verifyResetCode(verificationCode)

      if (verification.valid) {
        setStep("reset")
      } else {
        setError(t("auth.invalidCode"))
      }
    } catch (err) {
      setError(t("auth.resetError"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!newPassword || !confirmPassword) {
      setError(t("auth.fillAllFields"))
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError(t("auth.passwordMismatch"))
      setIsLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError(t("auth.passwordTooShort"))
      setIsLoading(false)
      return
    }

    try {
      const result = await passwordResetService.resetPassword(verificationCode, newPassword, true)

      if (result.success) {
        setMessage(t("auth.resetSuccess"))
        setTimeout(() => {
          onBack()
        }, 2000)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError(t("auth.resetError"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="flex justify-between items-center">
              <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>{t("auth.backToLogin")}</span>
              </Button>
              <LanguageSwitcher />
            </div>

            <div className="flex items-center justify-center space-x-3">
              <div className="p-2 bg-orange-500 rounded-full">
                <Utensils className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === "am" ? "የባህል ምግብ ቤት" : "Cultural Restaurant"}
              </h1>
            </div>

            <CardTitle className="text-2xl font-bold text-gray-900">{t("auth.resetPasswordTitle")}</CardTitle>
            <CardDescription className="text-gray-600">
              {step === "method" && t("auth.resetPasswordSubtitle")}
              {step === "verify" && t("auth.enterCode")}
              {step === "reset" && (language === "am" ? "አዲስ የይለፍ ቃልዎን ያስገቡ" : "Enter your new password")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Choose method and enter identifier */}
            {step === "method" && (
              <form onSubmit={handleSendReset} className="space-y-4">
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">{t("auth.resetMethod")}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={method === "email" ? "default" : "outline"}
                      onClick={() => setMethod("email")}
                      className="flex items-center space-x-2"
                    >
                      <Mail className="h-4 w-4" />
                      <span>{t("auth.useEmail")}</span>
                    </Button>
                    <Button
                      type="button"
                      variant={method === "sms" ? "default" : "outline"}
                      onClick={() => setMethod("sms")}
                      className="flex items-center space-x-2"
                    >
                      <Phone className="h-4 w-4" />
                      <span>{t("auth.useSMS")}</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-sm font-medium text-gray-700">
                    {t("auth.emailOrPhone")}
                  </Label>
                  <div className="relative">
                    {method === "email" ? (
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    ) : (
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    )}
                    <Input
                      id="identifier"
                      type={method === "email" ? "email" : "tel"}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="pl-10 h-11"
                      placeholder={method === "email" ? "example@restaurant.com" : "+251912345678"}
                      required
                    />
                  </div>
                </div>

                {message && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">{message}</AlertDescription>
                  </Alert>
                )}

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
                  ) : method === "email" ? (
                    t("auth.sendResetLink")
                  ) : (
                    t("auth.sendResetCode")
                  )}
                </Button>
              </form>
            )}

            {/* Step 2: Verify SMS code */}
            {step === "verify" && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                    {t("auth.verificationCode")}
                  </Label>
                  <Input
                    id="code"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="h-11 text-center text-2xl tracking-widest"
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
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
                  disabled={isLoading || verificationCode.length !== 6}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t("common.loading")}</span>
                    </div>
                  ) : (
                    t("common.confirm")
                  )}
                </Button>

                <Button type="button" variant="outline" onClick={() => setStep("method")} className="w-full">
                  {t("common.back")}
                </Button>
              </form>
            )}

            {/* Step 3: Reset password */}
            {step === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                    {t("auth.newPassword")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pr-10 h-11"
                      placeholder={language === "am" ? "አዲስ የይለፍ ቃል" : "New password"}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    {t("auth.confirmPassword")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10 h-11"
                      placeholder={language === "am" ? "የይለፍ ቃል አረጋግጥ" : "Confirm password"}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {message && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">{message}</AlertDescription>
                  </Alert>
                )}

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
                    t("auth.resetPassword")
                  )}
                </Button>
              </form>
            )}
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
  )
}
