"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { translations, type Language, type TranslationKey } from "@/lib/i18n/translations"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey) => string
  formatCurrency: (amount: number) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("am") // Default to Amharic

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem("restaurant-language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "am")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("restaurant-language", newLanguage)
  }

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key
  }

  const formatCurrency = (amount: number): string => {
    const formattedAmount = new Intl.NumberFormat("en-US").format(amount)
    return language === "am" ? `${formattedAmount} ብር` : `${formattedAmount} ETB`
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, formatCurrency }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
