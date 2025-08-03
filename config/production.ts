export const productionConfig = {
  // Database Configuration
  database: {
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "5432"),
    name: process.env.DB_NAME || "restaurant_pos",
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "",
    ssl: process.env.NODE_ENV === "production",
  },

  // Email Configuration
  email: {
    provider: process.env.EMAIL_PROVIDER || "smtp",
    host: process.env.SMTP_HOST || "localhost",
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    username: process.env.SMTP_USERNAME || "",
    password: process.env.SMTP_PASSWORD || "",
    from: process.env.SMTP_FROM || "noreply@restaurant.com",
    secure: process.env.SMTP_SECURE === "true",
  },

  // SMS Configuration
  sms: {
    provider: process.env.SMS_PROVIDER || "local",
    apiKey: process.env.SMS_API_KEY || "",
    apiSecret: process.env.SMS_API_SECRET || "",
    from: process.env.SMS_FROM || "Restaurant",
  },

  // Payment Configuration
  payments: {
    chapa: {
      publicKey: process.env.CHAPA_PUBLIC_KEY || "",
      secretKey: process.env.CHAPA_SECRET_KEY || "",
      webhookSecret: process.env.CHAPA_WEBHOOK_SECRET || "",
    },
    telebirr: {
      publicKey: process.env.TELEBIRR_PUBLIC_KEY || "",
      secretKey: process.env.TELEBIRR_SECRET_KEY || "",
      merchantId: process.env.TELEBIRR_MERCHANT_ID || "",
    },
  },

  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET || "your-super-secret-jwt-key",
    bcryptRounds: Number.parseInt(process.env.BCRYPT_ROUNDS || "12"),
    sessionTimeout: Number.parseInt(process.env.SESSION_TIMEOUT || "3600"), // 1 hour
    maxLoginAttempts: Number.parseInt(process.env.MAX_LOGIN_ATTEMPTS || "5"),
    lockoutDuration: Number.parseInt(process.env.LOCKOUT_DURATION || "900"), // 15 minutes
  },

  // Application Configuration
  app: {
    name: "Cultural Restaurant POS",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    port: Number.parseInt(process.env.PORT || "3000"),
    baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    defaultLanguage: process.env.DEFAULT_LANGUAGE || "am",
    supportedLanguages: ["en", "am"],
    timezone: process.env.TZ || "Africa/Addis_Ababa",
  },

  // Feature Flags
  features: {
    enableSMS: process.env.ENABLE_SMS === "true",
    enableEmail: process.env.ENABLE_EMAIL === "true",
    enablePayments: process.env.ENABLE_PAYMENTS === "true",
    enableReports: process.env.ENABLE_REPORTS === "true",
    enableInventoryTracking: process.env.ENABLE_INVENTORY === "true",
    enableMultiLanguage: process.env.ENABLE_MULTILANG === "true",
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || "info",
    enableFileLogging: process.env.ENABLE_FILE_LOGGING === "true",
    logDirectory: process.env.LOG_DIRECTORY || "./logs",
  },
}

export default productionConfig
