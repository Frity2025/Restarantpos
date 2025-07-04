"use client"

import { useEffect, useState } from "react"

export function Footer() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          <span>© 2024 ቺሊ ምግብ ቤት - ሁሉም መብቶች የተጠበቁ ናቸው</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{currentTime.toLocaleDateString("am-ET")}</span>
          <span>{currentTime.toLocaleTimeString("am-ET")}</span>
        </div>
      </div>
    </footer>
  )
}
