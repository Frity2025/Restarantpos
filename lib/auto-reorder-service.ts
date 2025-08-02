import type { ReorderRule, ReorderAlert, AutoReorderConfig, ReorderSuggestion, ReorderHistory } from "@/types/reorder"
import { inventoryService } from "@/lib/inventory-management"

class AutoReorderService {
  private reorderRules: ReorderRule[] = []
  private reorderAlerts: ReorderAlert[] = []
  private reorderHistory: ReorderHistory[] = []
  private config: AutoReorderConfig = {
    enabled: true,
    checkIntervalMinutes: 60,
    autoCreatePurchaseOrders: false,
    requireApproval: true,
    approvalThreshold: 1000,
    defaultLeadTimeDays: 7,
    emergencyReorderMultiplier: 1.5,
    notifications: {
      email: true,
      sms: false,
      inApp: true,
    },
    workingHours: {
      start: "08:00",
      end: "18:00",
      workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    },
  }

  private intervalId: NodeJS.Timeout | null = null

  constructor() {
    this.initializeSampleData()
    this.startAutoReorderCheck()
  }

  private initializeSampleData() {
    const inventoryItems = inventoryService.getAllInventoryItems()

    // Create reorder rules for existing inventory items
    inventoryItems.forEach((item, index) => {
      const reorderRule: ReorderRule = {
        id: `rule-${item.id}`,
        inventoryItemId: item.id,
        itemName: item.name,
        itemNameAmharic: item.nameAmharic,
        reorderPoint: Math.max(item.minStockLevel, Math.floor(item.currentStock * 0.3)),
        reorderQuantity: Math.floor((item.maxStockLevel - item.minStockLevel) * 0.8),
        maxStockLevel: item.maxStockLevel,
        preferredSupplierId: item.supplierId,
        preferredSupplierName: item.supplierName,
        isActive: true,
        autoOrder: index % 3 === 0, // Auto-order for every 3rd item
        leadTimeDays: 3 + (index % 7), // 3-9 days lead time
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      this.reorderRules.push(reorderRule)
    })
  }

  // Configuration Management
  getConfig(): AutoReorderConfig {
    return { ...this.config }
  }

  updateConfig(updates: Partial<AutoReorderConfig>): void {
    this.config = { ...this.config, ...updates }

    // Restart the auto-check with new interval
    if (updates.checkIntervalMinutes) {
      this.stopAutoReorderCheck()
      this.startAutoReorderCheck()
    }
  }

  // Reorder Rules Management
  getAllReorderRules(): ReorderRule[] {
    return this.reorderRules.filter((rule) => rule.isActive)
  }

  getReorderRuleByItemId(itemId: string): ReorderRule | undefined {
    return this.reorderRules.find((rule) => rule.inventoryItemId === itemId && rule.isActive)
  }

  createReorderRule(rule: Omit<ReorderRule, "id" | "createdAt" | "updatedAt">): ReorderRule {
    const newRule: ReorderRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.reorderRules.push(newRule)
    return newRule
  }

  updateReorderRule(id: string, updates: Partial<ReorderRule>): ReorderRule | null {
    const index = this.reorderRules.findIndex((rule) => rule.id === id)
    if (index === -1) return null

    this.reorderRules[index] = {
      ...this.reorderRules[index],
      ...updates,
      updatedAt: new Date(),
    }
    return this.reorderRules[index]
  }

  deleteReorderRule(id: string): boolean {
    const index = this.reorderRules.findIndex((rule) => rule.id === id)
    if (index === -1) return false

    this.reorderRules[index].isActive = false
    this.reorderRules[index].updatedAt = new Date()
    return true
  }

  // Auto Reorder Check
  private startAutoReorderCheck(): void {
    if (!this.config.enabled) return

    this.intervalId = setInterval(
      () => {
        this.checkInventoryLevels()
      },
      this.config.checkIntervalMinutes * 60 * 1000,
    )

    // Run initial check
    this.checkInventoryLevels()
  }

  private stopAutoReorderCheck(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  checkInventoryLevels(): ReorderAlert[] {
    const inventoryItems = inventoryService.getAllInventoryItems()
    const newAlerts: ReorderAlert[] = []

    inventoryItems.forEach((item) => {
      const rule = this.getReorderRuleByItemId(item.id)
      if (!rule) return

      // Check if item needs reordering
      if (item.currentStock <= rule.reorderPoint) {
        const existingAlert = this.reorderAlerts.find(
          (alert) => alert.inventoryItemId === item.id && alert.status === "pending",
        )

        if (!existingAlert) {
          const priority = this.calculatePriority(item.currentStock, rule.reorderPoint)
          const alert: ReorderAlert = {
            id: `alert-${Date.now()}-${item.id}`,
            inventoryItemId: item.id,
            itemName: item.name,
            itemNameAmharic: item.nameAmharic,
            currentStock: item.currentStock,
            reorderPoint: rule.reorderPoint,
            reorderQuantity: rule.reorderQuantity,
            supplierId: rule.preferredSupplierId,
            supplierName: rule.preferredSupplierName,
            priority,
            status: "pending",
            alertDate: new Date(),
            isAcknowledged: false,
          }

          this.reorderAlerts.push(alert)
          newAlerts.push(alert)

          // Auto-create purchase order if enabled
          if (rule.autoOrder && this.config.autoCreatePurchaseOrders) {
            this.createAutoPurchaseOrder(alert, rule)
          }
        }
      }
    })

    return newAlerts
  }

  private calculatePriority(currentStock: number, reorderPoint: number): "low" | "medium" | "high" | "critical" {
    const ratio = currentStock / reorderPoint

    if (currentStock === 0) return "critical"
    if (ratio <= 0.25) return "critical"
    if (ratio <= 0.5) return "high"
    if (ratio <= 0.75) return "medium"
    return "low"
  }

  private async createAutoPurchaseOrder(alert: ReorderAlert, rule: ReorderRule): Promise<void> {
    try {
      const supplier = inventoryService.getSupplierById(rule.preferredSupplierId)
      if (!supplier) return

      const item = inventoryService.getInventoryItemById(alert.inventoryItemId)
      if (!item) return

      const totalAmount = rule.reorderQuantity * item.unitPrice

      // Check approval threshold
      if (this.config.requireApproval && totalAmount > this.config.approvalThreshold) {
        alert.notes = `Auto-order requires approval (Amount: ${totalAmount.toFixed(2)} ብር)`
        return
      }

      const purchaseOrder = inventoryService.createPurchaseOrder({
        supplierId: supplier.id,
        supplierName: supplier.name,
        items: [
          {
            inventoryItemId: item.id,
            itemName: item.name,
            quantity: rule.reorderQuantity,
            unitPrice: item.unitPrice,
            totalPrice: totalAmount,
          },
        ],
        totalAmount,
        status: "draft",
        orderDate: new Date(),
        expectedDeliveryDate: new Date(Date.now() + rule.leadTimeDays * 24 * 60 * 60 * 1000),
        notes: `Auto-generated reorder for ${item.nameAmharic}`,
        createdBy: "Auto Reorder System",
      })

      // Update alert with purchase order info
      alert.purchaseOrderId = purchaseOrder.id
      alert.status = "ordered"
      alert.expectedDeliveryDate = purchaseOrder.expectedDeliveryDate

      // Add to reorder history
      this.reorderHistory.push({
        id: `history-${Date.now()}`,
        inventoryItemId: item.id,
        itemName: item.name,
        reorderQuantity: rule.reorderQuantity,
        supplierId: supplier.id,
        supplierName: supplier.name,
        orderDate: new Date(),
        cost: totalAmount,
        status: "ordered",
        notes: "Auto-generated purchase order",
      })

      // Update rule's last reorder date
      rule.lastReorderDate = new Date()
    } catch (error) {
      console.error("Failed to create auto purchase order:", error)
      alert.notes = `Auto-order failed: ${error}`
    }
  }

  // Reorder Alerts Management
  getAllReorderAlerts(): ReorderAlert[] {
    return this.reorderAlerts.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  getPendingReorderAlerts(): ReorderAlert[] {
    return this.reorderAlerts.filter((alert) => alert.status === "pending")
  }

  acknowledgeAlert(alertId: string): boolean {
    const alert = this.reorderAlerts.find((a) => a.id === alertId)
    if (!alert) return false

    alert.isAcknowledged = true
    return true
  }

  updateAlertStatus(alertId: string, status: ReorderAlert["status"], notes?: string): boolean {
    const alert = this.reorderAlerts.find((a) => a.id === alertId)
    if (!alert) return false

    alert.status = status
    if (notes) alert.notes = notes
    return true
  }

  // Reorder Suggestions
  getReorderSuggestions(): ReorderSuggestion[] {
    const inventoryItems = inventoryService.getAllInventoryItems()
    const suggestions: ReorderSuggestion[] = []

    inventoryItems.forEach((item) => {
      const rule = this.getReorderRuleByItemId(item.id)
      if (!rule) return

      // Calculate average consumption (mock calculation)
      const averageConsumption = this.calculateAverageConsumption(item.id)
      const daysUntilStockout = item.currentStock / Math.max(averageConsumption, 1)

      if (daysUntilStockout <= rule.leadTimeDays * 1.5) {
        const urgency =
          daysUntilStockout <= rule.leadTimeDays
            ? "critical"
            : daysUntilStockout <= rule.leadTimeDays * 1.2
              ? "high"
              : "medium"

        suggestions.push({
          inventoryItemId: item.id,
          itemName: item.name,
          itemNameAmharic: item.nameAmharic,
          currentStock: item.currentStock,
          reorderPoint: rule.reorderPoint,
          suggestedQuantity: rule.reorderQuantity,
          estimatedCost: rule.reorderQuantity * item.unitPrice,
          supplierId: rule.preferredSupplierId,
          supplierName: rule.preferredSupplierName,
          urgency,
          reason: `Stock will run out in ${Math.ceil(daysUntilStockout)} days`,
          lastOrderDate: rule.lastReorderDate,
          averageConsumption,
        })
      }
    })

    return suggestions.sort((a, b) => {
      const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
    })
  }

  private calculateAverageConsumption(itemId: string): number {
    // Mock calculation - in real implementation, this would analyze stock movements
    const movements = inventoryService.getStockMovements(itemId)
    const outMovements = movements.filter((m) => m.type === "out")

    if (outMovements.length === 0) return 1

    const totalOut = outMovements.reduce((sum, m) => sum + m.quantity, 0)
    const days = Math.max(
      1,
      (Date.now() - outMovements[outMovements.length - 1].performedAt.getTime()) / (1000 * 60 * 60 * 24),
    )

    return totalOut / days
  }

  // Reorder History
  getReorderHistory(): ReorderHistory[] {
    return this.reorderHistory.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime())
  }

  // Manual Reorder
  createManualReorder(itemId: string, quantity: number, supplierId: string, notes?: string): boolean {
    const item = inventoryService.getInventoryItemById(itemId)
    const supplier = inventoryService.getSupplierById(supplierId)

    if (!item || !supplier) return false

    const totalAmount = quantity * item.unitPrice

    try {
      const purchaseOrder = inventoryService.createPurchaseOrder({
        supplierId: supplier.id,
        supplierName: supplier.name,
        items: [
          {
            inventoryItemId: item.id,
            itemName: item.name,
            quantity,
            unitPrice: item.unitPrice,
            totalPrice: totalAmount,
          },
        ],
        totalAmount,
        status: "draft",
        orderDate: new Date(),
        expectedDeliveryDate: new Date(Date.now() + this.config.defaultLeadTimeDays * 24 * 60 * 60 * 1000),
        notes: notes || `Manual reorder for ${item.nameAmharic}`,
        createdBy: "Manual Order",
      })

      // Add to reorder history
      this.reorderHistory.push({
        id: `history-${Date.now()}`,
        inventoryItemId: item.id,
        itemName: item.name,
        reorderQuantity: quantity,
        supplierId: supplier.id,
        supplierName: supplier.name,
        orderDate: new Date(),
        cost: totalAmount,
        status: "ordered",
        notes: notes || "Manual reorder",
      })

      return true
    } catch (error) {
      console.error("Failed to create manual reorder:", error)
      return false
    }
  }

  // Analytics
  getReorderAnalytics() {
    const alerts = this.getAllReorderAlerts()
    const history = this.getReorderHistory()
    const rules = this.getAllReorderRules()

    return {
      totalAlerts: alerts.length,
      pendingAlerts: alerts.filter((a) => a.status === "pending").length,
      criticalAlerts: alerts.filter((a) => a.priority === "critical").length,
      totalReorders: history.length,
      successfulReorders: history.filter((h) => h.status === "delivered").length,
      totalReorderValue: history.reduce((sum, h) => sum + h.cost, 0),
      activeRules: rules.length,
      autoOrderRules: rules.filter((r) => r.autoOrder).length,
      averageLeadTime: rules.reduce((sum, r) => sum + r.leadTimeDays, 0) / Math.max(rules.length, 1),
    }
  }
}

export const autoReorderService = new AutoReorderService()
