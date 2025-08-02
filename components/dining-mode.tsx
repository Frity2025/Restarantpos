"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UtensilsCrossed, ShoppingBag, Truck } from "lucide-react"

interface DiningModeProps {
  value?: string
  onChange?: (value: string) => void
}

const diningModes = [
  {
    id: "dine-in",
    name: "Dine In",
    nameAmharic: "በሬስቶራንት",
    icon: UtensilsCrossed,
    description: "Eat at restaurant",
  },
  {
    id: "takeout",
    name: "Takeout",
    nameAmharic: "ይዘው ይሂዱ",
    icon: ShoppingBag,
    description: "Take away",
  },
  {
    id: "delivery",
    name: "Delivery",
    nameAmharic: "ማድረስ",
    icon: Truck,
    description: "Home delivery",
  },
]

export function DiningMode({ value = "dine-in", onChange }: DiningModeProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Order Type</h3>
        <div className="grid grid-cols-3 gap-2">
          {diningModes.map((mode) => {
            const Icon = mode.icon
            const isSelected = value === mode.id

            return (
              <Button
                key={mode.id}
                variant={isSelected ? "default" : "outline"}
                className={`flex flex-col items-center gap-2 h-auto py-3 ${isSelected ? "" : "bg-transparent"}`}
                onClick={() => onChange?.(mode.id)}
              >
                <Icon className="w-5 h-5" />
                <div className="text-center">
                  <div className="font-medium text-sm">{mode.nameAmharic}</div>
                  <div className="text-xs opacity-70">{mode.name}</div>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
