import { emailService } from "@/lib/integrations/email-service"
import { smsService } from "@/lib/integrations/sms-service"
import crypto from "crypto"

interface ResetToken {
  token: string
  email?: string
  phone?: string
  expiresAt: Date
  type: "email" | "sms"
}

class PasswordResetService {
  private tokens: Map<string, ResetToken> = new Map()

  generateResetToken(): string {
    return crypto.randomBytes(32).toString("hex")
  }

  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  async initiateEmailReset(
    email: string,
    language: "en" | "am" = "am",
  ): Promise<{ success: boolean; message: string }> {
    try {
      const token = this.generateResetToken()
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      this.tokens.set(token, {
        token,
        email,
        expiresAt,
        type: "email",
      })

      const success = await emailService.sendPasswordReset(email, token, language)

      if (success) {
        return {
          success: true,
          message:
            language === "en" ? "Password reset link sent to your email" : "የይለፍ ቃል ዳግም ማስተካከያ አገናኝ ወደ ኢሜይልዎ ተልኳል",
        }
      } else {
        return {
          success: false,
          message: language === "en" ? "Failed to send reset email" : "የዳግም ማስተካከያ ኢሜይል መላክ አልተሳካም",
        }
      }
    } catch (error) {
      console.error("Email reset initiation failed:", error)
      return {
        success: false,
        message: language === "en" ? "Password reset failed" : "የይለፍ ቃል ዳግም ማስተካከል አልተሳካም",
      }
    }
  }

  async initiateSMSReset(
    phone: string,
    language: "en" | "am" = "am",
  ): Promise<{ success: boolean; message: string; code?: string }> {
    try {
      const code = this.generateVerificationCode()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      this.tokens.set(code, {
        token: code,
        phone,
        expiresAt,
        type: "sms",
      })

      const success = await smsService.sendVerificationCode(phone, code, language)

      if (success) {
        return {
          success: true,
          message: language === "en" ? "Verification code sent to your phone" : "የማረጋገጫ ኮድ ወደ ስልክዎ ተልኳል",
          code: process.env.NODE_ENV === "development" ? code : undefined, // Only in development
        }
      } else {
        return {
          success: false,
          message: language === "en" ? "Failed to send verification code" : "የማረጋገጫ ኮድ መላክ አልተሳካም",
        }
      }
    } catch (error) {
      console.error("SMS reset initiation failed:", error)
      return {
        success: false,
        message: language === "en" ? "Password reset failed" : "የይለፍ ቃል ዳግም ማስተካከል አልተሳካም",
      }
    }
  }

  async verifyResetToken(
    token: string,
  ): Promise<{ valid: boolean; email?: string; phone?: string; type?: "email" | "sms" }> {
    const resetToken = this.tokens.get(token)

    if (!resetToken) {
      return { valid: false }
    }

    if (resetToken.expiresAt < new Date()) {
      this.tokens.delete(token)
      return { valid: false }
    }

    return {
      valid: true,
      email: resetToken.email,
      phone: resetToken.phone,
      type: resetToken.type,
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const verification = await this.verifyResetToken(token)

    if (!verification.valid) {
      return {
        success: false,
        message: "Invalid or expired reset token",
      }
    }

    try {
      // Here you would update the password in your database
      // For now, we'll just simulate success
      console.log("Password reset for:", verification.email || verification.phone)

      // Remove the used token
      this.tokens.delete(token)

      return {
        success: true,
        message: "Password reset successfully",
      }
    } catch (error) {
      console.error("Password reset failed:", error)
      return {
        success: false,
        message: "Password reset failed",
      }
    }
  }

  // Clean up expired tokens periodically
  cleanupExpiredTokens(): void {
    const now = new Date()
    for (const [token, resetToken] of this.tokens.entries()) {
      if (resetToken.expiresAt < now) {
        this.tokens.delete(token)
      }
    }
  }
}

export const passwordResetService = new PasswordResetService()

// Clean up expired tokens every 5 minutes
setInterval(
  () => {
    passwordResetService.cleanupExpiredTokens()
  },
  5 * 60 * 1000,
)
