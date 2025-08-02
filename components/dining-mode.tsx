"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { diningModes } from "@/config/restaurant-config"

interface DiningModeProps {
  value: string
  onChange: (value: string) => void
}

export function DiningMode({ value, onChange }: DiningModeProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">የምግብ አይነት</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {diningModes.map((mode) => (
            <Button
              key={mode.id}
              variant={value === mode.id ? "default" : "outline"}
              onClick={() => onChange(mode.id)}
              className="flex flex-col gap-1 h-auto p-3"
              disabled={!mode.available}
            >
              <span className="text-lg">{mode.icon}</span>
              <span className="text-xs">{mode.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
