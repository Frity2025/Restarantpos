import type {
  InventoryItem,
  InventoryCategory,
  Supplier,
  PurchaseOrder,
  StockMovement,
  LowStockAlert,
  InventoryReport,
} from "@/types/inventory"

class InventoryService {
  private inventoryItems: InventoryItem[] = [
    {
      id: "1",
      name: "Tomatoes",
      nameAmharic: "ቲማቲም",
      category: { id: "1", name: "Vegetables", nameAmharic: "አትክልቶች", color: "green", isActive: true },
      currentStock: 50,
      minStockLevel: 20,
      maxStockLevel: 100,
      unit: "kg",
      unitPrice: 25.0,
      supplierId: "1",
      supplierName: "Fresh Produce Co.",
      lastRestocked: new Date("2024-01-01"),
      expiryDate: new Date("2024-01-15"),
      location: "Cold Storage A",
      isActive: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "2",
      name: "Chicken Breast",
      nameAmharic: "የዶሮ ጡት",
      category: { id: "2", name: "Meat", nameAmharic: "ስጋ", color: "red", isActive: true },
      currentStock: 15,
      minStockLevel: 25,
      maxStockLevel: 80,
      unit: "kg",
      unitPrice: 180.0,
      supplierId: "2",
      supplierName: "Quality Meats Ltd.",
      lastRestocked: new Date("2024-01-02"),
      expiryDate: new Date("2024-01-10"),
      location: "Freezer B",
      isActive: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-02"),
    },
    {
      id: "3",
      name: "Rice",
      nameAmharic: "ሩዝ",
      category: { id: "3", name: "Grains", nameAmharic: "እህል", color: "yellow", isActive: true },
      currentStock: 200,
      minStockLevel: 50,
      maxStockLevel: 300,
      unit: "kg",
      unitPrice: 45.0,
      supplierId: "3",
      supplierName: "Grain Suppliers Inc.",
      lastRestocked: new Date("2024-01-01"),
      location: "Dry Storage",
      isActive: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  ]

  private categories: InventoryCategory[] = [
    { id: "1", name: "Vegetables", nameAmharic: "አትክልቶች", color: "green", isActive: true },
    { id: "2", name: "Meat", nameAmharic: "ስጋ", color: "red", isActive: true },
    { id: "3", name: "Grains", nameAmharic: "እህል", color: "yellow", isActive: true },
    { id: "4", name: "Dairy", nameAmharic: "የወተት ተዋጽኦች", color: "blue", isActive: true },
    { id: "5", name: "Spices", nameAmharic: "ቅመማ ቅመም", color: "orange", isActive: true },
    { id: "6", name: "Beverages", nameAmharic: "መጠጦች", color: "purple", isActive: true },
  ]

  private suppliers: Supplier[] = [
    {
      id: "1",
      name: "Fresh Produce Co.",
      nameAmharic: "ትኩስ ምርት ኩባንያ",
      contactPerson: "አበበ ተስፋዬ",
      phone: "+251911123456",
      email: "abebe@freshproduce.com",
      address: "አዲስ አበባ, ቦሌ",
      paymentTerms: "30 days",
      isActive: true,
      rating: 4.5,
      createdAt: new Date("2024-01-01"),
    },
    {
      id: "2",
      name: "Quality Meats Ltd.",
      nameAmharic: "ጥራት ስጋ ሃ.የተ.የግ.ማ",
      contactPerson: "ሙሉጌታ አለሙ",
      phone: "+251911234567",
      email: "mulugeta@qualitymeats.com",
      address: "አዲስ አበባ, መርካቶ",
      paymentTerms: "15 days",
      isActive: true,
      rating: 4.8,
      createdAt: new Date("2024-01-01"),
    },
    {
      id: "3",
      name: "Grain Suppliers Inc.",
      nameAmharic: "እህል አቅራቢዎች ኩባንያ",
      contactPerson: "ፍቅሩ ወልደ",
      phone: "+251911345678",
      email: "fikru@grainsuppliers.com",
      address: "አዲስ አበባ, ፒያሳ",
      paymentTerms: "45 days",
      isActive: true,
      rating: 4.2,
      createdAt: new Date("2024-01-01"),
    },
  ]

  private stockMovements: StockMovement[] = []
  private purchaseOrders: PurchaseOrder[] = []

  // Inventory Items
  getAllInventoryItems(): InventoryItem[] {
    return this.inventoryItems.filter((item) => item.isActive)
  }

  getInventoryItemById(id: string): InventoryItem | undefined {
    return this.inventoryItems.find((item) => item.id === id)
  }

  addInventoryItem(item: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">): InventoryItem {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.inventoryItems.push(newItem)
    return newItem
  }

  updateInventoryItem(id: string, updates: Partial<InventoryItem>): InventoryItem | null {
    const index = this.inventoryItems.findIndex((item) => item.id === id)
    if (index === -1) return null

    this.inventoryItems[index] = {
      ...this.inventoryItems[index],
      ...updates,
      updatedAt: new Date(),
    }
    return this.inventoryItems[index]
  }

  deleteInventoryItem(id: string): boolean {
    const index = this.inventoryItems.findIndex((item) => item.id === id)
    if (index === -1) return false

    this.inventoryItems[index].isActive = false
    this.inventoryItems[index].updatedAt = new Date()
    return true
  }

  // Stock Management
  updateStock(
    itemId: string,
    quantity: number,
    type: "in" | "out" | "adjustment",
    reason: string,
    performedBy: string,
  ): boolean {
    const item = this.getInventoryItemById(itemId)
    if (!item) return false

    const movement: StockMovement = {
      id: Date.now().toString(),
      inventoryItemId: itemId,
      itemName: item.name,
      type,
      quantity: Math.abs(quantity),
      reason,
      performedBy,
      performedAt: new Date(),
    }

    if (type === "in") {
      item.currentStock += Math.abs(quantity)
    } else if (type === "out") {
      item.currentStock = Math.max(0, item.currentStock - Math.abs(quantity))
    } else if (type === "adjustment") {
      item.currentStock = Math.max(0, quantity)
    }

    item.updatedAt = new Date()
    this.stockMovements.push(movement)
    return true
  }

  getStockMovements(itemId?: string): StockMovement[] {
    if (itemId) {
      return this.stockMovements.filter((movement) => movement.inventoryItemId === itemId)
    }
    return this.stockMovements.sort((a, b) => b.performedAt.getTime() - a.performedAt.getTime())
  }

  // Low Stock Alerts
  getLowStockAlerts(): LowStockAlert[] {
    const alerts: LowStockAlert[] = []

    this.inventoryItems.forEach((item) => {
      if (!item.isActive) return

      let severity: "low" | "critical" | "out_of_stock"

      if (item.currentStock === 0) {
        severity = "out_of_stock"
      } else if (item.currentStock <= item.minStockLevel * 0.5) {
        severity = "critical"
      } else if (item.currentStock <= item.minStockLevel) {
        severity = "low"
      } else {
        return
      }

      alerts.push({
        id: `alert-${item.id}`,
        inventoryItemId: item.id,
        itemName: item.name,
        currentStock: item.currentStock,
        minStockLevel: item.minStockLevel,
        severity,
        isAcknowledged: false,
        createdAt: new Date(),
      })
    })

    return alerts.sort((a, b) => {
      const severityOrder = { out_of_stock: 3, critical: 2, low: 1 }
      return severityOrder[b.severity] - severityOrder[a.severity]
    })
  }

  // Categories
  getAllCategories(): InventoryCategory[] {
    return this.categories.filter((cat) => cat.isActive)
  }

  addCategory(category: Omit<InventoryCategory, "id">): InventoryCategory {
    const newCategory: InventoryCategory = {
      ...category,
      id: Date.now().toString(),
    }
    this.categories.push(newCategory)
    return newCategory
  }

  // Suppliers
  getAllSuppliers(): Supplier[] {
    return this.suppliers.filter((supplier) => supplier.isActive)
  }

  getSupplierById(id: string): Supplier | undefined {
    return this.suppliers.find((supplier) => supplier.id === id)
  }

  addSupplier(supplier: Omit<Supplier, "id" | "createdAt">): Supplier {
    const newSupplier: Supplier = {
      ...supplier,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    this.suppliers.push(newSupplier)
    return newSupplier
  }

  // Purchase Orders
  getAllPurchaseOrders(): PurchaseOrder[] {
    return this.purchaseOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  createPurchaseOrder(order: Omit<PurchaseOrder, "id" | "orderNumber" | "createdAt" | "updatedAt">): PurchaseOrder {
    const orderNumber = `PO-${Date.now()}`
    const newOrder: PurchaseOrder = {
      ...order,
      id: Date.now().toString(),
      orderNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.purchaseOrders.push(newOrder)
    return newOrder
  }

  updatePurchaseOrderStatus(id: string, status: PurchaseOrder["status"]): boolean {
    const order = this.purchaseOrders.find((po) => po.id === id)
    if (!order) return false

    order.status = status
    order.updatedAt = new Date()

    if (status === "delivered") {
      order.actualDeliveryDate = new Date()
      // Auto-update inventory when order is delivered
      order.items.forEach((item) => {
        this.updateStock(
          item.inventoryItemId,
          item.quantity,
          "in",
          `Purchase Order ${order.orderNumber} delivered`,
          "System",
        )
      })
    }

    return true
  }

  // Reports
  getInventoryReport(): InventoryReport {
    const activeItems = this.getAllInventoryItems()
    const lowStockAlerts = this.getLowStockAlerts()

    const totalValue = activeItems.reduce((sum, item) => sum + item.currentStock * item.unitPrice, 0)

    const expiringSoonItems = activeItems.filter((item) => {
      if (!item.expiryDate) return false
      const daysUntilExpiry = Math.ceil((item.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilExpiry <= 7 && daysUntilExpiry > 0
    }).length

    const categoryStats = this.categories
      .map((category) => {
        const categoryItems = activeItems.filter((item) => item.category.id === category.id)
        return {
          category: category.nameAmharic,
          count: categoryItems.length,
          value: categoryItems.reduce((sum, item) => sum + item.currentStock * item.unitPrice, 0),
        }
      })
      .sort((a, b) => b.value - a.value)

    return {
      totalItems: activeItems.length,
      totalValue,
      lowStockItems: lowStockAlerts.filter((alert) => alert.severity === "low").length,
      expiringSoonItems,
      outOfStockItems: lowStockAlerts.filter((alert) => alert.severity === "out_of_stock").length,
      topCategories: categoryStats.slice(0, 5),
      recentMovements: this.getStockMovements().slice(0, 10),
    }
  }
}

export const inventoryService = new InventoryService()
