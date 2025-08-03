interface SMSConfig {
  provider: "ethio_telecom" | "safaricom" | "twilio"
  ethioTelecom?: {
    username: string
    password: string
    senderId: string
  }
  safaricom?: {
    consumerKey: string
    consumerSecret: string
    shortCode: string
  }
  twilio?: {
    accountSid: string
    authToken: string
    fromNumber: string
  }
}

interface SMSData {
  to: string
  message: string
}

class SMSService {
  private config: SMSConfig

  constructor() {
    this.config = {
      provider: (process.env.SMS_PROVIDER as "ethio_telecom" | "safaricom" | "twilio") || "ethio_telecom",
      ethioTelecom: {
        username: process.env.ETHIO_TELECOM_USERNAME || "",
        password: process.env.ETHIO_TELECOM_PASSWORD || "",
        senderId: process.env.ETHIO_TELECOM_SENDER_ID || "Restaurant",
      },
      safaricom: {
        consumerKey: process.env.SAFARICOM_CONSUMER_KEY || "",
        consumerSecret: process.env.SAFARICOM_CONSUMER_SECRET || "",
        shortCode: process.env.SAFARICOM_SHORT_CODE || "",
      },
      twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID || "",
        authToken: process.env.TWILIO_AUTH_TOKEN || "",
        fromNumber: process.env.TWILIO_FROM_NUMBER || "",
      },
    }
  }

  async sendSMS(data: SMSData): Promise<boolean> {
    try {
      switch (this.config.provider) {
        case "ethio_telecom":
          return await this.sendViaEthioTelecom(data)
        case "safaricom":
          return await this.sendViaSafaricom(data)
        case "twilio":
          return await this.sendViaTwilio(data)
        default:
          throw new Error("Invalid SMS provider")
      }
    } catch (error) {
      console.error("SMS sending failed:", error)
      return false
    }
  }

  private async sendViaEthioTelecom(data: SMSData): Promise<boolean> {
    // Mock Ethio Telecom SMS implementation
    console.log("Sending SMS via Ethio Telecom:", data)
    return true
  }

  private async sendViaSafaricom(data: SMSData): Promise<boolean> {
    // Mock Safaricom SMS implementation
    console.log("Sending SMS via Safaricom:", data)
    return true
  }

  private async sendViaTwilio(data: SMSData): Promise<boolean> {
    // Mock Twilio SMS implementation
    console.log("Sending SMS via Twilio:", data)
    return true
  }

  async sendVerificationCode(phoneNumber: string, code: string, language: "en" | "am" = "am"): Promise<boolean> {
    const messages = {
      en: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
      am: `የማረጋገጫ ኮድዎ: ${code}። ይህ ኮድ በ10 ደቂቃ ውስጥ ይጠፋል።`,
    }

    return await this.sendSMS({
      to: phoneNumber,
      message: messages[language],
    })
  }

  async sendOrderNotification(
    phoneNumber: string,
    orderNumber: string,
    status: string,
    language: "en" | "am" = "am",
  ): Promise<boolean> {
    const messages = {
      en: `Order #${orderNumber} status: ${status}. Thank you for choosing our restaurant!`,
      am: `ትዕዛዝ #${orderNumber} ሁኔታ: ${status}። ምግብ ቤታችንን ስለመረጡ እናመሰግናለን!`,
    }

    return await this.sendSMS({
      to: phoneNumber,
      message: messages[language],
    })
  }

  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }
}

export const smsService = new SMSService()
