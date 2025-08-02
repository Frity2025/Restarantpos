"use client"

import { Button } from "@/components/ui/button"
import { Utensils, Coffee, Cake, Salad, Pizza, Star } from "lucide-react"

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { id: "all", name: "All Items", nameAmharic: "ሁሉም", icon: Utensils, color: "bg-gray-100" },
  { id: "appetizers", name: "Appetizers", nameAmharic: "ክፍተት ምግቦች", icon: Salad, color: "bg-green-100" },
  { id: "main-dishes", name: "Main Dishes", nameAmharic: "ዋና ምግቦች", icon: Pizza, color: "bg-orange-100" },
  { id: "sides", name: "Sides", nameAmharic: "ተጨማሪ", icon: Utensils, color: "bg-blue-100" },
  { id: "desserts", name: "Desserts", nameAmharic: "ጣፋጭ ምግቦች", icon: Cake, color: "bg-pink-100" },
  { id: "beverages", name: "Beverages", nameAmharic: "መጠጦች", icon: Coffee, color: "bg-purple-100" },
  { id: "specials", name: "Specials", nameAmharic: "ልዩ ምግቦች", icon: Star, color: "bg-yellow-100" },
]

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-sm text-muted-foreground">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon
          const isSelected = selectedCategory === category.id

          return (
            <Button
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center gap-2 ${isSelected ? "" : "bg-transparent hover:bg-gray-50"}`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{category.nameAmharic}</span>
              <span className="sm:hidden">{category.name}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
