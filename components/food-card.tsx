"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

interface FoodItem {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
  available: boolean
}

interface FoodCardProps {
  item: FoodItem
}

export function FoodCard({ item }: FoodCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    })
  }

  return (
    <Card className={`overflow-hidden ${!item.available ? "opacity-50" : ""}`}>
      <div className="aspect-square relative">
        <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
        {!item.available && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            አልተገኘም
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <p className="text-sm text-gray-600">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-600">{item.price} ብር</span>
            <Button size="sm" onClick={handleAddToCart} disabled={!item.available} className="rounded-full">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
