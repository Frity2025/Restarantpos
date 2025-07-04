"use client"

import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Clock, Wifi, Database } from "lucide-react"

export function Footer() {
  const currentTime = new Date().toLocaleTimeString("am-ET", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  return (
    <footer className="h-12 bg-white border-t border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>{currentTime}</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center space-x-1">
          <Wifi className="h-3 w-3 text-green-600" />
          <span>ተገናኝቷል</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center space-x-1">
          <Database className="h-3 w-3 text-blue-600" />
          <span>ዳታቤዝ ንቁ</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="text-xs">
          v1.0.0
        </Badge>
        <span className="text-xs text-gray-500">© 2024 Restaurant POS</span>
      </div>
    </footer>
  )
}
