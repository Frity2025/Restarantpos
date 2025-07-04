import type { Order, OrderItem, OrderStatus, PaymentStatus, OrderType, OrderStats, OrderFilter } from "@/types/order"

// ናሙና ትዕዛዞች
const orders: Order[] = [
  {
    id: "order-001",
    orderNumber: "ORD-001",
    tableNumber: "4",
    customerName: "ፍሎይድ ማይልስ",
    customerPhone: "+251911123456",
    orderType: "dine_in",
    items: [
      {
        id: "item-001",
        foodId: "injera-doro",
        foodName: "እንጀራ በዶሮ ወጥ",
        foodImage: "/placeholder.svg?height=200&width=300",
        price: 250.0,
        quantity: 1,
        totalPrice: 250.0,
      },
      {
        id: "item-002",
        foodId: "fresh-juice",
        foodName: "ትኩስ ጭማቂ",
        foodImage: "/placeholder.svg?height=200&width=300",
        price: 60.0,
        quantity: 2,
        totalPrice: 120.0,
      },
    ],
    subtotal: 370.0,
    tax: 18.5,
    discount: 0,
    totalAmount: 388.5,
    status: "preparing",
    paymentStatus: "pending",
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 ደቂቃ በፊት
    updatedAt: new Date(Date.now() - 15 * 60 * 1000),
    estimatedTime: 25,
    employeeId: "emp-003",
    employeeName: "ዳዊት ተስፋዬ",
    kitchenNotes: "ቅመም ቀንሶ",
  },
  {
    id: "order-002",
    orderNumber: "ORD-002",
    tableNumber: "2",
    customerName: "ሳራ አህመድ",
    orderType: "dine_in",
    items: [
      {
        id: "item-003",
        foodId: "kitfo",
        foodName: "ክትፎ",
        foodImage: "/placeholder.svg?height=200&width=300",
        price: 300.0,
        quantity: 1,
        totalPrice: 300.0,
      },
    ],
    subtotal: 300.0,
    tax: 15.0,
    discount: 30.0, // 10% ቅናሽ
    totalAmount: 285.0,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "cash",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 ሰዓት በፊት
    updatedAt: new Date(Date.now() - 90 * 60 * 1000),
    completedAt: new Date(Date.now() - 90 * 60 * 1000),
    estimatedTime: 15,
    actualTime: 18,
    employeeId: "emp-004",
    employeeName: "ሄለን ገብረ",
  },
  {
    id: "order-003",
    orderNumber: "ORD-003",
    customerName: "ሚካኤል ተክለ",
    customerPhone: "+251911987654",
    customerAddress: "አዲስ አበባ፣ ቦሌ",
    orderType: "delivery",
    items: [
      {
        id: "item-004",
        foodId: "shiro",
        foodName: "ሽሮ",
        foodImage: "/placeholder.svg?height=200&width=300",
        price: 120.0,
        quantity: 2,
        totalPrice: 240.0,
      },
      {
        id: "item-005",
        foodId: "coffee",
        foodName: "ቡና",
        foodImage: "/placeholder.svg?height=200&width=300",
        price: 40.0,
        quantity: 1,
        totalPrice: 40.0,
      },
    ],
    subtotal: 280.0,
    tax: 14.0,
    discount: 0,
    totalAmount: 294.0,
    status: "ready",
    paymentStatus: "paid",
    paymentMethod: "card",
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000),
    estimatedTime: 30,
    employeeId: "emp-002",
    employeeName: "ፋጢማ አህመድ",
    customerNotes: "ቶሎ ያድርሱ",
  },
]

// የትዕዛዝ አስተዳደር ክላስ
export class OrderManager {
  private static instance: OrderManager
  private orders: Order[] = [...orders]
  private orderCounter = 4

  static getInstance(): OrderManager {
    if (!OrderManager.instance) {
      OrderManager.instance = new OrderManager()
    }
    return OrderManager.instance
  }

  // አዲስ ትዕዛዝ መፍጠር
  createOrder(orderData: {
    tableNumber?: string
    customerName?: string
    customerPhone?: string
    customerAddress?: string
    orderType: OrderType
    items: OrderItem[]
    employeeId: string
    employeeName: string
    kitchenNotes?: string
    customerNotes?: string
  }): Order {
    const subtotal = orderData.items.reduce((sum, item) => sum + item.totalPrice, 0)
    const tax = subtotal * 0.05 // 5% ታክስ
    const discount = 0
    const totalAmount = subtotal + tax - discount

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: `ORD-${String(this.orderCounter++).padStart(3, "0")}`,
      ...orderData,
      subtotal,
      tax,
      discount,
      totalAmount,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedTime: this.calculateEstimatedTime(orderData.items),
    }

    this.orders.unshift(newOrder)
    return newOrder
  }

  // ትዕዛዝ ሁኔታ ማዘመን
  updateOrderStatus(orderId: string, status: OrderStatus): boolean {
    const order = this.orders.find((o) => o.id === orderId)
    if (!order) return false

    order.status = status
    order.updatedAt = new Date()

    if (status === "completed") {
      order.completedAt = new Date()
      order.actualTime = Math.floor((order.completedAt.getTime() - order.createdAt.getTime()) / (1000 * 60))
    }

    return true
  }

  // የክፍያ ሁኔታ ማዘመን
  updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus, paymentMethod?: string): boolean {
    const order = this.orders.find((o) => o.id === orderId)
    if (!order) return false

    order.paymentStatus = paymentStatus
    order.paymentMethod = paymentMethod
    order.updatedAt = new Date()

    return true
  }

  // ትዕዛዝ መሰረዝ
  cancelOrder(orderId: string, reason?: string): boolean {
    const order = this.orders.find((o) => o.id === orderId)
    if (!order) return false

    order.status = "cancelled"
    order.updatedAt = new Date()
    if (reason) {
      order.kitchenNotes = (order.kitchenNotes || "") + ` | የመሰረዝ ምክንያት: ${reason}`
    }

    return true
  }

  // ሁሉንም ትዕዛዞች ማግኘት
  getAllOrders(): Order[] {
    return this.orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // በማጣሪያ ትዕዛዞች ማግኘት
  getFilteredOrders(filter: OrderFilter): Order[] {
    let filteredOrders = this.orders

    if (filter.status && filter.status.length > 0) {
      filteredOrders = filteredOrders.filter((order) => filter.status!.includes(order.status))
    }

    if (filter.orderType && filter.orderType.length > 0) {
      filteredOrders = filteredOrders.filter((order) => filter.orderType!.includes(order.orderType))
    }

    if (filter.dateFrom) {
      filteredOrders = filteredOrders.filter((order) => order.createdAt >= filter.dateFrom!)
    }

    if (filter.dateTo) {
      filteredOrders = filteredOrders.filter((order) => order.createdAt <= filter.dateTo!)
    }

    if (filter.employeeId) {
      filteredOrders = filteredOrders.filter((order) => order.employeeId === filter.employeeId)
    }

    if (filter.tableNumber) {
      filteredOrders = filteredOrders.filter((order) => order.tableNumber === filter.tableNumber)
    }

    if (filter.customerName) {
      filteredOrders = filteredOrders.filter((order) =>
        order.customerName?.toLowerCase().includes(filter.customerName!.toLowerCase()),
      )
    }

    return filteredOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // በአይዲ ትዕዛዝ ማግኘት
  getOrderById(orderId: string): Order | null {
    return this.orders.find((order) => order.id === orderId) || null
  }

  // የትዕዛዝ ስታቲስቲክስ
  getOrderStats(dateFrom?: Date, dateTo?: Date): OrderStats {
    let filteredOrders = this.orders

    if (dateFrom) {
      filteredOrders = filteredOrders.filter((order) => order.createdAt >= dateFrom)
    }

    if (dateTo) {
      filteredOrders = filteredOrders.filter((order) => order.createdAt <= dateTo)
    }

    const totalOrders = filteredOrders.length
    const pendingOrders = filteredOrders.filter((o) => o.status === "pending" || o.status === "confirmed").length
    const completedOrders = filteredOrders.filter((o) => o.status === "completed").length
    const cancelledOrders = filteredOrders.filter((o) => o.status === "cancelled").length
    const totalRevenue = filteredOrders
      .filter((o) => o.status === "completed")
      .reduce((sum, order) => sum + order.totalAmount, 0)

    const averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0

    const completedOrdersWithTime = filteredOrders.filter((o) => o.status === "completed" && o.actualTime)
    const averagePreparationTime =
      completedOrdersWithTime.length > 0
        ? completedOrdersWithTime.reduce((sum, order) => sum + (order.actualTime || 0), 0) /
          completedOrdersWithTime.length
        : 0

    // በአይነት ትዕዛዞች
    const ordersByType: Record<OrderType, number> = {
      dine_in: filteredOrders.filter((o) => o.orderType === "dine_in").length,
      takeaway: filteredOrders.filter((o) => o.orderType === "takeaway").length,
      delivery: filteredOrders.filter((o) => o.orderType === "delivery").length,
    }

    // በሁኔታ ትዕዛዞች
    const ordersByStatus: Record<OrderStatus, number> = {
      pending: filteredOrders.filter((o) => o.status === "pending").length,
      confirmed: filteredOrders.filter((o) => o.status === "confirmed").length,
      preparing: filteredOrders.filter((o) => o.status === "preparing").length,
      ready: filteredOrders.filter((o) => o.status === "ready").length,
      served: filteredOrders.filter((o) => o.status === "served").length,
      completed: filteredOrders.filter((o) => o.status === "completed").length,
      cancelled: filteredOrders.filter((o) => o.status === "cancelled").length,
    }

    // በጣም የሚሸጡ ምግቦች
    const itemCounts: Record<string, { name: string; quantity: number; revenue: number }> = {}
    filteredOrders
      .filter((o) => o.status === "completed")
      .forEach((order) => {
        order.items.forEach((item) => {
          if (!itemCounts[item.foodId]) {
            itemCounts[item.foodId] = { name: item.foodName, quantity: 0, revenue: 0 }
          }
          itemCounts[item.foodId].quantity += item.quantity
          itemCounts[item.foodId].revenue += item.totalPrice
        })
      })

    const topSellingItems = Object.entries(itemCounts)
      .map(([foodId, data]) => ({
        foodId,
        foodName: data.name,
        quantity: data.quantity,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      averageOrderValue,
      averagePreparationTime,
      ordersByType,
      ordersByStatus,
      topSellingItems,
    }
  }

  // የዝግጅት ጊዜ ማስላት
  private calculateEstimatedTime(items: OrderItem[]): number {
    // ቀላል ስሌት - እያንዳንዱ ምግብ 10 ደቂቃ + ተጨማሪ ንጥሎች ለእያንዳንዱ 5 ደቂቃ
    const baseTime = 10
    const additionalTime = (items.reduce((sum, item) => sum + item.quantity, 0) - 1) * 5
    return Math.max(baseTime + additionalTime, 5)
  }
}

export const orderManager = OrderManager.getInstance()
