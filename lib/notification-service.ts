export interface NotificationConfig {
  email: {
    enabled: boolean
    smtpHost: string
    smtpPort: number
    username: string
    password: string
    fromEmail: string
    fromName: string
  }
  sms: {
    enabled: boolean
    provider: "twilio" | "aws" | "local"
    apiKey: string
    apiSecret: string
    fromNumber: string
  }
  push: {
    enabled: boolean
    vapidPublicKey: string
    vapidPrivateKey: string
  }
}

export interface NotificationTemplate {
  id: string
  name: string
  nameAmharic: string
  type: "email" | "sms" | "push"
  subject?: string
  subjectAmharic?: string
  template: string
  templateAmharic: string
  variables: string[]
  isActive: boolean
}

export interface NotificationLog {
  id: string
  type: "email" | "sms" | "push"
  recipient: string
  subject?: string
  message: string
  status: "pending" | "sent" | "failed" | "delivered"
  sentAt?: Date
  deliveredAt?: Date
  error?: string
  templateId?: string
  metadata?: Record<string, any>
}

class NotificationService {
  private config: NotificationConfig = {
    email: {
      enabled: true,
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      username: "restaurant@example.com",
      password: "app-password",
      fromEmail: "restaurant@example.com",
      fromName: "የባህል ምግብ ቤት",
    },
    sms: {
      enabled: true,
      provider: "local",
      apiKey: "your-api-key",
      apiSecret: "your-api-secret",
      fromNumber: "+251911123456",
    },
    push: {
      enabled: true,
      vapidPublicKey: "your-vapid-public-key",
      vapidPrivateKey: "your-vapid-private-key",
    },
  }

  private templates: NotificationTemplate[] = [
    {
      id: "order-confirmation",
      name: "Order Confirmation",
      nameAmharic: "የትዕዛዝ ማረጋገጫ",
      type: "sms",
      template:
        "Your order #{orderNumber} has been confirmed. Total: {total} ETB. Estimated time: {estimatedTime} minutes.",
      templateAmharic: "የእርስዎ ትዕዛዝ #{orderNumber} ተረጋግጧል። ጠቅላላ: {total} ብር። ግምታዊ ጊዜ: {estimatedTime} ደቂቃ።",
      variables: ["orderNumber", "total", "estimatedTime"],
      isActive: true,
    },
    {
      id: "order-ready",
      name: "Order Ready",
      nameAmharic: "ትዕዛዝ ዝግጁ ነው",
      type: "sms",
      template: "Your order #{orderNumber} is ready for pickup/delivery!",
      templateAmharic: "የእርስዎ ትዕዛዝ #{orderNumber} ለመውሰድ/ለማድረስ ዝግጁ ነው!",
      variables: ["orderNumber"],
      isActive: true,
    },
    {
      id: "reservation-confirmation",
      name: "Reservation Confirmation",
      nameAmharic: "የቦታ ማስያዝ ማረጋገጫ",
      type: "email",
      subject: "Reservation Confirmed",
      subjectAmharic: "ቦታ ማስያዝ ተረጋግጧል",
      template: "Dear {customerName}, your reservation for {partySize} people on {date} at {time} has been confirmed.",
      templateAmharic: "ውድ {customerName}፣ ለ{partySize} ሰዎች በ{date} {time} ላይ የተደረገው ቦታ ማስያዝ ተረጋግጧል።",
      variables: ["customerName", "partySize", "date", "time"],
      isActive: true,
    },
    {
      id: "low-stock-alert",
      name: "Low Stock Alert",
      nameAmharic: "የዝቅተኛ ክምችት ማሳሰቢያ",
      type: "email",
      subject: "Low Stock Alert",
      subjectAmharic: "የዝቅተኛ ክምችት ማሳሰቢያ",
      template: "Alert: {itemName} is running low. Current stock: {currentStock}, Minimum level: {minLevel}",
      templateAmharic: "ማሳሰቢያ: {itemName} እየተጠናቀቀ ነው። ወቅታዊ ክምችት: {currentStock}፣ ዝቅተኛ ደረጃ: {minLevel}",
      variables: ["itemName", "currentStock", "minLevel"],
      isActive: true,
    },
    {
      id: "employee-shift-reminder",
      name: "Shift Reminder",
      nameAmharic: "የሽፍት ማሳሰቢያ",
      type: "sms",
      template: "Reminder: Your shift starts at {shiftTime} today. Please arrive 15 minutes early.",
      templateAmharic: "ማሳሰቢያ: የእርስዎ ሽፍት ዛሬ {shiftTime} ላይ ይጀምራል። እባክዎ 15 ደቂቃ ቀደም ብለው ይምጡ።",
      variables: ["shiftTime"],
      isActive: true,
    },
  ]

  private notificationLogs: NotificationLog[] = []

  // Configuration Management
  getConfig(): NotificationConfig {
    return { ...this.config }
  }

  updateConfig(updates: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...updates }
  }

  // Template Management
  getTemplates(): NotificationTemplate[] {
    return this.templates.filter((t) => t.isActive)
  }

  getTemplate(id: string): NotificationTemplate | undefined {
    return this.templates.find((t) => t.id === id && t.isActive)
  }

  createTemplate(template: Omit<NotificationTemplate, "id">): NotificationTemplate {
    const newTemplate: NotificationTemplate = {
      ...template,
      id: `template-${Date.now()}`,
    }
    this.templates.push(newTemplate)
    return newTemplate
  }

  updateTemplate(id: string, updates: Partial<NotificationTemplate>): NotificationTemplate | null {
    const index = this.templates.findIndex((t) => t.id === id)
    if (index === -1) return null

    this.templates[index] = { ...this.templates[index], ...updates }
    return this.templates[index]
  }

  // Notification Sending
  async sendNotification(
    type: "email" | "sms" | "push",
    recipient: string,
    templateId: string,
    variables: Record<string, any>,
    options?: {
      subject?: string
      priority?: "low" | "normal" | "high"
      scheduledFor?: Date
    },
  ): Promise<NotificationLog> {
    const template = this.getTemplate(templateId)
    if (!template) {
      throw new Error(`Template ${templateId} not found`)
    }

    const message = this.renderTemplate(template.templateAmharic, variables)
    const subject = template.subjectAmharic ? this.renderTemplate(template.subjectAmharic, variables) : options?.subject

    const log: NotificationLog = {
      id: `notification-${Date.now()}`,
      type,
      recipient,
      subject,
      message,
      status: "pending",
      templateId,
      metadata: { variables, options },
    }

    this.notificationLogs.push(log)

    try {
      switch (type) {
        case "email":
          await this.sendEmail(recipient, subject || "", message, log)
          break
        case "sms":
          await this.sendSMS(recipient, message, log)
          break
        case "push":
          await this.sendPushNotification(recipient, subject || "", message, log)
          break
      }
    } catch (error) {
      log.status = "failed"
      log.error = error instanceof Error ? error.message : "Unknown error"
    }

    return log
  }

  private renderTemplate(template: string, variables: Record<string, any>): string {
    let rendered = template
    for (const [key, value] of Object.entries(variables)) {
      rendered = rendered.replace(new RegExp(`{${key}}`, "g"), String(value))
    }
    return rendered
  }

  private async sendEmail(recipient: string, subject: string, message: string, log: NotificationLog): Promise<void> {
    if (!this.config.email.enabled) {
      throw new Error("Email notifications are disabled")
    }

    // Mock email sending - in production, use nodemailer or similar
    console.log("Sending email:", { recipient, subject, message })

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock success/failure
    if (Math.random() > 0.1) {
      // 90% success rate
      log.status = "sent"
      log.sentAt = new Date()

      // Simulate delivery confirmation after some time
      setTimeout(
        () => {
          log.status = "delivered"
          log.deliveredAt = new Date()
        },
        Math.random() * 5000 + 2000,
      )
    } else {
      throw new Error("Failed to send email")
    }
  }

  private async sendSMS(recipient: string, message: string, log: NotificationLog): Promise<void> {
    if (!this.config.sms.enabled) {
      throw new Error("SMS notifications are disabled")
    }

    // Mock SMS sending
    console.log("Sending SMS:", { recipient, message })

    await new Promise((resolve) => setTimeout(resolve, 500))

    if (Math.random() > 0.05) {
      // 95% success rate
      log.status = "sent"
      log.sentAt = new Date()

      setTimeout(
        () => {
          log.status = "delivered"
          log.deliveredAt = new Date()
        },
        Math.random() * 3000 + 1000,
      )
    } else {
      throw new Error("Failed to send SMS")
    }
  }

  private async sendPushNotification(
    recipient: string,
    title: string,
    message: string,
    log: NotificationLog,
  ): Promise<void> {
    if (!this.config.push.enabled) {
      throw new Error("Push notifications are disabled")
    }

    // Mock push notification
    console.log("Sending push notification:", { recipient, title, message })

    await new Promise((resolve) => setTimeout(resolve, 200))

    if (Math.random() > 0.02) {
      // 98% success rate
      log.status = "sent"
      log.sentAt = new Date()

      setTimeout(
        () => {
          log.status = "delivered"
          log.deliveredAt = new Date()
        },
        Math.random() * 1000 + 500,
      )
    } else {
      throw new Error("Failed to send push notification")
    }
  }

  // Bulk Notifications
  async sendBulkNotification(
    type: "email" | "sms" | "push",
    recipients: string[],
    templateId: string,
    variables: Record<string, any>,
    options?: {
      subject?: string
      batchSize?: number
      delayBetweenBatches?: number
    },
  ): Promise<NotificationLog[]> {
    const batchSize = options?.batchSize || 10
    const delay = options?.delayBetweenBatches || 1000
    const logs: NotificationLog[] = []

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize)

      const batchPromises = batch.map((recipient) =>
        this.sendNotification(type, recipient, templateId, variables, options),
      )

      const batchLogs = await Promise.allSettled(batchPromises)
      logs.push(
        ...batchLogs.map((result) =>
          result.status === "fulfilled"
            ? result.value
            : {
                id: `failed-${Date.now()}`,
                type,
                recipient: "unknown",
                message: "",
                status: "failed" as const,
                error: result.reason,
              },
        ),
      )

      if (i + batchSize < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    return logs
  }

  // Automated Notifications
  async sendOrderConfirmation(orderData: {
    orderNumber: string
    customerPhone: string
    customerEmail?: string
    total: number
    estimatedTime: number
  }): Promise<void> {
    const variables = {
      orderNumber: orderData.orderNumber,
      total: orderData.total.toFixed(2),
      estimatedTime: orderData.estimatedTime.toString(),
    }

    // Send SMS confirmation
    await this.sendNotification("sms", orderData.customerPhone, "order-confirmation", variables)

    // Send email if available
    if (orderData.customerEmail) {
      await this.sendNotification("email", orderData.customerEmail, "order-confirmation", variables)
    }
  }

  async sendOrderReady(orderData: {
    orderNumber: string
    customerPhone: string
    customerEmail?: string
  }): Promise<void> {
    const variables = {
      orderNumber: orderData.orderNumber,
    }

    await this.sendNotification("sms", orderData.customerPhone, "order-ready", variables)

    if (orderData.customerEmail) {
      await this.sendNotification("email", orderData.customerEmail, "order-ready", variables)
    }
  }

  async sendReservationConfirmation(reservationData: {
    customerName: string
    customerEmail: string
    customerPhone: string
    partySize: number
    date: string
    time: string
  }): Promise<void> {
    const variables = {
      customerName: reservationData.customerName,
      partySize: reservationData.partySize.toString(),
      date: reservationData.date,
      time: reservationData.time,
    }

    await this.sendNotification("email", reservationData.customerEmail, "reservation-confirmation", variables)
    await this.sendNotification("sms", reservationData.customerPhone, "reservation-confirmation", variables)
  }

  async sendLowStockAlert(itemData: {
    itemName: string
    itemNameAmharic: string
    currentStock: number
    minLevel: number
    managerEmails: string[]
  }): Promise<void> {
    const variables = {
      itemName: itemData.itemNameAmharic,
      currentStock: itemData.currentStock.toString(),
      minLevel: itemData.minLevel.toString(),
    }

    await this.sendBulkNotification("email", itemData.managerEmails, "low-stock-alert", variables)
  }

  async sendShiftReminder(employeeData: {
    employeeName: string
    employeePhone: string
    shiftTime: string
  }): Promise<void> {
    const variables = {
      shiftTime: employeeData.shiftTime,
    }

    await this.sendNotification("sms", employeeData.employeePhone, "employee-shift-reminder", variables)
  }

  // Logs and Analytics
  getNotificationLogs(filters?: {
    type?: "email" | "sms" | "push"
    status?: "pending" | "sent" | "failed" | "delivered"
    startDate?: Date
    endDate?: Date
  }): NotificationLog[] {
    let logs = [...this.notificationLogs]

    if (filters) {
      if (filters.type) {
        logs = logs.filter((log) => log.type === filters.type)
      }
      if (filters.status) {
        logs = logs.filter((log) => log.status === filters.status)
      }
      if (filters.startDate) {
        logs = logs.filter((log) => log.sentAt && log.sentAt >= filters.startDate!)
      }
      if (filters.endDate) {
        logs = logs.filter((log) => log.sentAt && log.sentAt <= filters.endDate!)
      }
    }

    return logs.sort((a, b) => (b.sentAt?.getTime() || 0) - (a.sentAt?.getTime() || 0))
  }

  getNotificationStats() {
    const logs = this.notificationLogs
    const total = logs.length
    const sent = logs.filter((log) => log.status === "sent" || log.status === "delivered").length
    const failed = logs.filter((log) => log.status === "failed").length
    const delivered = logs.filter((log) => log.status === "delivered").length

    return {
      total,
      sent,
      failed,
      delivered,
      successRate: total > 0 ? (sent / total) * 100 : 0,
      deliveryRate: sent > 0 ? (delivered / sent) * 100 : 0,
      byType: {
        email: logs.filter((log) => log.type === "email").length,
        sms: logs.filter((log) => log.type === "sms").length,
        push: logs.filter((log) => log.type === "push").length,
      },
    }
  }
}

export const notificationService = new NotificationService()
