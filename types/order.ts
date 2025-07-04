// የትዕዛዝ ሁኔታዎች
export type OrderStatus =
  | "pending" // በመጠባበቅ ላይ
  | "confirmed" // ተረጋግጧል
  | "preparing" // በዝግጅት ላይ
  | "ready" // ዝግጁ ነው
  | "served" // ተሰርቷል
  | "completed" // ተጠናቋል
  | "cancelled" // ተሰርዟል

// የክፍያ ሁኔታዎች
export type PaymentStatus = "pending" | "paid" | "partial" | "refunded"

// የትዕዛዝ አይነቶች
export type OrderType = "dine_in" | "takeaway" | "delivery"

// የትዕዛዝ ንጥል
export interface OrderItem {
  id: string
  foodId: string
  foodName: string
  foodImage: string
  price: number
  quantity: number
  specialInstructions?: string
  modifications?: string[]
  totalPrice: number
}

// የትዕዛዝ መረጃ
export interface Order {
  id: string
  orderNumber: string
  tableNumber?: string
  customerName?: string
  customerPhone?: string
  customerAddress?: string
  orderType: OrderType
  items: OrderItem[]
  subtotal: number
  tax: number
  discount: number
  totalAmount: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod?: string
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  estimatedTime?: number // በደቂቃ
  actualTime?: number
  employeeId: string
  employeeName: string
  kitchenNotes?: string
  customerNotes?: string
}

// የትዕዛዝ ስታቲስቲክስ
export interface OrderStats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  cancelledOrders: number
  totalRevenue: number
  averageOrderValue: number
  averagePreparationTime: number
  ordersByType: Record<OrderType, number>
  ordersByStatus: Record<OrderStatus, number>
  topSellingItems: Array<{
    foodId: string
    foodName: string
    quantity: number
    revenue: number
  }>
}

// የትዕዛዝ ማጣሪያ
export interface OrderFilter {
  status?: OrderStatus[]
  orderType?: OrderType[]
  dateFrom?: Date
  dateTo?: Date
  employeeId?: string
  tableNumber?: string
  customerName?: string
}
