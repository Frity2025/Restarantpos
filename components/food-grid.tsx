"use client"

import { FoodCard } from "./food-card"
import { foodItems } from "@/config/restaurant-config"

interface FoodGridProps {
  selectedCategory: string
}

export function FoodGrid({ selectedCategory }: FoodGridProps) {
  const filteredItems =
    selectedCategory === "ሁሉም" ? foodItems : foodItems.filter((item) => item.category === selectedCategory)

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <FoodCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
