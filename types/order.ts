export interface Food {
  id: string
  name: string
  nameAmharic: string
  description?: string
  descriptionAmharic?: string
  price: number
  category: string
  image: string
  preparationTime?: number
  spiceLevel?: "mild" | "medium" | "hot"
  isVegetarian?: boolean
  isAvailable: boolean
  barcode?: string
  ingredients?: string[]
  allergens?: string[]
  nutritionalInfo?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export interface CartItem {
  id: string
  name: string
  nameAmharic: string
  price: number
  quantity: number
  image: string
  category: string
  specialInstructions?: string
  barcode?: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: "pending" | "preparing" | "ready" | "served" | "cancelled"
  customerName?: string
  tableNumber?: number
  orderType: "dine-in" | "takeout" | "delivery"
  createdAt: Date
  updatedAt: Date
  estimatedTime?: number
  specialInstructions?: string
  paymentMethod?: "cash" | "card" | "mobile"
  paymentStatus?: "pending" | "paid" | "refunded"
  barcode?: string
}

export interface OrderStats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalRevenue: number
  averageOrderValue: number
  popularItems: Array<{
    id: string
    name: string
    nameAmharic: string
    count: number
  }>
}
