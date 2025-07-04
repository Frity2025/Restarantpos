"use client"

import { Button } from "@/components/ui/button"
import { foodCategories } from "@/config/restaurant-config"
import { Cookie, Utensils, Coffee, Cake } from "lucide-react"

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const iconMap = {
  cookie: Cookie,
  utensils: Utensils,
  coffee: Coffee,
  cake: Cake,
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedCategory === "all" ? "default" : "outline"}
        onClick={() => onCategoryChange("all")}
        className="mb-2"
      >
        ሁሉም
      </Button>
      {foodCategories.map((category) => {
        const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Utensils
        const isSelected = selectedCategory === category.id

        return (
          <Button
            key={category.id}
            variant={isSelected ? "default" : "outline"}
            onClick={() => onCategoryChange(category.id)}
            className="mb-2"
          >
            <IconComponent className="h-4 w-4 mr-2" />
            {category.name}
          </Button>
        )
      })}
    </div>
  )
}
