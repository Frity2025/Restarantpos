export function formatCurrency(amount: number, language: "en" | "am" = "en"): string {
  const formatted = new Intl.NumberFormat("en-US").format(amount)
  const symbol = language === "am" ? "ብር" : "ETB"
  return `${formatted} ${symbol}`
}

export function parseCurrency(value: string): number {
  return Number.parseFloat(value.replace(/[^\d.-]/g, "")) || 0
}
