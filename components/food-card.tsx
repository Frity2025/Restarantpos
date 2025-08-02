"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import type { FoodItem } from "@/lib/food-management"

interface FoodCardProps {
  food: FoodItem
}

export function FoodCard({ food }: FoodCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: food.id,
      name: food.name,
      price: food.price,
      quantity: 1,
      image: food.image,
    })
  }

  const getSpicyLevelDisplay = (level: number) => {
    if (level === 0) return null
    return "🌶️".repeat(level)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-100 relative">
        {food.image ? (
          <img src={food.image || "/placeholder.svg"} alt={food.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        {food.spicyLevel > 0 && (
          <Badge className="absolute top-2 right-2 bg-red-100 text-red-800">
            {getSpicyLevelDisplay(food.spicyLevel)}
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{food.name}</CardTitle>
            <p className="text-sm text-gray-500">{food.nameEn}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-green-600">{food.price} ብር</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {food.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{food.description}</p>}

        <div className="flex items-center justify-between mb-3">
          {food.preparationTime && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {food.preparationTime} ደቂቃ
            </div>
          )}
          <div className="flex gap-1">
            {food.isVegetarian && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                ቬጀቴሪያን
              </Badge>
            )}
            {food.isVegan && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                ቪጋን
              </Badge>
            )}
          </div>
        </div>

        <Button onClick={handleAddToCart} className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          ወደ ጋሪ ጨምር
        </Button>
      </CardContent>
    </Card>
  )
}
