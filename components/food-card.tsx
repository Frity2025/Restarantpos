"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, Flame } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { toast } from "@/hooks/use-toast"
import type { Food } from "@/types/order"

interface FoodCardProps {
  food: Food
}

export function FoodCard({ food }: FoodCardProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)

    try {
      addToCart({
        id: food.id,
        name: food.name,
        nameAmharic: food.nameAmharic,
        price: food.price,
        quantity: 1,
        image: food.image,
        category: food.category,
        barcode: food.barcode,
      })

      toast({
        title: "Added to Cart",
        description: `${food.nameAmharic} has been added to your cart`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const getSpiceIcon = (level?: string) => {
    switch (level) {
      case "hot":
        return "🌶️🌶️🌶️"
      case "medium":
        return "🌶️🌶️"
      case "mild":
      default:
        return "🌶️"
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={food.image || "/placeholder.svg"}
            alt={food.nameAmharic}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        <div className="space-y-2">
          <div>
            <h3 className="font-semibold text-lg leading-tight">{food.nameAmharic}</h3>
            <p className="text-sm text-muted-foreground">{food.name}</p>
          </div>

          {food.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{food.descriptionAmharic || food.description}</p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {food.preparationTime && (
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {food.preparationTime}m
              </Badge>
            )}

            {food.spiceLevel && food.spiceLevel !== "mild" && (
              <Badge variant="outline" className="text-xs">
                <Flame className="w-3 h-3 mr-1" />
                {getSpiceIcon(food.spiceLevel)}
              </Badge>
            )}

            {food.isVegetarian && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                🌱 Veg
              </Badge>
            )}
          </div>

          {food.barcode && <div className="text-xs text-muted-foreground font-mono">#{food.barcode}</div>}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xl font-bold text-primary">{food.price} ብር</span>

            <Button
              onClick={handleAddToCart}
              disabled={!food.isAvailable || isAdding}
              size="sm"
              className="min-w-[80px]"
            >
              {isAdding ? (
                "Adding..."
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
