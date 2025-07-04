import { LogOut, History, ChefHat, BarChart3, TableIcon, Calendar, CalendarPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { navItems, restaurantInfo } from "@/config/restaurant-config"
import Link from "next/link"

export function SidebarNav() {
  const additionalNavItems = [
    { icon: History, label: "የትዕዛዝ ታሪክ", href: "/orders", color: "text-gray-600" },
    { icon: ChefHat, label: "የኩሽና ማሳያ", href: "/kitchen", color: "text-gray-600" },
    { icon: BarChart3, label: "ስታቲስቲክስ", href: "/stats", color: "text-gray-600" },
    { icon: TableIcon, label: "የጠረጴዛ አቀማመጥ", href: "/tables", color: "text-gray-600" },
    { icon: Calendar, label: "ቦታ ማስያዝ አስተዳደር", href: "/reservations", color: "text-gray-600" },
    { icon: CalendarPlus, label: "አዲስ ቦታ ማስያዝ", href: "/book-table", color: "text-gray-600" },
  ]

  return (
    <div className="w-64 p-4 border-r h-screen">
      <div className="flex items-center gap-2 mb-8">
        <img src={restaurantInfo.logo || "/placeholder.svg"} alt={`${restaurantInfo.name} Logo`} className="w-8 h-8" />
        <span className="font-semibold">{restaurantInfo.name}</span>
      </div>
      <nav className="space-y-2">
        <Link href="/">
          <Button variant="ghost" className={`w-full justify-start text-${restaurantInfo.primaryColor}`}>
            <History className="mr-2 h-4 w-4" />
            {navItems[0].label}
          </Button>
        </Link>
        {navItems.slice(1).map((item, index) => (
          <Button key={index + 1} variant="ghost" className={`w-full justify-start ${item.color}`}>
            {item.icon}
            {item.label}
          </Button>
        ))}
        {additionalNavItems.map((item, index) => (
          <Link key={`additional-${index}`} href={item.href}>
            <Button variant="ghost" className={`w-full justify-start ${item.color}`}>
              {item.icon}
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
      <Button variant="ghost" className="w-full justify-start mt-auto text-gray-600 absolute bottom-4">
        <LogOut className="mr-2 h-4 w-4" />
        ውጣ
      </Button>
    </div>
  )
}
