"use client"

import { Clock, Calendar } from "lucide-react"

export function Footer() {
  const currentTime = new Date().toLocaleTimeString("am-ET", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  const currentDate = new Date().toLocaleDateString("am-ET", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{currentTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{currentDate}</span>
          </div>
        </div>

        <div className="text-sm text-gray-500">ቺሊ POS v1.0 - የምግብ ቤት አስተዳደር ስርዓት</div>
      </div>
    </footer>
  )
}
