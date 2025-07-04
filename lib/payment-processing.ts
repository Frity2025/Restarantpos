import type {
  Payment,
  PaymentRequest,
  PaymentResponse,
  RefundRequest,
  RefundResponse,
  PaymentStats,
  PaymentFilter,
  PaymentMethod,
  PaymentProvider,
  Receipt,
  RestaurantInfo,
} from "@/types/payment"
import type { Order } from "@/types/order"

// Sample restaurant info
const restaurantInfo: RestaurantInfo = {
  name: "ቺሊ POS ምግብ ቤት",
  address: "አዲስ አበባ፣ ቦሌ ክፍለ ከተማ፣ ሳሪስ አካባቢ",
  phone: "+251-11-123-4567",
  email: "info@chilipos.com",
  taxId: "TIN-123456789",
  logo: "/placeholder.svg?height=100&width=100",
}

// Sample payments data
const payments: Payment[] = [
  {
    id: "pay-001",
    orderId: "order-001",
    amount: 388.5,
    method: "mobile_money",
    provider: "telebirr",
    status: "completed",
    transactionId: "TB123456789",
    reference: "REF-001",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000),
    employeeId: "emp-003",
    employeeName: "ዳዊት ተስፋዬ",
    customerName: "ፍሎይድ ማይልስ",
    receiptNumber: "RCP-001",
    metadata: {
      phoneNumber: "+251911123456",
    },
  },
  {
    id: "pay-002",
    orderId: "order-002",
    amount: 285.0,
    method: "cash",
    status: "completed",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000 + 5000),
    employeeId: "emp-004",
    employeeName: "ሄለን ገብረ",
    customerName: "ሳራ አህመድ",
    receiptNumber: "RCP-002",
  },
  {
    id: "pay-003",
    orderId: "order-003",
    amount: 294.0,
    method: "card",
    provider: "visa",
    status: "completed",
    transactionId: "VISA789123456",
    reference: "REF-003",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000 + 15000),
    employeeId: "emp-002",
    employeeName: "ፋጢማ አህመድ",
    customerName: "ሚካኤል ተክለ",
    receiptNumber: "RCP-003",
    metadata: {
      cardType: "visa",
      lastFourDigits: "1234",
      authCode: "AUTH123",
    },
  },
]

export class PaymentService {
  private static instance: PaymentService
  private payments: Payment[] = [...payments]
  private receiptCounter = 4

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService()
    }
    return PaymentService.instance
  }

  // Process payment
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Generate receipt number
      const receiptNumber = `RCP-${String(this.receiptCounter++).padStart(3, "0")}`

      // Create payment record
      const payment: Payment = {
        id: `pay-${Date.now()}`,
        orderId: request.orderId,
        amount: request.amount,
        method: request.method,
        provider: request.provider,
        status: "processing",
        createdAt: new Date(),
        employeeId: request.employeeId,
        employeeName: request.employeeName,
        customerName: request.customerName,
        notes: request.notes,
        receiptNumber,
        metadata: request.metadata,
      }

      // Add to payments array
      this.payments.unshift(payment)

      // Simulate payment processing based on method
      const result = await this.simulatePaymentProcessing(payment)

      // Update payment status
      payment.status = result.success ? "completed" : "failed"
      payment.transactionId = result.transactionId
      payment.reference = result.reference

      if (result.success) {
        payment.completedAt = new Date()
      } else {
        payment.failedAt = new Date()
      }

      return {
        success: result.success,
        payment: result.success ? payment : undefined,
        transactionId: result.transactionId,
        reference: result.reference,
        message: result.message,
        error: result.success ? undefined : result.message,
      }
    } catch (error) {
      return {
        success: false,
        message: "የክፍያ ሂደት ስህተት ተፈጥሯል",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Simulate payment processing for different methods
  private async simulatePaymentProcessing(payment: Payment): Promise<{
    success: boolean
    transactionId?: string
    reference?: string
    message: string
  }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Simulate success/failure rates
    const successRate = this.getSuccessRateForMethod(payment.method)
    const isSuccess = Math.random() < successRate

    if (isSuccess) {
      return {
        success: true,
        transactionId: this.generateTransactionId(payment.method, payment.provider),
        reference: `REF-${Date.now()}`,
        message: "ክፍያ በተሳካ ሁኔታ ተጠናቋል",
      }
    } else {
      return {
        success: false,
        message: this.getFailureMessage(payment.method),
      }
    }
  }

  // Get success rate for payment method
  private getSuccessRateForMethod(method: PaymentMethod): number {
    switch (method) {
      case "cash":
        return 1.0 // Cash always succeeds
      case "card":
        return 0.95
      case "mobile_money":
        return 0.92
      case "bank_transfer":
        return 0.88
      case "credit":
        return 0.85
      case "voucher":
        return 0.98
      default:
        return 0.9
    }
  }

  // Generate transaction ID based on method and provider
  private generateTransactionId(method: PaymentMethod, provider?: PaymentProvider): string {
    const timestamp = Date.now().toString().slice(-8)
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()

    switch (provider) {
      case "telebirr":
        return `TB${timestamp}${random}`
      case "cbe_birr":
        return `CBE${timestamp}${random}`
      case "awash_birr":
        return `AWB${timestamp}${random}`
      case "visa":
        return `VISA${timestamp}${random}`
      case "mastercard":
        return `MC${timestamp}${random}`
      case "amex":
        return `AMEX${timestamp}${random}`
      default:
        return `TXN${timestamp}${random}`
    }
  }

  // Get failure message for payment method
  private getFailureMessage(method: PaymentMethod): string {
    switch (method) {
      case "card":
        return "ካርድ ክፍያ ተከልክሏል። ካርድዎን ያረጋግጡ።"
      case "mobile_money":
        return "የሞባይል ገንዘብ ክፍያ አልተሳካም። ሂሳብዎን ያረጋግጡ።"
      case "bank_transfer":
        return "የባንክ ዝውውር አልተሳካም። ግንኙነትዎን ያረጋግጡ።"
      case "credit":
        return "የክሬዲት ክፍያ አልተሳካም። ክሬዲትዎን ያረጋግጡ።"
      case "voucher":
        return "ቫውቸር ክፍያ አልተሳካም። ቫውቸርዎን ያረጋግጡ።"
      default:
        return "ክፍያ አልተሳካም። እንደገና ይሞክሩ።"
    }
  }

  // Process refund
  async processRefund(request: RefundRequest): Promise<RefundResponse> {
    try {
      const payment = this.payments.find((p) => p.id === request.paymentId)
      if (!payment) {
        return {
          success: false,
          amount: 0,
          message: "ክፍያ አልተገኘም",
          error: "Payment not found",
        }
      }

      if (payment.status !== "completed") {
        return {
          success: false,
          amount: 0,
          message: "ያልተጠናቀቀ ክፍያ መመለስ አይችልም",
          error: "Cannot refund incomplete payment",
        }
      }

      if (request.amount > payment.amount) {
        return {
          success: false,
          amount: 0,
          message: "የመመለሻ መጠን ከክፍያ መጠን ሊበልጥ አይችልም",
          error: "Refund amount exceeds payment amount",
        }
      }

      // Simulate refund processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update payment status
      payment.status = "refunded"
      payment.refundedAt = new Date()
      payment.notes = (payment.notes || "") + ` | መመለሻ: ${request.reason}`

      return {
        success: true,
        refundId: `REF-${Date.now()}`,
        amount: request.amount,
        message: "መመለሻ በተሳካ ሁኔታ ተጠናቋል",
      }
    } catch (error) {
      return {
        success: false,
        amount: 0,
        message: "የመመለሻ ሂደት ስህተት ተፈጥሯል",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Get payment by ID
  getPaymentById(paymentId: string): Payment | null {
    return this.payments.find((payment) => payment.id === paymentId) || null
  }

  // Get payments by order ID
  getPaymentsByOrderId(orderId: string): Payment[] {
    return this.payments.filter((payment) => payment.orderId === orderId)
  }

  // Get all payments
  getAllPayments(): Payment[] {
    return this.payments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Get filtered payments
  getFilteredPayments(filter: PaymentFilter): Payment[] {
    let filtered = this.payments

    if (filter.dateFrom) {
      filtered = filtered.filter((payment) => payment.createdAt >= filter.dateFrom!)
    }

    if (filter.dateTo) {
      filtered = filtered.filter((payment) => payment.createdAt <= filter.dateTo!)
    }

    if (filter.status && filter.status.length > 0) {
      filtered = filtered.filter((payment) => filter.status!.includes(payment.status))
    }

    if (filter.method && filter.method.length > 0) {
      filtered = filtered.filter((payment) => filter.method!.includes(payment.method))
    }

    if (filter.provider && filter.provider.length > 0) {
      filtered = filtered.filter((payment) => payment.provider && filter.provider!.includes(payment.provider))
    }

    if (filter.employeeId) {
      filtered = filtered.filter((payment) => payment.employeeId === filter.employeeId)
    }

    if (filter.orderId) {
      filtered = filtered.filter((payment) => payment.orderId === filter.orderId)
    }

    if (filter.minAmount !== undefined) {
      filtered = filtered.filter((payment) => payment.amount >= filter.minAmount!)
    }

    if (filter.maxAmount !== undefined) {
      filtered = filtered.filter((payment) => payment.amount <= filter.maxAmount!)
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Get payment statistics
  getPaymentStats(dateFrom?: Date, dateTo?: Date): PaymentStats {
    let filtered = this.payments

    if (dateFrom) {
      filtered = filtered.filter((payment) => payment.createdAt >= dateFrom)
    }

    if (dateTo) {
      filtered = filtered.filter((payment) => payment.createdAt <= dateTo)
    }

    const totalPayments = filtered.length
    const totalAmount = filtered.reduce((sum, payment) => sum + payment.amount, 0)

    const completedPayments = filtered.filter((p) => p.status === "completed")
    const completedAmount = completedPayments.reduce((sum, payment) => sum + payment.amount, 0)

    const failedPayments = filtered.filter((p) => p.status === "failed").length
    const refundedPayments = filtered.filter((p) => p.status === "refunded")
    const refundedAmount = refundedPayments.reduce((sum, payment) => sum + payment.amount, 0)

    // Group by payment method
    const paymentsByMethod: Record<string, { count: number; amount: number }> = {}
    filtered.forEach((payment) => {
      if (!paymentsByMethod[payment.method]) {
        paymentsByMethod[payment.method] = { count: 0, amount: 0 }
      }
      paymentsByMethod[payment.method].count++
      paymentsByMethod[payment.method].amount += payment.amount
    })

    // Group by payment provider
    const paymentsByProvider: Record<string, { count: number; amount: number }> = {}
    filtered.forEach((payment) => {
      if (payment.provider) {
        if (!paymentsByProvider[payment.provider]) {
          paymentsByProvider[payment.provider] = { count: 0, amount: 0 }
        }
        paymentsByProvider[payment.provider].count++
        paymentsByProvider[payment.provider].amount += payment.amount
      }
    })

    return {
      totalPayments,
      totalAmount,
      completedPayments: completedPayments.length,
      completedAmount,
      failedPayments,
      refundedPayments: refundedPayments.length,
      refundedAmount,
      paymentsByMethod: paymentsByMethod as any,
      paymentsByProvider: paymentsByProvider as any,
      averagePaymentAmount: totalPayments > 0 ? totalAmount / totalPayments : 0,
      successRate: totalPayments > 0 ? completedPayments.length / totalPayments : 0,
    }
  }

  // Generate receipt
  generateReceipt(paymentId: string, order: Order): Receipt | null {
    const payment = this.getPaymentById(paymentId)
    if (!payment) return null

    return {
      id: `receipt-${Date.now()}`,
      receiptNumber: payment.receiptNumber,
      orderId: payment.orderId,
      paymentId: payment.id,
      customerName: payment.customerName,
      customerPhone: order.customerPhone,
      items: order.items.map((item) => ({
        name: item.foodName,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.totalPrice,
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      discount: order.discount,
      tip: 0, // Can be added later
      totalAmount: payment.amount,
      paymentMethod: payment.method,
      paymentProvider: payment.provider,
      createdAt: payment.completedAt || payment.createdAt,
      employeeName: payment.employeeName,
      restaurantInfo,
    }
  }

  // Validate payment method availability
  isPaymentMethodAvailable(method: PaymentMethod): boolean {
    // In a real implementation, this would check system configuration
    return true
  }

  // Get available payment providers for a method
  getAvailableProviders(method: PaymentMethod): PaymentProvider[] {
    switch (method) {
      case "mobile_money":
        return ["telebirr", "cbe_birr", "awash_birr"]
      case "card":
        return ["visa", "mastercard", "amex"]
      case "cash":
        return ["cash"]
      default:
        return []
    }
  }
}

export const paymentService = PaymentService.getInstance()
