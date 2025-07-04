export type PaymentMethod = "cash" | "mobile_money" | "card" | "bank_transfer" | "credit" | "voucher"

export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "cancelled" | "refunded"

export interface PaymentProvider {
  id: string
  name: string
  type: PaymentMethod
  isActive: boolean
  processingFee: number
  successRate: number
  logo?: string
}

export interface Payment {
  id: string
  orderId: string
  amount: number
  method: PaymentMethod
  provider?: string
  status: PaymentStatus
  transactionId?: string
  reference?: string
  createdAt: Date
  completedAt?: Date
  failureReason?: string
  metadata?: Record<string, any>
}

export interface PaymentRequest {
  orderId: string
  amount: number
  method: PaymentMethod
  provider?: string
  customerInfo?: {
    name: string
    phone?: string
    email?: string
  }
  metadata?: Record<string, any>
}

export interface PaymentResponse {
  success: boolean
  payment?: Payment
  error?: string
  requiresConfirmation?: boolean
  confirmationData?: any
}

export interface RefundRequest {
  paymentId: string
  amount?: number // Partial refund if specified
  reason: string
}

export interface RefundResponse {
  success: boolean
  refundId?: string
  amount?: number
  error?: string
}

export interface PaymentSummary {
  totalAmount: number
  totalTransactions: number
  successfulTransactions: number
  failedTransactions: number
  byMethod: Record<
    PaymentMethod,
    {
      count: number
      amount: number
    }
  >
  byStatus: Record<PaymentStatus, number>
}
