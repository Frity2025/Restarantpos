"use client"

import { foodItems } from "@/config/restaurant-config"
import { FoodCard } from "./food-card"

interface FoodGridProps {
  selectedCategory: string
  onAddToCart: (item: any) => void
}

export function FoodGrid({ selectedCategory, onAddToCart }: FoodGridProps) {
  const filteredItems =
    selectedCategory === "all" ? foodItems : foodItems.filter((item) => item.category === selectedCategory)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredItems.map((item) => (
        <FoodCard key={item.id} item={item} onAddToCart={onAddToCart} />
      ))}
    </div>
  )
}
