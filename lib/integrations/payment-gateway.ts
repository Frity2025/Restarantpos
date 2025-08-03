interface PaymentConfig {
  provider: "stripe" | "paypal" | "chapa" | "telebirr"
  publicKey: string
  secretKey: string
  webhookSecret?: string
}

interface PaymentData {
  amount: number
  currency: string
  description: string
  customerEmail?: string
  customerPhone?: string
  orderId: string
}

interface PaymentResult {
  success: boolean
  transactionId?: string
  paymentUrl?: string
  error?: string
}

class PaymentGateway {
  private config: PaymentConfig

  constructor(config: PaymentConfig) {
    this.config = config
  }

  async createPayment(data: PaymentData): Promise<PaymentResult> {
    try {
      switch (this.config.provider) {
        case "stripe":
          return await this.createStripePayment(data)
        case "chapa":
          return await this.createChapaPayment(data)
        case "telebirr":
          return await this.createTelebirrPayment(data)
        default:
          return await this.createChapaPayment(data)
      }
    } catch (error) {
      console.error("Payment creation failed:", error)
      return {
        success: false,
        error: "Payment processing failed",
      }
    }
  }

  private async createStripePayment(data: PaymentData): Promise<PaymentResult> {
    console.log("Creating Stripe payment:", data)

    // Simulate Stripe API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return {
      success: true,
      transactionId: `stripe_${Date.now()}`,
      paymentUrl: `https://checkout.stripe.com/pay/${Date.now()}`,
    }
  }

  private async createChapaPayment(data: PaymentData): Promise<PaymentResult> {
    console.log("Creating Chapa payment:", data)

    const chapaData = {
      amount: data.amount,
      currency: data.currency,
      email: data.customerEmail,
      first_name: "Customer",
      last_name: "Name",
      phone_number: data.customerPhone,
      tx_ref: `chapa_${data.orderId}_${Date.now()}`,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/chapa/callback`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      description: data.description,
      customization: {
        title: "Cultural Restaurant",
        description: data.description,
      },
    }

    // Simulate Chapa API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      transactionId: chapaData.tx_ref,
      paymentUrl: `https://checkout.chapa.co/checkout/payment/${chapaData.tx_ref}`,
    }
  }

  private async createTelebirrPayment(data: PaymentData): Promise<PaymentResult> {
    console.log("Creating Telebirr payment:", data)

    const telebirrData = {
      amount: data.amount,
      currency: data.currency,
      orderId: data.orderId,
      description: data.description,
      customerPhone: data.customerPhone,
      merchantId: "CULTURAL_RESTAURANT",
      timestamp: Date.now(),
    }

    // Simulate Telebirr API call
    await new Promise((resolve) => setTimeout(resolve, 1200))

    return {
      success: true,
      transactionId: `telebirr_${data.orderId}_${Date.now()}`,
      paymentUrl: `telebirr://pay?amount=${data.amount}&merchant=CULTURAL_RESTAURANT&ref=${data.orderId}`,
    }
  }

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    console.log("Verifying payment:", transactionId)

    // Simulate payment verification
    await new Promise((resolve) => setTimeout(resolve, 800))

    return {
      success: true,
      transactionId,
    }
  }

  async refundPayment(transactionId: string, amount?: number): Promise<PaymentResult> {
    console.log("Processing refund:", { transactionId, amount })

    // Simulate refund processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return {
      success: true,
      transactionId: `refund_${transactionId}_${Date.now()}`,
    }
  }
}

// Create payment gateway instances
const chapaConfig: PaymentConfig = {
  provider: "chapa",
  publicKey: process.env.CHAPA_PUBLIC_KEY || "",
  secretKey: process.env.CHAPA_SECRET_KEY || "",
  webhookSecret: process.env.CHAPA_WEBHOOK_SECRET,
}

const telebirrConfig: PaymentConfig = {
  provider: "telebirr",
  publicKey: process.env.TELEBIRR_PUBLIC_KEY || "",
  secretKey: process.env.TELEBIRR_SECRET_KEY || "",
}

export const chapaGateway = new PaymentGateway(chapaConfig)
export const telebirrGateway = new PaymentGateway(telebirrConfig)
export { PaymentGateway, type PaymentConfig, type PaymentData, type PaymentResult }
