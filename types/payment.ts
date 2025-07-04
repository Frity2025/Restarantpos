export type PaymentMethod = "cash" | "card" | "mobile_money" | "bank_transfer" | "credit" | "voucher"

export type PaymentProvider = "telebirr" | "cbe_birr" | "awash_birr" | "visa" | "mastercard" | "amex" | "cash"

export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded" | "cancelled"

export interface Payment {
  id: string
  orderId: string
  amount: number
  method: PaymentMethod
  provider?: PaymentProvider
  status: PaymentStatus
  transactionId?: string
  reference?: string
  createdAt: Date
  completedAt?: Date
  failedAt?: Date
  refundedAt?: Date
  employeeId: string
  employeeName: string
  customerName?: string
  customerPhone?: string
  notes?: string
  receiptNumber: string
  metadata?: Record<string, any>
}

export interface PaymentRequest {
  orderId: string
  amount: number
  method: PaymentMethod
  provider?: PaymentProvider
  customerName?: string
  customerPhone?: string
  employeeId: string
  employeeName: string
  notes?: string
  metadata?: Record<string, any>
}

export interface PaymentResponse {
  success: boolean
  payment?: Payment
  transactionId?: string
  reference?: string
  message: string
  error?: string
}

export interface RefundRequest {
  paymentId: string
  amount: number
  reason: string
  employeeId: string
  employeeName: string
}

export interface RefundResponse {
  success: boolean
  refundId?: string
  amount: number
  message: string
  error?: string
}

export interface PaymentFilter {
  dateFrom?: Date
  dateTo?: Date
  status?: PaymentStatus[]
  method?: PaymentMethod[]
  provider?: PaymentProvider[]
  employeeId?: string
  orderId?: string
  minAmount?: number
  maxAmount?: number
}

export interface PaymentStats {
  totalPayments: number
  totalAmount: number
  completedPayments: number
  completedAmount: number
  failedPayments: number
  refundedPayments: number
  refundedAmount: number
  paymentsByMethod: Record<PaymentMethod, { count: number; amount: number }>
  paymentsByProvider: Record<PaymentProvider, { count: number; amount: number }>
  averagePaymentAmount: number
  successRate: number
}

export interface RestaurantInfo {
  name: string
  address: string
  phone: string
  email: string
  taxId: string
  logo: string
}

export interface ReceiptItem {
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Receipt {
  id: string
  receiptNumber: string
  orderId: string
  paymentId: string
  customerName?: string
  customerPhone?: string
  items: ReceiptItem[]
  subtotal: number
  tax: number
  discount: number
  tip: number
  totalAmount: number
  paymentMethod: PaymentMethod
  paymentProvider?: PaymentProvider
  createdAt: Date
  employeeName: string
  restaurantInfo: RestaurantInfo
}
