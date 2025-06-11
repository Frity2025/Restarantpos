import { FoodCard } from "./food-card"
import { foodItems } from "@/config/restaurant-config"

export function FoodGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {foodItems.map((item, index) => (
        <FoodCard key={index} {...item} />
      ))}
    </div>
  )
}
