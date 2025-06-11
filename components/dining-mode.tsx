import { Button } from "@/components/ui/button"
import { diningModes } from "@/config/restaurant-config"

export function DiningMode() {
  return (
    <div className="flex gap-2 mb-4">
      {diningModes.map((mode, index) => (
        <Button key={index} variant={index === 0 ? "secondary" : "ghost"} className="rounded-full">
          {mode}
        </Button>
      ))}
    </div>
  )
}
