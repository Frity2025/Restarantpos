"use client"
import { Card, CardContent } from "@/components/ui/card"
import { diningModes } from "@/config/restaurant-config"
import { Utensils, ShoppingBag, Truck } from "lucide-react"

interface DiningModeProps {
  selectedMode: string
  onModeChange: (mode: string) => void
}

const iconMap = {
  utensils: Utensils,
  "shopping-bag": ShoppingBag,
  truck: Truck,
}

export function DiningMode({ selectedMode, onModeChange }: DiningModeProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {diningModes.map((mode) => {
        const IconComponent = iconMap[mode.icon as keyof typeof iconMap] || Utensils
        const isSelected = selectedMode === mode.id

        return (
          <Card
            key={mode.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected ? "ring-2 ring-green-500 bg-green-50" : ""
            }`}
            onClick={() => onModeChange(mode.id)}
          >
            <CardContent className="p-4 text-center">
              <IconComponent className={`h-8 w-8 mx-auto mb-2 ${isSelected ? "text-green-600" : "text-gray-600"}`} />
              <h3 className={`font-medium ${isSelected ? "text-green-700" : "text-gray-900"}`}>{mode.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{mode.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
