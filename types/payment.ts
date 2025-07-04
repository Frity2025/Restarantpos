export interface PaymentMethod {
  id: string
  name: string
  type: "cash" | "card" | "mobile" | "bank" | "credit" | "voucher"
  enabled: boolean
  processingFee?: number
  maxAmount?: number
  minAmount?: number
  icon?: string
}

export interface PaymentTransaction {
  id: string
  orderId: string
  amount: number
  paymentMethod: PaymentMethod
  status: "pending" | "processing" | "completed" | "failed" | "refunded"
  transactionId?: string
  reference?: string
  timestamp: Date
  processedBy: string
  notes?: string
  refundAmount?: number
  refundReason?: string
  refundedAt?: Date
}

export interface Receipt {
  id: string
  receiptNumber: string
  orderId: string
  transactionId: string
  customerName?: string
  items: ReceiptItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: string
  timestamp: Date
  cashier: string
  restaurantInfo: {
    name: string
    address: string
    phone: string
    taxId: string
  }
}

export interface ReceiptItem {
  name: string
  quantity: number
  price: number
  total: number
}

export interface RefundRequest {
  id: string
  transactionId: string
  amount: number
  reason: string
  requestedBy: string
  requestedAt: Date
  status: "pending" | "approved" | "rejected" | "processed"
  processedBy?: string
  processedAt?: Date
  notes?: string
}

export interface PaymentStats {
  totalTransactions: number
  totalAmount: number
  successRate: number
  averageTransactionAmount: number
  paymentMethodBreakdown: {
    method: string
    count: number
    amount: number
    percentage: number
  }[]
  dailyStats: {
    date: string
    transactions: number
    amount: number
  }[]
}
