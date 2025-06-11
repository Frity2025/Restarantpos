import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { navItems, restaurantInfo } from "@/config/restaurant-config"

export function SidebarNav() {
  return (
    <div className="w-64 p-4 border-r h-screen">
      <div className="flex items-center gap-2 mb-8">
        <img src={restaurantInfo.logo || "/placeholder.svg"} alt={`${restaurantInfo.name} Logo`} className="w-8 h-8" />
        <span className="font-semibold">{restaurantInfo.name}</span>
      </div>
      <nav className="space-y-2">
        {navItems.map((item, index) => (
          <Button key={index} variant="ghost" className={`w-full justify-start ${item.color}`}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
      <Button variant="ghost" className="w-full justify-start mt-auto text-gray-600 absolute bottom-4">
        <LogOut className="mr-2 h-4 w-4" />
        ውጣ
      </Button>
    </div>
  )
}
