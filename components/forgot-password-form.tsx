"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import { passwordResetService } from "@/lib/auth/password-reset"
import { ArrowLeft, Mail, Phone, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"

interface ForgotPasswordFormProps {
  onBack: () => void
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const { t } = useLanguage()
  const [step, setStep] = useState<"request" | "verify" | "reset">("request")
  const [method, setMethod] = useState<"email" | "sms">("email")
  const [identifier, setIdentifier] = useState("")
  const [code, setCode] = useState("")
  const [token, setToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    try {
      const result = await passwordResetService.requestPasswordReset(identifier, method)
      if (result.success) {
        setMessage(result.message)
        setStep(method === "sms" ? "verify" : "reset")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const resetRequest = await passwordResetService.verifyResetCode(identifier, code)
      if (resetRequest) {
        setToken(resetRequest.token)
        setStep("reset")
        setMessage(t("auth.codeVerified"))
      } else {
        setError(t("auth.invalidCode"))
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (newPassword !== confirmPassword) {
      setError(t("auth.passwordMismatch"))
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError(t("auth.passwordTooShort"))
      setIsLoading(false)
      return
    }

    try {
      let success = false

      if (method === "sms") {
        success = await passwordResetService.resetPasswordWithCode(identifier, code, newPassword)
      } else {
        success = await passwordResetService.resetPassword(token, newPassword)
      }

      if (success) {
        setMessage(t("auth.passwordChanged"))
        setTimeout(() => {
          onBack()
        }, 2000)
      } else {
        setError(t("auth.resetFailed"))
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="absolute left-4 top-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("common.back")}
          </Button>

          <CardTitle className="text-2xl font-bold text-gray-900 mt-8">
            {step === "request" && t("auth.forgotPassword")}
            {step === "verify" && t("auth.verifyCode")}
            {step === "reset" && t("auth.resetPassword")}
          </CardTitle>

          <CardDescription className="text-gray-600">
            {step === "request" && t("auth.resetPasswordDescription")}
            {step === "verify" && t("auth.enterVerificationCode")}
            {step === "reset" && t("auth.enterNewPassword")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === "request" && (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <Tabs value={method} onValueChange={(value) => setMethod(value as "email" | "sms")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email" className="gap-2">
                    <Mail className="h-4 w-4" />
                    {t("auth.email")}
                  </TabsTrigger>
                  <TabsTrigger value="sms" className="gap-2">
                    <Phone className="h-4 w-4" />
                    {t("auth.phone")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("auth.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="pl-10"
                        placeholder="example@restaurant.com"
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sms" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("auth.phone")}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="pl-10"
                        placeholder="+251912345678"
                        required
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {message && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">{message}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                {isLoading ? t("common.loading") : t("auth.sendResetLink")}
              </Button>
            </form>
          )}

          {step === "verify" && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">{t("auth.verificationCode")}</Label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                  required
                />
                <p className="text-sm text-gray-500 text-center">
                  {t("auth.codeSentTo")} {identifier}
                </p>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                {isLoading ? t("common.loading") : t("auth.verifyCode")}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => setStep("request")}
              >
                {t("auth.resendCode")}
              </Button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t("auth.newPassword")}</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
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
                <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {message && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">{message}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                {isLoading ? t("common.loading") : t("auth.resetPassword")}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
