"use client"

import { useState, useEffect } from "react"
import { FoodCard } from "./food-card"
import { CategoryFilter } from "./category-filter"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { foodManager } from "@/lib/food-management"
import { waitlistManager } from "@/lib/waitlist-management"
import { tableManager } from "@/lib/table-management"
import type { Food } from "@/types/order"
import { AlertCircle, UserPlus } from "lucide-react"

interface FoodGridProps {
  onAddToCart: (food: Food) => void
}

export function FoodGrid({ onAddToCart }: FoodGridProps) {
  const [foods, setFoods] = useState<Food[]>([])
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showWaitlistAlert, setShowWaitlistAlert] = useState(false)

  useEffect(() => {
    const allFoods = foodManager.getAllFoods()
    setFoods(allFoods)
    setFilteredFoods(allFoods)

    // ክፍት ጠረጴዛዎች ማረጋገጥ
    checkTableAvailability()
  }, [])

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredFoods(foods)
    } else {
      setFilteredFoods(foods.filter((food) => food.category === selectedCategory))
    }
  }, [selectedCategory, foods])

  const checkTableAvailability = () => {
    const availableTables = tableManager.getTablesByStatus("available")
    const waitingCustomers = waitlistManager.getWaitingEntries().length

    // ክፍት ጠረጴዛዎች ከሌሉ እና በጥበቃ ዝርዝር ውስጥ ደንበኞች ካሉ ማሳወቂያ አሳይ
    if (availableTables.length === 0 && waitingCustomers > 0) {
      setShowWaitlistAlert(true)
    } else {
      setShowWaitlistAlert(false)
    }
  }

  const handleAddToWaitlist = () => {
    // ወደ ጥበቃ ዝርዝር ማከል ሎጂክ - በእውነተኛ አፕሊኬሽን ውስጥ ይህ ሞዳል ወይም ፎርም ይከፍታል
    console.log("ወደ ጥበቃ ዝርዝር ማከል...")
  }

  const categories = [
    { id: "all", name: "ሁሉም", count: foods.length },
    ...Array.from(new Set(foods.map((food) => food.category))).map((category) => ({
      id: category,
      name: category,
      count: foods.filter((food) => food.category === category).length,
    })),
  ]

  return (
    <div className="space-y-6">
      {/* የጥበቃ ዝርዝር ማሳወቂያ */}
      {showWaitlistAlert && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="flex items-center justify-between">
              <span>ሁሉም ጠረጴዛዎች ተይዘዋል። ደንበኞች ወደ ጥበቃ ዝርዝር ሊጨመሩ ይችላሉ።</span>
              <Button size="sm" variant="outline" onClick={handleAddToWaitlist} className="ml-4 bg-transparent">
                <UserPlus className="h-4 w-4 mr-2" />
                ወደ ጥበቃ ዝርዝር ጨምር
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFoods.map((food) => (
          <FoodCard key={food.id} food={food} onAddToCart={onAddToCart} />
        ))}
      </div>

      {filteredFoods.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">በዚህ ምድብ ውስጥ ምግብ አልተገኘም</p>
        </div>
      )}
    </div>
  )
}
