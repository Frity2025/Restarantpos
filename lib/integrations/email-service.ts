interface EmailConfig {
  provider: "smtp" | "sendgrid" | "ses"
  smtp?: {
    host: string
    port: number
    secure: boolean
    auth: {
      user: string
      pass: string
    }
  }
  sendgrid?: {
    apiKey: string
  }
  ses?: {
    region: string
    accessKeyId: string
    secretAccessKey: string
  }
}

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

interface EmailData {
  to: string
  from: string
  subject: string
  html: string
  text: string
}

class EmailService {
  private config: EmailConfig

  constructor() {
    this.config = {
      provider: (process.env.EMAIL_PROVIDER as "smtp" | "sendgrid" | "ses") || "smtp",
      smtp: {
        host: process.env.SMTP_HOST || "localhost",
        port: Number.parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER || "",
          pass: process.env.SMTP_PASS || "",
        },
      },
      sendgrid: {
        apiKey: process.env.SENDGRID_API_KEY || "",
      },
      ses: {
        region: process.env.AWS_REGION || "us-east-1",
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    }
  }

  async sendEmail(data: EmailData): Promise<boolean> {
    try {
      switch (this.config.provider) {
        case "smtp":
          return await this.sendViaSMTP(data)
        case "sendgrid":
          return await this.sendViaSendGrid(data)
        case "ses":
          return await this.sendViaSES(data)
        default:
          throw new Error("Invalid email provider")
      }
    } catch (error) {
      console.error("Email sending failed:", error)
      return false
    }
  }

  private async sendViaSMTP(data: EmailData): Promise<boolean> {
    // Mock SMTP implementation
    console.log("Sending email via SMTP:", data)
    return true
  }

  private async sendViaSendGrid(data: EmailData): Promise<boolean> {
    // Mock SendGrid implementation
    console.log("Sending email via SendGrid:", data)
    return true
  }

  private async sendViaSES(data: EmailData): Promise<boolean> {
    // Mock SES implementation
    console.log("Sending email via SES:", data)
    return true
  }

  async sendPasswordReset(email: string, resetToken: string, language: "en" | "am" = "am"): Promise<boolean> {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

    const templates = {
      en: {
        subject: "Password Reset Request",
        html: `
          <h2>Password Reset Request</h2>
          <p>You have requested to reset your password. Click the link below to reset it:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        `,
        text: `Password Reset Request\n\nYou have requested to reset your password. Visit this link to reset it: ${resetUrl}\n\nIf you didn't request this, please ignore this email.\n\nThis link will expire in 1 hour.`,
      },
      am: {
        subject: "የይለፍ ቃል ዳግም ማስተካከያ ጥያቄ",
        html: `
          <h2>የይለፍ ቃል ዳግም ማስተካከያ ጥያቄ</h2>
          <p>የይለፍ ቃልዎን ዳግም ለማስተካከል ጠይቀዋል። ለማስተካከል ከታች ያለውን አገናኝ ይጫኑ:</p>
          <a href="${resetUrl}">የይለፍ ቃል ዳግም አስተካክል</a>
          <p>ይህን ካልጠየቁ፣ እባክዎ ይህን ኢሜይል ይተዉት።</p>
          <p>ይህ አገናኝ በ1 ሰዓት ውስጥ ይጠፋል።</p>
        `,
        text: `የይለፍ ቃል ዳግም ማስተካከያ ጥያቄ\n\nየይለፍ ቃልዎን ዳግም ለማስተካከል ጠይቀዋል። ለማስተካከል ይህን አገናኝ ይጎብኙ: ${resetUrl}\n\nይህን ካልጠየቁ፣ እባክዎ ይህን ኢሜይል ይተዉት።\n\nይህ አገናኝ በ1 ሰዓት ውስጥ ይጠፋል።`,
      },
    }

    const template = templates[language]

    return await this.sendEmail({
      to: email,
      from: process.env.FROM_EMAIL || "noreply@restaurant.com",
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }

  async sendOrderConfirmation(email: string, orderData: any, language: "en" | "am" = "am"): Promise<boolean> {
    const templates = {
      en: {
        subject: `Order Confirmation #${orderData.orderNumber}`,
        html: `
          <h2>Order Confirmation</h2>
          <p>Thank you for your order!</p>
          <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
          <p><strong>Total:</strong> ${orderData.total} ETB</p>
          <p><strong>Status:</strong> ${orderData.status}</p>
          <p>We'll notify you when your order is ready.</p>
        `,
        text: `Order Confirmation\n\nThank you for your order!\n\nOrder Number: ${orderData.orderNumber}\nTotal: ${orderData.total} ETB\nStatus: ${orderData.status}\n\nWe'll notify you when your order is ready.`,
      },
      am: {
        subject: `የትዕዛዝ ማረጋገጫ #${orderData.orderNumber}`,
        html: `
          <h2>የትዕዛዝ ማረጋገጫ</h2>
          <p>ለትዕዛዝዎ እናመሰግናለን!</p>
          <p><strong>የትዕዛዝ ቁጥር:</strong> ${orderData.orderNumber}</p>
          <p><strong>ጠቅላላ:</strong> ${orderData.total} ብር</p>
          <p><strong>ሁኔታ:</strong> ${orderData.status}</p>
          <p>ትዕዛዝዎ ሲዘጋጅ እናሳውቅዎታለን።</p>
        `,
        text: `የትዕዛዝ ማረጋገጫ\n\nለትዕዛዝዎ እናመሰግናለን!\n\nየትዕዛዝ ቁጥር: ${orderData.orderNumber}\nጠቅላላ: ${orderData.total} ብር\nሁኔታ: ${orderData.status}\n\nትዕዛዝዎ ሲዘጋጅ እናሳውቅዎታለን።`,
      },
    }

    const template = templates[language]

    return await this.sendEmail({
      to: email,
      from: process.env.FROM_EMAIL || "noreply@restaurant.com",
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
  }
}

export const emailService = new EmailService()
