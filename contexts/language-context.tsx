"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { translations, getNestedValue } from "@/lib/i18n/translations"

type Language = "am" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string>) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("am")

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("restaurant-language") as Language
    if (savedLanguage && (savedLanguage === "am" || savedLanguage === "en")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("restaurant-language", lang)

    // Update document direction and language
    document.documentElement.lang = lang
    document.documentElement.dir = lang === "am" ? "ltr" : "ltr" // Both are LTR for now
  }

  const t = (key: string, params?: Record<string, string>): string => {
    const translation = getNestedValue(translations[language], key)

    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`)
      return key
    }

    // Replace parameters in translation
    if (params) {
      return Object.entries(params).reduce((text, [param, value]) => text.replace(`{{${param}}}`, value), translation)
    }

    return translation
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL: false, // Both Amharic and English are LTR in this implementation
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
