"use client"

import { Button } from "@/components/ui/button"
import { restaurantThemes } from "@/lib/theme-utils"
import { useState } from "react"

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState("default")

  const handleThemeChange = (themeName: string) => {
    setCurrentTheme(themeName)
    // በተግባር ላይ ሲውል ቴማውን ይቀይራል
    // updateThemeColors(restaurantThemes[themeName].primary, restaurantThemes[themeName].secondary)
  }

  return (
    <div className="p-4 border-t">
      <h3 className="font-medium mb-2">ቴማ ይምረጡ</h3>
      <div className="flex flex-wrap gap-2">
        {Object.keys(restaurantThemes).map((theme) => (
          <Button
            key={theme}
            variant={currentTheme === theme ? "default" : "outline"}
            size="sm"
            onClick={() => handleThemeChange(theme)}
          >
            {theme === "default"
              ? "መደበኛ"
              : theme === "ethiopian"
                ? "ኢትዮጵያዊ"
                : theme === "italian"
                  ? "ጣሊያናዊ"
                  : theme === "asian"
                    ? "እስያዊ"
                    : theme === "mexican"
                      ? "ሜክሲካዊ"
                      : theme}
          </Button>
        ))}
      </div>
    </div>
  )
}
