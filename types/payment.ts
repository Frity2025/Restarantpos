// Payment method types
export type PaymentMethod = "cash" | "card" | "mobile_money" | "bank_transfer" | "credit" | "voucher"

// Payment status types
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded" | "cancelled"

// Transaction types
export type TransactionType = "payment" | "refund" | "adjustment" | "tip"

// Payment provider types
export type PaymentProvider = "telebirr" | "cbe_birr" | "awash_birr" | "visa" | "mastercard" | "amex" | "cash"

// Payment interface
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
  notes?: string
  receiptNumber: string
  metadata?: Record<string, any>
}

// Payment request interface
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

// Payment response interface
export interface PaymentResponse {
  success: boolean
  payment?: Payment
  transactionId?: string
  reference?: string
  message: string
  error?: string
}

// Refund request interface
export interface RefundRequest {
  paymentId: string
  amount: number
  reason: string
  employeeId: string
  employeeName: string
}

// Refund response interface
export interface RefundResponse {
  success: boolean
  refundId?: string
  amount: number
  message: string
  error?: string
}

// Receipt interface
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

// Receipt item interface
export interface ReceiptItem {
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

// Restaurant info for receipts
export interface RestaurantInfo {
  name: string
  address: string
  phone: string
  email?: string
  taxId?: string
  logo?: string
}

// Payment statistics interface
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

// Payment filter interface
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

// Mobile money payment details
export interface MobileMoneyPayment {
  phoneNumber: string
  provider: "telebirr" | "cbe_birr" | "awash_birr"
  reference: string
}

// Card payment details
export interface CardPayment {
  cardType: "visa" | "mastercard" | "amex"
  lastFourDigits: string
  authCode: string
  terminalId?: string
}

// Bank transfer payment details
export interface BankTransferPayment {
  bankName: string
  accountNumber: string
  reference: string
}

// Payment configuration
export interface PaymentConfig {
  enabledMethods: PaymentMethod[]
  mobileMoneyProviders: PaymentProvider[]
  cardProviders: PaymentProvider[]
  taxRate: number
  tipEnabled: boolean
  receiptFooter?: string
  autoReceiptPrint: boolean
}
