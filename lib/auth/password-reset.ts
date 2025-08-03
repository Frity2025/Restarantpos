import { emailService } from "../integrations/email-service"
import { smsService } from "../integrations/sms-service"

export interface PasswordResetRequest {
  id: string
  email?: string
  phone?: string
  token: string
  code?: string
  expiresAt: Date
  used: boolean
  createdAt: Date
}

class PasswordResetService {
  private resetRequests: Map<string, PasswordResetRequest> = new Map()

  generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  async requestPasswordReset(identifier: string, method: "email" | "sms", language = "am") {
    const isEmail = identifier.includes("@")
    const token = this.generateToken()
    const code = this.generateCode()

    const resetRequest: PasswordResetRequest = {
      id: `reset_${Date.now()}`,
      email: isEmail ? identifier : undefined,
      phone: !isEmail ? identifier : undefined,
      token,
      code: method === "sms" ? code : undefined,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      used: false,
      createdAt: new Date(),
    }

    this.resetRequests.set(token, resetRequest)

    try {
      if (method === "email" && isEmail) {
        await emailService.sendPasswordReset(identifier, token, language)
      } else if (method === "sms" && !isEmail) {
        await smsService.sendPasswordResetCode(identifier, code, language)
      }

      return {
        success: true,
        message:
          method === "email"
            ? language === "am"
              ? "የይለፍ ቃል ዳግም ማስተካከያ አገናኝ ወደ ኢሜይልዎ ተልኳል"
              : "Password reset link sent to your email"
            : language === "am"
              ? "የይለፍ ቃል ዳግም ማስተካከያ ኮድ ወደ ስልክዎ ተልኳል"
              : "Password reset code sent to your phone",
        requestId: resetRequest.id,
      }
    } catch (error) {
      this.resetRequests.delete(token)
      throw new Error(language === "am" ? "የይለፍ ቃል ዳግም ማስተካከያ መላክ አልተሳካም" : "Failed to send password reset")
    }
  }

  async verifyResetToken(token: string): Promise<PasswordResetRequest | null> {
    const resetRequest = this.resetRequests.get(token)

    if (!resetRequest) {
      return null
    }

    if (resetRequest.used || resetRequest.expiresAt < new Date()) {
      this.resetRequests.delete(token)
      return null
    }

    return resetRequest
  }

  async verifyResetCode(identifier: string, code: string): Promise<PasswordResetRequest | null> {
    for (const [token, request] of this.resetRequests.entries()) {
      if (
        (request.email === identifier || request.phone === identifier) &&
        request.code === code &&
        !request.used &&
        request.expiresAt > new Date()
      ) {
        return request
      }
    }
    return null
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const resetRequest = this.resetRequests.get(token)

    if (!resetRequest || resetRequest.used || resetRequest.expiresAt < new Date()) {
      return false
    }

    // In a real app, you would hash the password and update the database
    console.log(`Password reset for ${resetRequest.email || resetRequest.phone}`)

    // Mark as used
    resetRequest.used = true
    this.resetRequests.set(token, resetRequest)

    // Clean up after some time
    setTimeout(() => {
      this.resetRequests.delete(token)
    }, 60000) // 1 minute

    return true
  }

  async resetPasswordWithCode(identifier: string, code: string, newPassword: string): Promise<boolean> {
    const resetRequest = await this.verifyResetCode(identifier, code)

    if (!resetRequest) {
      return false
    }

    // In a real app, you would hash the password and update the database
    console.log(`Password reset for ${identifier}`)

    // Mark as used
    resetRequest.used = true

    return true
  }

  cleanupExpiredRequests() {
    const now = new Date()
    for (const [token, request] of this.resetRequests.entries()) {
      if (request.expiresAt < now) {
        this.resetRequests.delete(token)
      }
    }
  }
}

export const passwordResetService = new PasswordResetService()

// Clean up expired requests every 5 minutes
setInterval(
  () => {
    passwordResetService.cleanupExpiredRequests()
  },
  5 * 60 * 1000,
)
