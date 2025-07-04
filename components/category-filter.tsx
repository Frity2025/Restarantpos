"use client"

import { Button } from "@/components/ui/button"
import { foodCategories } from "@/config/restaurant-config"

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">የምግብ ዓይነቶች</h3>
      <div className="flex flex-wrap gap-2">
        {foodCategories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
}
