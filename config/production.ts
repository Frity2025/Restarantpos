export const productionConfig = {
  // Database
  database: {
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "5432"),
    name: process.env.DB_NAME || "restaurant_pos",
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "",
    ssl: process.env.NODE_ENV === "production",
  },

  // Authentication
  auth: {
    jwtSecret: process.env.JWT_SECRET || "your-super-secret-jwt-key",
    bcryptRounds: Number.parseInt(process.env.BCRYPT_ROUNDS || "12"),
    sessionTimeout: Number.parseInt(process.env.SESSION_TIMEOUT || "28800"), // 8 hours
    maxLoginAttempts: Number.parseInt(process.env.MAX_LOGIN_ATTEMPTS || "5"),
    lockoutDuration: Number.parseInt(process.env.LOCKOUT_DURATION || "900"), // 15 minutes
  },

  // Server
  server: {
    port: Number.parseInt(process.env.PORT || "3000"),
    host: process.env.HOST || "0.0.0.0",
  },

  // Application
  app: {
    defaultLanguage: (process.env.DEFAULT_LANGUAGE as "en" | "am") || "am",
    timezone: process.env.TZ || "Africa/Addis_Ababa",
  },

  // Feature Flags
  features: {
    enableSMS: process.env.ENABLE_SMS === "true",
    enableEmail: process.env.ENABLE_EMAIL === "true",
    enablePayments: process.env.ENABLE_PAYMENTS === "true",
    enableReports: process.env.ENABLE_REPORTS === "true",
    enableInventory: process.env.ENABLE_INVENTORY === "true",
    enableMultiLanguage: process.env.ENABLE_MULTILANG === "true",
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || "info",
    enableFileLogging: process.env.ENABLE_FILE_LOGGING === "true",
    logDirectory: process.env.LOG_DIRECTORY || "./logs",
  },

  // Payment Gateways
  payments: {
    chapa: {
      publicKey: process.env.CHAPA_PUBLIC_KEY || "",
      secretKey: process.env.CHAPA_SECRET_KEY || "",
      webhookSecret: process.env.CHAPA_WEBHOOK_SECRET || "",
    },
    telebirr: {
      merchantId: process.env.TELEBIRR_MERCHANT_ID || "",
      publicKey: process.env.TELEBIRR_PUBLIC_KEY || "",
      secretKey: process.env.TELEBIRR_SECRET_KEY || "",
    },
  },

  // Email Configuration
  email: {
    provider: process.env.EMAIL_PROVIDER || "smtp",
    smtp: {
      host: process.env.SMTP_HOST || "",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
    from: process.env.FROM_EMAIL || "noreply@restaurant.com",
  },

  // SMS Configuration
  sms: {
    provider: process.env.SMS_PROVIDER || "ethio_telecom",
    ethioTelecom: {
      username: process.env.ETHIO_TELECOM_USERNAME || "",
      password: process.env.ETHIO_TELECOM_PASSWORD || "",
      senderId: process.env.ETHIO_TELECOM_SENDER_ID || "Restaurant",
    },
  },
}
