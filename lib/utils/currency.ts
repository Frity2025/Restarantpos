"use client"

import { useLanguage } from "@/contexts/language-context"

export function formatCurrency(amount: number, language: "en" | "am" = "am"): string {
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

export function useCurrency() {
  const { language } = useLanguage()

  return {
    format: (amount: number) => formatCurrency(amount, language),
    symbol: language === "am" ? "ብር" : "ETB",
  }
}
