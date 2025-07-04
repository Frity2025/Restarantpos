import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Clock, Flame } from "lucide-react"
import { foodTypes, restaurantInfo } from "@/config/restaurant-config"

interface FoodCardProps {
  id?: string
  image: string
  title: string
  description?: string
  price: number
  discount?: number
  type: string
  spicyLevel?: number
  preparationTime?: number
  ingredients?: string[]
  allergens?: string[]
  available?: boolean
}

export function FoodCard({
  id,
  image,
  title,
  description,
  price,
  discount,
  type,
  spicyLevel = 0,
  preparationTime,
  ingredients = [],
  allergens = [],
  available = true,
}: FoodCardProps) {
  const foodType = foodTypes[type as keyof typeof foodTypes]

  if (!available) return null

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img src={image || "/placeholder.svg?height=200&width=300"} alt={title} className="w-full h-40 object-cover" />
        {discount && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded-md text-xs font-medium">
            {discount}% ቅናሽ
          </div>
        )}
        {spicyLevel > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
            <Flame className="h-3 w-3" />
            {spicyLevel}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium mb-1">{title}</h3>
        {description && <p className="text-xs text-gray-600 mb-2 line-clamp-2">{description}</p>}

        <div className="flex justify-between items-center mb-2">
          <span className={`text-${restaurantInfo.primaryColor}-600 font-bold`}>{price.toFixed(2)} ብር</span>
          <div className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${foodType?.color || "bg-gray-500"}`}></span>
            <span className="text-xs text-gray-500">{foodType?.label || type}</span>
          </div>
        </div>

        {preparationTime && (
          <div className="flex items-center gap-1 mb-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            {preparationTime} ደቂቃ
          </div>
        )}

        {allergens.length > 0 && (
          <div className="mb-2">
            <div className="flex flex-wrap gap-1">
              {allergens.map((allergen, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {allergen}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" className="rounded-full h-8 w-8 bg-transparent">
            <Minus className="h-3 w-3" />
          </Button>
          <span className="font-medium">1</span>
          <Button variant="outline" size="icon" className="rounded-full h-8 w-8 bg-transparent">
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
