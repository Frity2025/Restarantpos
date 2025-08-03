import { inventoryService } from "@/lib/inventory-management"
import type { Order } from "@/types/order"

export interface SalesReport {
  period: string
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  topSellingItems: Array<{
    itemId: string
    itemName: string
    itemNameAmharic: string
    quantitySold: number
    revenue: number
  }>
  salesByCategory: Array<{
    categoryId: string
    categoryName: string
    categoryNameAmharic: string
    totalSales: number
    orderCount: number
  }>
  salesByHour: Array<{
    hour: number
    sales: number
    orders: number
  }>
  salesByDay: Array<{
    date: string
    sales: number
    orders: number
  }>
}

export interface InventoryReport {
  totalItems: number
  totalValue: number
  lowStockItems: number
  outOfStockItems: number
  topValueItems: Array<{
    itemId: string
    itemName: string
    itemNameAmharic: string
    currentStock: number
    value: number
  }>
  categoryBreakdown: Array<{
    categoryId: string
    categoryName: string
    categoryNameAmharic: string
    itemCount: number
    totalValue: number
  }>
  stockMovements: Array<{
    date: string
    stockIn: number
    stockOut: number
    netChange: number
  }>
}

export interface FinancialReport {
  period: string
  totalRevenue: number
  totalCosts: number
  grossProfit: number
  profitMargin: number
  revenueByPaymentMethod: Array<{
    method: string
    amount: number
    percentage: number
  }>
  monthlyTrends: Array<{
    month: string
    revenue: number
    costs: number
    profit: number
  }>
}

export interface OperationalReport {
  totalEmployees: number
  activeOrders: number
  completedOrders: number
  averageOrderTime: number
  kitchenEfficiency: number
  tableUtilization: number
  customerSatisfaction: number
  peakHours: Array<{
    hour: number
    orderCount: number
    efficiency: number
  }>
}

const formatCurrency = (amount: number, language: "en" | "am" = "am"): string => {
  const formattedAmount = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  if (language === "am") {
    return `${formattedAmount} ብር`
  } else {
    return `${formattedAmount} ETB`
  }
}

class ReportingService {
  private mockOrders: Order[] = []
  private mockSalesData: any[] = []

  constructor() {
    this.generateMockData()
  }

  private generateMockData() {
    // Generate mock sales data for the last 30 days
    const today = new Date()
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const dailySales = Math.floor(Math.random() * 50000) + 20000 // 20k-70k daily sales
      const dailyOrders = Math.floor(Math.random() * 100) + 50 // 50-150 orders per day

      this.mockSalesData.push({
        date: date.toISOString().split("T")[0],
        sales: dailySales,
        orders: dailyOrders,
        averageOrderValue: dailySales / dailyOrders,
      })
    }
  }

  generateSalesReport(startDate: Date, endDate: Date): SalesReport {
    const filteredData = this.mockSalesData.filter((data) => {
      const dataDate = new Date(data.date)
      return dataDate >= startDate && dataDate <= endDate
    })

    const totalSales = filteredData.reduce((sum, data) => sum + data.sales, 0)
    const totalOrders = filteredData.reduce((sum, data) => sum + data.orders, 0)
    const averageOrderValue = totalSales / Math.max(totalOrders, 1)

    // Mock top selling items
    const topSellingItems = [
      {
        itemId: "1",
        itemName: "Injera with Doro Wot",
        itemNameAmharic: "እንጀራ ከዶሮ ወጥ ጋር",
        quantitySold: 245,
        revenue: 61250,
      },
      { itemId: "2", itemName: "Kitfo", itemNameAmharic: "ክትፎ", quantitySold: 189, revenue: 56700 },
      { itemId: "3", itemName: "Vegetarian Combo", itemNameAmharic: "የጾም ምግብ ጥምረት", quantitySold: 167, revenue: 41750 },
      { itemId: "4", itemName: "Tibs", itemNameAmharic: "ጥብስ", quantitySold: 134, revenue: 40200 },
      { itemId: "5", itemName: "Shiro", itemNameAmharic: "ሽሮ", quantitySold: 123, revenue: 24600 },
    ]

    // Mock sales by category
    const salesByCategory = [
      {
        categoryId: "1",
        categoryName: "Main Dishes",
        categoryNameAmharic: "ዋና ምግቦች",
        totalSales: totalSales * 0.6,
        orderCount: Math.floor(totalOrders * 0.6),
      },
      {
        categoryId: "2",
        categoryName: "Beverages",
        categoryNameAmharic: "መጠጦች",
        totalSales: totalSales * 0.2,
        orderCount: Math.floor(totalOrders * 0.3),
      },
      {
        categoryId: "3",
        categoryName: "Desserts",
        categoryNameAmharic: "ጣፋጭ ምግቦች",
        totalSales: totalSales * 0.1,
        orderCount: Math.floor(totalOrders * 0.15),
      },
      {
        categoryId: "4",
        categoryName: "Appetizers",
        categoryNameAmharic: "ክፍተት ሙሊዎች",
        totalSales: totalSales * 0.1,
        orderCount: Math.floor(totalOrders * 0.2),
      },
    ]

    // Mock hourly sales
    const salesByHour = Array.from({ length: 24 }, (_, hour) => {
      let multiplier = 0.1 // Base multiplier
      if (hour >= 12 && hour <= 14) multiplier = 1.5 // Lunch peak
      if (hour >= 18 && hour <= 21) multiplier = 2.0 // Dinner peak
      if (hour >= 7 && hour <= 9) multiplier = 0.8 // Breakfast

      return {
        hour,
        sales: Math.floor((totalSales * multiplier) / 24),
        orders: Math.floor((totalOrders * multiplier) / 24),
      }
    })

    return {
      period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      totalSales,
      totalOrders,
      averageOrderValue,
      topSellingItems,
      salesByCategory,
      salesByHour,
      salesByDay: filteredData.map((data) => ({
        date: data.date,
        sales: data.sales,
        orders: data.orders,
      })),
    }
  }

  generateInventoryReport(): InventoryReport {
    const inventoryItems = inventoryService.getAllInventoryItems()
    const categories = inventoryService.getAllCategories()

    const totalItems = inventoryItems.length
    const totalValue = inventoryItems.reduce((sum, item) => sum + item.currentStock * item.unitPrice, 0)
    const lowStockItems = inventoryItems.filter((item) => item.currentStock <= item.minStockLevel).length
    const outOfStockItems = inventoryItems.filter((item) => item.currentStock === 0).length

    const topValueItems = inventoryItems
      .map((item) => ({
        itemId: item.id,
        itemName: item.name,
        itemNameAmharic: item.nameAmharic,
        currentStock: item.currentStock,
        value: item.currentStock * item.unitPrice,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)

    const categoryBreakdown = categories.map((category) => {
      const categoryItems = inventoryItems.filter((item) => item.category.id === category.id)
      return {
        categoryId: category.id,
        categoryName: category.name,
        categoryNameAmharic: category.nameAmharic,
        itemCount: categoryItems.length,
        totalValue: categoryItems.reduce((sum, item) => sum + item.currentStock * item.unitPrice, 0),
      }
    })

    // Mock stock movements for last 7 days
    const stockMovements = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return {
        date: date.toISOString().split("T")[0],
        stockIn: Math.floor(Math.random() * 1000) + 500,
        stockOut: Math.floor(Math.random() * 800) + 400,
        netChange: Math.floor(Math.random() * 400) - 200,
      }
    }).reverse()

    return {
      totalItems,
      totalValue,
      lowStockItems,
      outOfStockItems,
      topValueItems,
      categoryBreakdown,
      stockMovements,
    }
  }

  generateFinancialReport(startDate: Date, endDate: Date): FinancialReport {
    const salesReport = this.generateSalesReport(startDate, endDate)
    const inventoryReport = this.generateInventoryReport()

    const totalRevenue = salesReport.totalSales
    const totalCosts = totalRevenue * 0.65 // Assume 65% cost ratio
    const grossProfit = totalRevenue - totalCosts
    const profitMargin = (grossProfit / totalRevenue) * 100

    const revenueByPaymentMethod = [
      { method: "ጥሬ ገንዘብ", amount: totalRevenue * 0.4, percentage: 40 },
      { method: "ካርድ", amount: totalRevenue * 0.35, percentage: 35 },
      { method: "ሞባይል ገንዘብ", amount: totalRevenue * 0.25, percentage: 25 },
    ]

    // Mock monthly trends for last 6 months
    const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthRevenue = Math.floor(Math.random() * 200000) + 800000
      const monthCosts = monthRevenue * 0.65

      return {
        month: date.toLocaleDateString("am-ET", { month: "long", year: "numeric" }),
        revenue: monthRevenue,
        costs: monthCosts,
        profit: monthRevenue - monthCosts,
      }
    }).reverse()

    return {
      period: salesReport.period,
      totalRevenue,
      totalCosts,
      grossProfit,
      profitMargin,
      revenueByPaymentMethod,
      monthlyTrends,
    }
  }

  generateOperationalReport(): OperationalReport {
    // Mock operational data
    return {
      totalEmployees: 12,
      activeOrders: 8,
      completedOrders: 156,
      averageOrderTime: 18.5, // minutes
      kitchenEfficiency: 87.3, // percentage
      tableUtilization: 73.2, // percentage
      customerSatisfaction: 4.6, // out of 5
      peakHours: [
        { hour: 12, orderCount: 45, efficiency: 92 },
        { hour: 13, orderCount: 52, efficiency: 88 },
        { hour: 19, orderCount: 67, efficiency: 85 },
        { hour: 20, orderCount: 71, efficiency: 82 },
      ],
    }
  }

  exportReport(reportType: string, data: any): string {
    // In a real implementation, this would generate CSV/PDF files
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `${reportType}_report_${timestamp}.json`

    // Mock export - in reality, this would create actual files
    console.log(`Exporting ${reportType} report to ${filename}`)
    console.log(JSON.stringify(data, null, 2))

    return filename
  }

  getReportSummary() {
    const today = new Date()
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const weeklySales = this.generateSalesReport(lastWeek, today)
    const monthlySales = this.generateSalesReport(lastMonth, today)
    const inventory = this.generateInventoryReport()
    const operational = this.generateOperationalReport()

    return {
      weeklySales: {
        total: weeklySales.totalSales,
        orders: weeklySales.totalOrders,
        average: weeklySales.averageOrderValue,
      },
      monthlySales: {
        total: monthlySales.totalSales,
        orders: monthlySales.totalOrders,
        average: monthlySales.averageOrderValue,
      },
      inventory: {
        totalValue: inventory.totalValue,
        lowStock: inventory.lowStockItems,
        outOfStock: inventory.outOfStockItems,
      },
      operational: {
        efficiency: operational.kitchenEfficiency,
        satisfaction: operational.customerSatisfaction,
        utilization: operational.tableUtilization,
      },
    }
  }
}

export const reportingService = new ReportingService()
