"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "am" : "en")
  }

  return (
    <Button variant="outline" size="sm" onClick={toggleLanguage} className="flex items-center space-x-2 bg-transparent">
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">{language === "en" ? "አማርኛ" : "English"}</span>
    </Button>
  )
}
