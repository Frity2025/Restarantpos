export interface BarcodeData {
  code: string
  format: "CODE_128" | "EAN_13" | "UPC_A" | "QR_CODE"
  data: string
}

export class BarcodeGenerator {
  static generateProductBarcode(productId: string, category: string): string {
    // Generate a unique barcode for products
    const categoryCode = this.getCategoryCode(category)
    const timestamp = Date.now().toString().slice(-6)
    const productCode = productId.slice(-3).padStart(3, "0")

    return `${categoryCode}${productCode}${timestamp}`
  }

  static generateInventoryBarcode(itemId: string, supplierId: string): string {
    // Generate barcode for inventory items
    const supplierCode = supplierId.slice(-2).padStart(2, "0")
    const itemCode = itemId.slice(-4).padStart(4, "0")
    const checksum = this.calculateChecksum(`${supplierCode}${itemCode}`)

    return `${supplierCode}${itemCode}${checksum}`
  }

  static generateOrderBarcode(orderId: string): string {
    // Generate barcode for orders
    const orderCode = orderId.slice(-6).padStart(6, "0")
    const timestamp = Date.now().toString().slice(-4)

    return `ORD${orderCode}${timestamp}`
  }

  private static getCategoryCode(category: string): string {
    const categoryMap: Record<string, string> = {
      appetizers: "01",
      "main-dishes": "02",
      desserts: "03",
      beverages: "04",
      sides: "05",
      specials: "06",
    }

    return categoryMap[category.toLowerCase()] || "99"
  }

  private static calculateChecksum(code: string): string {
    let sum = 0
    for (let i = 0; i < code.length; i++) {
      sum += Number.parseInt(code[i]) * (i + 1)
    }
    return (sum % 10).toString()
  }

  static validateBarcode(barcode: string): boolean {
    // Basic barcode validation
    if (!barcode || barcode.length < 6) return false

    // Check if it's a valid format (numbers only for most formats)
    return /^\d+$/.test(barcode) || /^[A-Z0-9]+$/.test(barcode)
  }

  static parseBarcode(barcode: string): { type: string; id: string } | null {
    if (!this.validateBarcode(barcode)) return null

    // Parse different barcode types
    if (barcode.startsWith("ORD")) {
      return { type: "order", id: barcode.slice(3, 9) }
    }

    if (barcode.length >= 10) {
      const categoryCode = barcode.slice(0, 2)
      const productCode = barcode.slice(2, 5)
      return { type: "product", id: productCode }
    }

    if (barcode.length >= 8) {
      const supplierCode = barcode.slice(0, 2)
      const itemCode = barcode.slice(2, 6)
      return { type: "inventory", id: itemCode }
    }

    return { type: "unknown", id: barcode }
  }
}
