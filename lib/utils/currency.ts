export function formatCurrency(amount: number, language: "en" | "am" = "en"): string {
  const formatted = new Intl.NumberFormat("en-US").format(amount)
  const symbol = language === "am" ? "ብር" : "ETB"
  return `${formatted} ${symbol}`
}

export function parseCurrency(currencyString: string): number {
  // Remove currency symbols and parse
  const cleaned = currencyString.replace(/[^\d.-]/g, "")
  return Number.parseFloat(cleaned) || 0
}
