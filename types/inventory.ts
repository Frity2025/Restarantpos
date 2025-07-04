export interface InventoryItem {
  id: string
  name: string
  nameAmharic: string
  category: InventoryCategory
  currentStock: number
  minStockLevel: number
  maxStockLevel: number
  unit: string
  unitPrice: number
  supplierId: string
  supplierName: string
  lastRestocked: Date
  expiryDate?: Date
  location: string
  barcode?: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface InventoryCategory {
  id: string
  name: string
  nameAmharic: string
  description?: string
  color: string
  isActive: boolean
}

export interface Supplier {
  id: string
  name: string
  nameAmharic: string
  contactPerson: string
  phone: string
  email?: string
  address: string
  paymentTerms: string
  isActive: boolean
  rating: number
  createdAt: Date
}

export interface PurchaseOrder {
  id: string
  orderNumber: string
  supplierId: string
  supplierName: string
  items: PurchaseOrderItem[]
  totalAmount: number
  status: "draft" | "sent" | "confirmed" | "delivered" | "cancelled"
  orderDate: Date
  expectedDeliveryDate: Date
  actualDeliveryDate?: Date
  notes?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface PurchaseOrderItem {
  inventoryItemId: string
  itemName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface StockMovement {
  id: string
  inventoryItemId: string
  itemName: string
  type: "in" | "out" | "adjustment"
  quantity: number
  reason: string
  reference?: string
  performedBy: string
  performedAt: Date
  notes?: string
}

export interface LowStockAlert {
  id: string
  inventoryItemId: string
  itemName: string
  currentStock: number
  minStockLevel: number
  severity: "low" | "critical" | "out_of_stock"
  isAcknowledged: boolean
  createdAt: Date
}

export interface InventoryReport {
  totalItems: number
  totalValue: number
  lowStockItems: number
  expiringSoonItems: number
  outOfStockItems: number
  topCategories: Array<{
    category: string
    count: number
    value: number
  }>
  recentMovements: StockMovement[]
}
