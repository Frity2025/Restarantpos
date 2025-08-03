import { emailService } from "@/lib/integrations/email-service"
import { smsService } from "@/lib/integrations/sms-service"

interface PasswordResetRequest {
  id: string
  email?: string
  phone?: string
  token: string
  code?: string
  expiresAt: Date
  used: boolean
  method: "email" | "sms"
}

class PasswordResetService {
  private requests: Map<string, PasswordResetRequest> = new Map()

  generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  async requestPasswordReset(
    identifier: string,
    method: "email" | "sms" = "email",
    language: "en" | "am" = "en",
  ): Promise<{ success: boolean; message: string }> {
    try {
      const token = this.generateToken()
      const code = this.generateCode()
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

      const request: PasswordResetRequest = {
        id: token,
        token,
        expiresAt,
        used: false,
        method,
      }

      if (method === "email") {
        request.email = identifier
        const emailSent = await emailService.sendPasswordReset(identifier, token, language)

        if (!emailSent) {
          return {
            success: false,
            message: language === "am" ? "ኢሜይል መላክ አልተሳካም" : "Failed to send email",
          }
        }
      } else {
        request.phone = identifier
        request.code = code
        const smsSent = await smsService.sendPasswordResetCode(identifier, code, language)

        if (!smsSent) {
          return {
            success: false,
            message: language === "am" ? "SMS መላክ አልተሳካም" : "Failed to send SMS",
          }
        }
      }

      this.requests.set(token, request)

      // Clean up expired requests
      this.cleanupExpiredRequests()

      return {
        success: true,
        message:
          method === "email"
            ? language === "am"
              ? "የይለፍ ቃል ዳግም ማስተካከያ አገናኝ ወደ ኢሜይልዎ ተልኳል"
              : "Password reset link sent to your email"
            : language === "am"
              ? "የማረጋገጫ ኮድ ወደ ስልክዎ ተልኳል"
              : "Verification code sent to your phone",
      }
    } catch (error) {
      console.error("Password reset request failed:", error)
      return {
        success: false,
        message: language === "am" ? "የይለፍ ቃል ዳግም ማስተካከያ ጥያቄ አልተሳካም" : "Password reset request failed",
      }
    }
  }

  async verifyResetToken(token: string): Promise<{ valid: boolean; request?: PasswordResetRequest }> {
    const request = this.requests.get(token)

    if (!request) {
      return { valid: false }
    }

    if (request.used || request.expiresAt < new Date()) {
      return { valid: false }
    }

    return { valid: true, request }
  }

  async verifyResetCode(code: string): Promise<{ valid: boolean; request?: PasswordResetRequest }> {
    for (const [token, request] of this.requests.entries()) {
      if (request.code === code && !request.used && request.expiresAt > new Date()) {
        return { valid: true, request }
      }
    }

    return { valid: false }
  }

  async resetPassword(
    tokenOrCode: string,
    newPassword: string,
    isCode = false,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const verification = isCode ? await this.verifyResetCode(tokenOrCode) : await this.verifyResetToken(tokenOrCode)

      if (!verification.valid || !verification.request) {
        return {
          success: false,
          message: "Invalid or expired reset token/code",
        }
      }

      // Mark as used
      verification.request.used = true
      this.requests.set(verification.request.token, verification.request)

      // In a real application, you would update the user's password in the database
      console.log("Password reset successful for:", verification.request.email || verification.request.phone)

      return {
        success: true,
        message: "Password reset successful",
      }
    } catch (error) {
      console.error("Password reset failed:", error)
      return {
        success: false,
        message: "Password reset failed",
      }
    }
  }

  private cleanupExpiredRequests(): void {
    const now = new Date()
    for (const [token, request] of this.requests.entries()) {
      if (request.expiresAt < now) {
        this.requests.delete(token)
      }
    }
  }
}

export const passwordResetService = new PasswordResetService()
export { PasswordResetService, type PasswordResetRequest }
