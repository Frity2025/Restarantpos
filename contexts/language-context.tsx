"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { translations, type Language, type TranslationKey } from "@/lib/i18n/translations"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey) => string
  formatCurrency: (amount: number) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[language][key] || key
    },
    [language],
  )

  const formatCurrency = useCallback(
    (amount: number): string => {
      const formatted = new Intl.NumberFormat("en-US").format(amount)
      const symbol = language === "am" ? "ብር" : "ETB"
      return `${formatted} ${symbol}`
    },
    [language],
  )

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatCurrency }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
