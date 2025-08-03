interface SMSConfig {
  provider: "twilio" | "nexmo" | "local"
  apiKey: string
  apiSecret: string
  from: string
}

interface SMSData {
  to: string
  message: string
}

class SMSService {
  private config: SMSConfig

  constructor(config: SMSConfig) {
    this.config = config
  }

  async sendSMS(data: SMSData): Promise<boolean> {
    try {
      switch (this.config.provider) {
        case "twilio":
          return await this.sendTwilio(data)
        case "nexmo":
          return await this.sendNexmo(data)
        case "local":
          return await this.sendLocal(data)
        default:
          return await this.sendLocal(data)
      }
    } catch (error) {
      console.error("SMS sending failed:", error)
      return false
    }
  }

  private async sendTwilio(data: SMSData): Promise<boolean> {
    console.log("Sending SMS via Twilio:", {
      to: data.to,
      from: this.config.from,
      message: data.message.substring(0, 50) + "...",
    })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return true
  }

  private async sendNexmo(data: SMSData): Promise<boolean> {
    console.log("Sending SMS via Nexmo:", {
      to: data.to,
      from: this.config.from,
      message: data.message.substring(0, 50) + "...",
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))
    return true
  }

  private async sendLocal(data: SMSData): Promise<boolean> {
    console.log("Sending SMS via Local Provider:", {
      to: data.to,
      from: this.config.from,
      message: data.message.substring(0, 50) + "...",
    })

    await new Promise((resolve) => setTimeout(resolve, 500))
    return true
  }

  async sendPasswordResetCode(phone: string, code: string, language: "en" | "am" = "en"): Promise<boolean> {
    const messages = {
      en: `Your password reset code for Cultural Restaurant is: ${code}. This code expires in 15 minutes.`,
      am: `የባህል ምግብ ቤት የይለፍ ቃል ዳግም ማስተካከያ ኮድዎ: ${code}። ይህ ኮድ በ15 ደቂቃ ውስጥ ይጠፋል።`,
    }

    return await this.sendSMS({
      to: phone,
      message: messages[language],
    })
  }

  async sendOrderNotification(phone: string, orderData: any, language: "en" | "am" = "en"): Promise<boolean> {
    const messages = {
      en: `Your order #${orderData.id} is ${orderData.status}. Total: ${orderData.total} ETB. Thank you for choosing Cultural Restaurant!`,
      am: `የእርስዎ ትዕዛዝ #${orderData.id} ${orderData.status} ነው። ጠቅላላ: ${orderData.total} ብር። የባህል ምግብ ቤትን ስለመረጡ እናመሰግናለን!`,
    }

    return await this.sendSMS({
      to: phone,
      message: messages[language],
    })
  }

  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }
}

// Create SMS service instance
const smsConfig: SMSConfig = {
  provider: "local",
  apiKey: process.env.SMS_API_KEY || "",
  apiSecret: process.env.SMS_API_SECRET || "",
  from: process.env.SMS_FROM || "Restaurant",
}

export const smsService = new SMSService(smsConfig)
export { SMSService, type SMSConfig, type SMSData }
