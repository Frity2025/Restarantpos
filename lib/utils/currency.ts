export function formatCurrency(amount: number, language: "en" | "am" = "am"): string {
  const formatted = new Intl.NumberFormat("en-US").format(amount)
  const currency = language === "am" ? "ብር" : "ETB"
  return `${formatted} ${currency}`
}

export function parseCurrency(currencyString: string): number {
  // Remove currency symbols and parse the number
  const cleaned = currencyString.replace(/[^\d.-]/g, "")
  return Number.parseFloat(cleaned) || 0
}

export const CURRENCY_SYMBOL = {
  en: "ETB",
  am: "ብር",
}
