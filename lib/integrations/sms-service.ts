export interface SMSConfig {
  provider: "twilio" | "nexmo" | "local"
  apiKey: string
  apiSecret: string
  from: string
}

export class SMSService {
  private config: SMSConfig

  constructor(config: SMSConfig) {
    this.config = config
  }

  async sendSMS(to: string, message: string) {
    // Mock implementation - in production, integrate with actual SMS service
    console.log(`Sending SMS to ${to}: ${message}`)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
      messageId: `sms_${Date.now()}`,
      timestamp: new Date().toISOString(),
    }
  }

  async sendOrderNotification(phone: string, orderData: any, language = "am") {
    const messages = {
      am: `ትዕዛዝዎ #${orderData.id} ተረጋግጧል። የመውጫ ጊዜ: ${orderData.estimatedTime}። ጠቅላላ: ${orderData.total} ብር`,
      en: `Your order #${orderData.id} is confirmed. Ready in: ${orderData.estimatedTime}. Total: ${orderData.total} ETB`,
    }

    const message = messages[language as keyof typeof messages] || messages.am
    return this.sendSMS(phone, message)
  }

  async sendPasswordResetCode(phone: string, code: string, language = "am") {
    const messages = {
      am: `የይለፍ ቃል ዳግም ማስተካከያ ኮድ: ${code}። ይህ ኮድ በ5 ደቂቃ ውስጥ ይጠፋል።`,
      en: `Password reset code: ${code}. This code expires in 5 minutes.`,
    }

    const message = messages[language as keyof typeof messages] || messages.am
    return this.sendSMS(phone, message)
  }
}

export const smsService = new SMSService({
  provider: "local",
  apiKey: process.env.SMS_API_KEY || "",
  apiSecret: process.env.SMS_API_SECRET || "",
  from: process.env.SMS_FROM || "Restaurant",
})
