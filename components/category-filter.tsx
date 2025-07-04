"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Grid, Cookie, Utensils, Coffee, Cake } from "lucide-react"
import { categories } from "@/config/restaurant-config"

const iconMap = {
  grid: Grid,
  cookie: Cookie,
  utensils: Utensils,
  coffee: Coffee,
  cake: Cake,
}

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">የምግብ ዓይነቶች</h3>
      <ScrollArea className="w-full">
        <div className="flex space-x-2 pb-2">
          {categories.map((category) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap]
            const isSelected = selectedCategory === category.id

            return (
              <Button
                key={category.id}
                variant={isSelected ? "default" : "outline"}
                className="flex items-center space-x-2 whitespace-nowrap"
                onClick={() => onCategoryChange(category.id)}
              >
                <Icon className="h-4 w-4" />
                <span>{category.name}</span>
              </Button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
