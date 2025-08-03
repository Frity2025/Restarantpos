export interface EmailConfig {
  provider: "smtp" | "sendgrid" | "mailgun" | "ses"
  apiKey?: string
  host?: string
  port?: number
  username?: string
  password?: string
  from: string
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[]
}

export class EmailService {
  private config: EmailConfig

  constructor(config: EmailConfig) {
    this.config = config
  }

  async sendEmail(to: string, templateId: string, variables: Record<string, string>) {
    // Mock implementation - in production, integrate with actual email service
    console.log(`Sending email to ${to} using template ${templateId}`)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      messageId: `msg_${Date.now()}`,
      timestamp: new Date().toISOString(),
    }
  }

  async sendPasswordReset(email: string, resetToken: string, language = "am") {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

    const templates = {
      am: {
        subject: "የይለፍ ቃል ዳግም ማስተካከያ",
        html: `
          <h2>የይለፍ ቃል ዳግም ማስተካከያ</h2>
          <p>የይለፍ ቃልዎን ለመቀየር የሚከተለውን አገናኝ ይጫኑ:</p>
          <a href="${resetLink}" style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            የይለፍ ቃል ቀይር
          </a>
          <p>ይህ አገናኝ በ15 ደቂቃ ውስጥ ይጠፋል።</p>
        `,
        text: `የይለፍ ቃልዎን ለመቀየር ይህንን አገናኝ ይጠቀሙ: ${resetLink}`,
      },
      en: {
        subject: "Password Reset Request",
        html: `
          <h2>Password Reset Request</h2>
          <p>Click the following link to reset your password:</p>
          <a href="${resetLink}" style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Reset Password
          </a>
          <p>This link will expire in 15 minutes.</p>
        `,
        text: `Use this link to reset your password: ${resetLink}`,
      },
    }

    const template = templates[language as keyof typeof templates] || templates.am

    return this.sendEmail(email, "password-reset", {
      resetLink,
      subject: template.subject,
      htmlContent: template.html,
      textContent: template.text,
    })
  }

  async sendOrderConfirmation(email: string, orderData: any, language = "am") {
    const templates = {
      am: {
        subject: `ትዕዛዝ ተረጋግጧል - #${orderData.id}`,
        html: `
          <h2>ትዕዛዝዎ ተረጋግጧል</h2>
          <p>ውድ ${orderData.customerName},</p>
          <p>ትዕዛዝዎ ተቀብለናል እና እየተዘጋጀ ነው።</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <h3>የትዕዛዝ ዝርዝር:</h3>
            <p><strong>ትዕዛዝ ቁጥር:</strong> #${orderData.id}</p>
            <p><strong>ጠቅላላ ዋጋ:</strong> ${orderData.total} ብር</p>
            <p><strong>የመውጫ ጊዜ:</strong> ${orderData.estimatedTime}</p>
          </div>
        `,
      },
      en: {
        subject: `Order Confirmed - #${orderData.id}`,
        html: `
          <h2>Your Order is Confirmed</h2>
          <p>Dear ${orderData.customerName},</p>
          <p>We have received your order and it's being prepared.</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <h3>Order Details:</h3>
            <p><strong>Order Number:</strong> #${orderData.id}</p>
            <p><strong>Total Amount:</strong> ${orderData.total} ETB</p>
            <p><strong>Estimated Time:</strong> ${orderData.estimatedTime}</p>
          </div>
        `,
      },
    }

    const template = templates[language as keyof typeof templates] || templates.am
    return this.sendEmail(email, "order-confirmation", template)
  }
}

export const emailService = new EmailService({
  provider: "smtp",
  host: process.env.SMTP_HOST || "localhost",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  username: process.env.SMTP_USERNAME,
  password: process.env.SMTP_PASSWORD,
  from: process.env.SMTP_FROM || "noreply@restaurant.com",
})
