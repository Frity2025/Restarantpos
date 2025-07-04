"use client"

import { FoodCard } from "./food-card"
import { foodManager } from "@/lib/food-management"
import { useState, useEffect } from "react"

export function FoodGrid() {
  const [foods, setFoods] = useState(foodManager.getAllFoods())
  const [selectedCategory, setSelectedCategory] = useState("ሁሉም")

  useEffect(() => {
    setFoods(foodManager.getFoodsByCategory(selectedCategory))
  }, [selectedCategory])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {foods.map((item, index) => (
        <FoodCard key={item.id || index} {...item} />
      ))}
    </div>
  )
}
