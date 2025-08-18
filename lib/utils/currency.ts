import type { Language } from "@/lib/i18n/translations"

export function formatCurrency(amount: number, language: Language = "en"): string {
  const formattedAmount = new Intl.NumberFormat("en-US").format(amount)

  if (language === "am") {
    return `${formattedAmount} ብር`
  }

  return `${formattedAmount} ETB`
}

export function parseCurrency(value: string): number {
  // Remove currency symbols and parse
  const cleanValue = value.replace(/[^\d.-]/g, "")
  return Number.parseFloat(cleanValue) || 0
}
