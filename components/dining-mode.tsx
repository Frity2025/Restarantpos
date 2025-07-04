"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Utensils, ShoppingBag, Truck } from "lucide-react"
import { diningModes } from "@/config/restaurant-config"

export function DiningMode() {
  const [selectedMode, setSelectedMode] = useState("dine-in")

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "utensils":
        return Utensils
      case "shopping-bag":
        return ShoppingBag
      case "truck":
        return Truck
      default:
        return Utensils
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">የምግብ አገልግሎት ዘዴ</h3>
        <Badge variant="secondary">ጠረጴዛ #4</Badge>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {diningModes.map((mode) => {
          const Icon = getIcon(mode.icon)
          const isSelected = selectedMode === mode.id

          return (
            <Card
              key={mode.id}
              className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-green-500 bg-green-50" : "hover:bg-gray-50"}`}
            >
              <CardContent className="p-4 text-center">
                <Button
                  variant={isSelected ? "default" : "ghost"}
                  className="w-full h-auto flex-col space-y-2 p-4"
                  onClick={() => setSelectedMode(mode.id)}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{mode.name}</span>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
