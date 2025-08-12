export function formatCurrency(amount: number, language: "en" | "am" = "am"): string {
  const formattedAmount = new Intl.NumberFormat("en-US").format(amount)
  return language === "am" ? `${formattedAmount} ብር` : `${formattedAmount} ETB`
}

export function parseCurrency(currencyString: string): number {
  // Remove currency symbols and parse the number
  const cleanString = currencyString.replace(/[^\d.,]/g, "").replace(/,/g, "")
  return Number.parseFloat(cleanString) || 0
}
