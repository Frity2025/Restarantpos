"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock } from "lucide-react"
import Image from "next/image"

interface FoodCardProps {
  item: {
    id: string
    name: string
    description: string
    price: number
    image: string
    available: boolean
    preparationTime: number
  }
  onAddToCart: (item: any) => void
}

export function FoodCard({ item, onAddToCart }: FoodCardProps) {
  return (
    <Card className={`h-full ${!item.available ? "opacity-50" : ""}`}>
      <CardContent className="p-4">
        <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
          {!item.available && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="destructive">አይገኝም</Badge>
            </div>
          )}
        </div>
        <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-green-600">{item.price} ብር</span>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {item.preparationTime} ደቂቃ
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={() => onAddToCart(item)} disabled={!item.available} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          ወደ ጋሪ ጨምር
        </Button>
      </CardFooter>
    </Card>
  )
}
