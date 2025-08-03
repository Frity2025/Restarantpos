interface PaymentConfig {
  chapa: {
    publicKey: string
    secretKey: string
    webhookSecret: string
  }
  telebirr: {
    merchantId: string
    publicKey: string
    secretKey: string
  }
}

interface PaymentRequest {
  amount: number
  currency: string
  orderId: string
  customerEmail?: string
  customerPhone?: string
  description: string
  returnUrl: string
  cancelUrl: string
}

interface PaymentResponse {
  success: boolean
  paymentId?: string
  checkoutUrl?: string
  error?: string
}

class PaymentGateway {
  private config: PaymentConfig

  constructor() {
    this.config = {
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
    }
  }

  async initiateChapaPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Mock Chapa payment initialization
      const paymentData = {
        amount: request.amount,
        currency: request.currency,
        email: request.customerEmail,
        phone_number: request.customerPhone,
        tx_ref: `${request.orderId}-${Date.now()}`,
        callback_url: request.returnUrl,
        return_url: request.returnUrl,
        description: request.description,
        customization: {
          title: "Restaurant Payment",
          description: request.description,
        },
      }

      console.log("Initiating Chapa payment:", paymentData)

      // Mock response
      return {
        success: true,
        paymentId: `chapa_${Date.now()}`,
        checkoutUrl: `https://checkout.chapa.co/checkout/payment/${paymentData.tx_ref}`,
      }
    } catch (error) {
      console.error("Chapa payment failed:", error)
      return {
        success: false,
        error: "Payment initialization failed",
      }
    }
  }

  async initiateTelebirrPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Mock Telebirr payment initialization
      const paymentData = {
        merchantId: this.config.telebirr.merchantId,
        amount: request.amount,
        currency: request.currency,
        orderId: request.orderId,
        description: request.description,
        returnUrl: request.returnUrl,
        cancelUrl: request.cancelUrl,
      }

      console.log("Initiating Telebirr payment:", paymentData)

      // Mock response
      return {
        success: true,
        paymentId: `telebirr_${Date.now()}`,
        checkoutUrl: `https://telebirr.com/checkout/${request.orderId}`,
      }
    } catch (error) {
      console.error("Telebirr payment failed:", error)
      return {
        success: false,
        error: "Payment initialization failed",
      }
    }
  }

  async verifyPayment(
    paymentId: string,
    provider: "chapa" | "telebirr",
  ): Promise<{ success: boolean; status: string }> {
    try {
      switch (provider) {
        case "chapa":
          return await this.verifyChapaPayment(paymentId)
        case "telebirr":
          return await this.verifyTelebirrPayment(paymentId)
        default:
          throw new Error("Invalid payment provider")
      }
    } catch (error) {
      console.error("Payment verification failed:", error)
      return { success: false, status: "failed" }
    }
  }

  private async verifyChapaPayment(paymentId: string): Promise<{ success: boolean; status: string }> {
    // Mock Chapa payment verification
    console.log("Verifying Chapa payment:", paymentId)
    return { success: true, status: "success" }
  }

  private async verifyTelebirrPayment(paymentId: string): Promise<{ success: boolean; status: string }> {
    // Mock Telebirr payment verification
    console.log("Verifying Telebirr payment:", paymentId)
    return { success: true, status: "success" }
  }

  async handleWebhook(provider: "chapa" | "telebirr", payload: any, signature: string): Promise<boolean> {
    try {
      switch (provider) {
        case "chapa":
          return await this.handleChapaWebhook(payload, signature)
        case "telebirr":
          return await this.handleTelebirrWebhook(payload, signature)
        default:
          return false
      }
    } catch (error) {
      console.error("Webhook handling failed:", error)
      return false
    }
  }

  private async handleChapaWebhook(payload: any, signature: string): Promise<boolean> {
    // Mock Chapa webhook handling
    console.log("Handling Chapa webhook:", payload)
    return true
  }

  private async handleTelebirrWebhook(payload: any, signature: string): Promise<boolean> {
    // Mock Telebirr webhook handling
    console.log("Handling Telebirr webhook:", payload)
    return true
  }
}

export const paymentGateway = new PaymentGateway()
