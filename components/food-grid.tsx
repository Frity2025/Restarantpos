"use client"

import { useState, useEffect } from "react"
import { FoodCard } from "./food-card"
import { foodItems, type FoodItem } from "@/lib/food-management"

interface FoodGridProps {
  selectedCategory: string
}

export function FoodGrid({ selectedCategory }: FoodGridProps) {
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([])

  useEffect(() => {
    let filtered = foodItems.filter((food) => food.available)

    if (selectedCategory !== "all") {
      filtered = filtered.filter((food) => food.category === selectedCategory)
    }

    setFilteredFoods(filtered)
  }, [selectedCategory])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredFoods.map((food) => (
        <FoodCard key={food.id} food={food} />
      ))}
    </div>
  )
}
