export interface ReorderRule {
  id: string
  inventoryItemId: string
  itemName: string
  itemNameAmharic: string
  reorderPoint: number
  reorderQuantity: number
  maxStockLevel: number
  preferredSupplierId: string
  preferredSupplierName: string
  isActive: boolean
  autoOrder: boolean
  leadTimeDays: number
  lastReorderDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ReorderAlert {
  id: string
  inventoryItemId: string
  itemName: string
  itemNameAmharic: string
  currentStock: number
  reorderPoint: number
  reorderQuantity: number
  supplierId: string
  supplierName: string
  priority: "low" | "medium" | "high" | "critical"
  status: "pending" | "processing" | "ordered" | "completed" | "cancelled"
  alertDate: Date
  expectedDeliveryDate?: Date
  purchaseOrderId?: string
  isAcknowledged: boolean
  notes?: string
}

export interface AutoReorderConfig {
  enabled: boolean
  checkIntervalMinutes: number
  autoCreatePurchaseOrders: boolean
  requireApproval: boolean
  approvalThreshold: number
  defaultLeadTimeDays: number
  emergencyReorderMultiplier: number
  notifications: {
    email: boolean
    sms: boolean
    inApp: boolean
  }
  workingHours: {
    start: string
    end: string
    workingDays: number[]
  }
}

export interface ReorderSuggestion {
  inventoryItemId: string
  itemName: string
  itemNameAmharic: string
  currentStock: number
  reorderPoint: number
  suggestedQuantity: number
  estimatedCost: number
  supplierId: string
  supplierName: string
  urgency: "low" | "medium" | "high" | "critical"
  reason: string
  lastOrderDate?: Date
  averageConsumption: number
}

export interface ReorderHistory {
  id: string
  inventoryItemId: string
  itemName: string
  reorderQuantity: number
  supplierId: string
  supplierName: string
  orderDate: Date
  deliveryDate?: Date
  actualQuantity?: number
  cost: number
  status: "ordered" | "delivered" | "cancelled" | "partial"
  notes?: string
}
