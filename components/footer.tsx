"use client"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, DollarSign, TrendingUp } from "lucide-react"

export function Footer() {
  const currentTime = new Date().toLocaleTimeString("am-ET", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <footer className="bg-white border-t px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Quick stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">{currentTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="text-sm">ደንበኞች: </span>
            <Badge variant="secondary">24</Badge>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-sm">ዛሬ ሽያጭ: </span>
            <Badge variant="secondary">12,450 ብር</Badge>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <span className="text-sm">ትዕዛዞች: </span>
            <Badge variant="secondary">47</Badge>
          </div>
        </div>

        {/* Right side - System status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">ስርዓት ሁኔታ: ጥሩ</span>
          </div>

          <div className="text-xs text-gray-500">ቺሊ POS v1.0 | © 2024</div>
        </div>
      </div>
    </footer>
  )
}
