export interface PaymentMethod {
  id: string
  name: string
  type: "cash" | "card" | "mobile" | "bank_transfer"
  icon: string
  enabled: boolean
  processingFee?: number
}

export interface Payment {
  id: string
  orderId: string
  amount: number
  method: PaymentMethod
  status: "pending" | "processing" | "completed" | "failed" | "refunded"
  transactionId?: string
  createdAt: Date
  completedAt?: Date
  failureReason?: string
  refundAmount?: number
  refundReason?: string
}

export interface PaymentSummary {
  subtotal: number
  tax: number
  discount: number
  total: number
  amountPaid: number
  change: number
}

export interface Receipt {
  id: string
  orderId: string
  paymentId: string
  receiptNumber: string
  items: ReceiptItem[]
  summary: PaymentSummary
  paymentMethod: PaymentMethod
  customerInfo?: CustomerInfo
  timestamp: Date
  cashier: string
}

export interface ReceiptItem {
  name: string
  quantity: number
  unitPrice: number
  total: number
}

export interface CustomerInfo {
  name?: string
  phone?: string
  email?: string
  address?: string
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: "cash",
    name: "ጥሬ ገንዘብ",
    type: "cash",
    icon: "banknote",
    enabled: true,
  },
  {
    id: "telebirr",
    name: "ቴሌ ብር",
    type: "mobile",
    icon: "smartphone",
    enabled: true,
    processingFee: 0.02,
  },
  {
    id: "cbe-birr",
    name: "ሲቢኢ ብር",
    type: "mobile",
    icon: "smartphone",
    enabled: true,
    processingFee: 0.015,
  },
  {
    id: "visa",
    name: "ቪዛ ካርድ",
    type: "card",
    icon: "credit-card",
    enabled: true,
    processingFee: 0.025,
  },
  {
    id: "mastercard",
    name: "ማስተር ካርድ",
    type: "card",
    icon: "credit-card",
    enabled: true,
    processingFee: 0.025,
  },
]
