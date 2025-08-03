interface EmailConfig {
  provider: "smtp" | "sendgrid" | "mailgun" | "ses"
  host?: string
  port?: number
  username?: string
  password?: string
  apiKey?: string
  from: string
}

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

interface EmailData {
  to: string
  subject: string
  html?: string
  text?: string
  template?: string
  variables?: Record<string, any>
}

class EmailService {
  private config: EmailConfig

  constructor(config: EmailConfig) {
    this.config = config
  }

  async sendEmail(data: EmailData): Promise<boolean> {
    try {
      switch (this.config.provider) {
        case "smtp":
          return await this.sendSMTP(data)
        case "sendgrid":
          return await this.sendSendGrid(data)
        default:
          return await this.sendSMTP(data)
      }
    } catch (error) {
      console.error("Email sending failed:", error)
      return false
    }
  }

  private async sendSMTP(data: EmailData): Promise<boolean> {
    // Simulate SMTP sending
    console.log("Sending email via SMTP:", {
      to: data.to,
      subject: data.subject,
      from: this.config.from,
    })

    // In production, use nodemailer or similar
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return true
  }

  private async sendSendGrid(data: EmailData): Promise<boolean> {
    // Simulate SendGrid API call
    console.log("Sending email via SendGrid:", {
      to: data.to,
      subject: data.subject,
      from: this.config.from,
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))
    return true
  }

  async sendPasswordReset(email: string, resetToken: string, language: "en" | "am" = "en"): Promise<boolean> {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

    const templates = {
      en: {
        subject: "Password Reset Request - Cultural Restaurant",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f97316;">Password Reset Request</h2>
            <p>You have requested to reset your password for Cultural Restaurant POS system.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">Reset Password</a>
            <p>This link will expire in 15 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">© 2024 Cultural Restaurant. All rights reserved.</p>
          </div>
        `,
        text: `Password Reset Request\n\nYou have requested to reset your password.\n\nReset your password: ${resetUrl}\n\nThis link expires in 15 minutes.\n\nIf you didn't request this, please ignore this email.`,
      },
      am: {
        subject: "የይለፍ ቃል ዳግም ማስተካከያ ጥያቄ - የባህል ምግብ ቤት",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f97316;">የይለፍ ቃል ዳግም ማስተካከያ ጥያቄ</h2>
            <p>ለባህል ምግብ ቤት POS ስርዓት የይለፍ ቃልዎን ዳግም ለማስተካከል ጠይቀዋል።</p>
            <p>የይለፍ ቃልዎን ዳግም ለማስተካከል ከታች ያለውን ቁልፍ ይጫኑ:</p>
            <a href="${resetUrl}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">የይለፍ ቃል ዳግም አስተካክል</a>
            <p>ይህ አገናኝ በ15 ደቂቃ ውስጥ ይጠፋል።</p>
            <p>ይህን ካልጠየቁ፣ እባክዎ ይህን ኢሜይል ይተዉት።</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">© 2024 የባህል ምግብ ቤት። ሁሉም መብቶች የተጠበቁ ናቸው።</p>
          </div>
        `,
        text: `የይለፍ ቃል ዳግም ማስተካከያ ጥያቄ\n\nየይለፍ ቃልዎን ዳግም ለማስተካከል ጠይቀዋል።\n\nየይለፍ ቃል ዳግም አስተካክል: ${resetUrl}\n\nይህ አገናኝ በ15 ደቂቃ ውስጥ ይጠፋል።\n\nይህን ካልጠየቁ፣ እባክዎ ይህን ኢሜይል ይተዉት።`,
      },
    }

    const template = templates[language]

    return await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }

  async sendOrderConfirmation(email: string, orderData: any, language: "en" | "am" = "en"): Promise<boolean> {
    const templates = {
      en: {
        subject: `Order Confirmation #${orderData.id} - Cultural Restaurant`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f97316;">Order Confirmation</h2>
            <p>Thank you for your order!</p>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Order #${orderData.id}</h3>
              <p><strong>Total:</strong> ${orderData.total} ETB</p>
              <p><strong>Status:</strong> ${orderData.status}</p>
            </div>
            <p>We'll notify you when your order is ready.</p>
          </div>
        `,
      },
      am: {
        subject: `የትዕዛዝ ማረጋገጫ #${orderData.id} - የባህል ምግብ ቤት`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f97316;">የትዕዛዝ ማረጋገጫ</h2>
            <p>ለትዕዛዝዎ እናመሰግናለን!</p>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>ትዕዛዝ #${orderData.id}</h3>
              <p><strong>ጠቅላላ:</strong> ${orderData.total} ብር</p>
              <p><strong>ሁኔታ:</strong> ${orderData.status}</p>
            </div>
            <p>ትዕዛዝዎ ሲዘጋጅ እናሳውቅዎታለን።</p>
          </div>
        `,
      },
    }

    const template = templates[language]

    return await this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    })
  }
}

// Create email service instance
const emailConfig: EmailConfig = {
  provider: "smtp",
  host: process.env.SMTP_HOST || "localhost",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  username: process.env.SMTP_USERNAME,
  password: process.env.SMTP_PASSWORD,
  from: process.env.SMTP_FROM || "noreply@restaurant.com",
}

export const emailService = new EmailService(emailConfig)
export { EmailService, type EmailConfig, type EmailData }
