"use client"

import { Badge } from "@/components/ui/badge"
import { Clock, Calendar } from "lucide-react"
import { useEffect, useState } from "react"

export function Footer() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("am-ET", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("am-ET", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <footer className="bg-white border-t px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(currentTime)}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(currentTime)}
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="secondary">ስሪት 1.0.0</Badge>
          <p className="text-sm text-gray-500">© 2024 የኢትዮጵያ ምግብ ቤት POS ስርዓት</p>
        </div>
      </div>
    </footer>
  )
}
