export interface PaymentMethod {
  id: string
  name: string
  type: "cash" | "card" | "mobile" | "bank" | "credit" | "voucher"
  enabled: boolean
  processingFee?: number
  icon?: string
}

export interface PaymentTransaction {
  id: string
  orderId: string
  amount: number
  method: PaymentMethod
  status: "pending" | "processing" | "completed" | "failed" | "refunded"
  transactionId?: string
  timestamp: Date
  receiptNumber?: string
  refundAmount?: number
  refundReason?: string
  customerInfo?: {
    name?: string
    phone?: string
    email?: string
  }
}

export interface Receipt {
  id: string
  receiptNumber: string
  orderId: string
  items: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
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
  }
}

export interface PaymentStats {
  totalRevenue: number
  totalTransactions: number
  averageOrderValue: number
  paymentMethodBreakdown: Record<string, number>
  dailyRevenue: Array<{
    date: string
    revenue: number
    transactions: number
  }>
}
