export function formatCurrency(amount: number, language: "en" | "am" = "en"): string {
  const formatted = new Intl.NumberFormat("en-US").format(amount)
  return language === "am" ? `${formatted} ብር` : `${formatted} ETB`
}

export function parseCurrency(currencyString: string): number {
  return Number.parseFloat(currencyString.replace(/[^\d.-]/g, ""))
}

export function calculateTax(amount: number, taxRate = 0.15): number {
  return amount * taxRate
}

export function calculateDiscount(amount: number, discountPercent: number): number {
  return amount * (discountPercent / 100)
}

export function calculateTotal(subtotal: number, tax = 0, discount = 0): number {
  return subtotal + tax - discount
}
