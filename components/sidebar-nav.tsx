"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  BarChart3,
  Settings,
  ChefHat,
  CreditCard,
  Clock,
  RefreshCw,
  Truck,
  UserCheck,
} from "lucide-react"

const navigation = [
  { name: "ዋና ገጽ", nameEn: "Dashboard", href: "/", icon: Home },
  { name: "ትዕዛዞች", nameEn: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "ኩሽና", nameEn: "Kitchen", href: "/kitchen", icon: ChefHat },
  { name: "ክምችት", nameEn: "Inventory", href: "/inventory", icon: Package },
  { name: "አውቶ መሙላት", nameEn: "Auto Reorder", href: "/auto-reorder", icon: RefreshCw },
  { name: "አቅራቢዎች", nameEn: "Suppliers", href: "/suppliers", icon: Truck },
  { name: "ጠረጴዛዎች", nameEn: "Tables", href: "/tables", icon: Calendar },
  { name: "ቦታ ማስያዝ", nameEn: "Reservations", href: "/reservations", icon: Clock },
  { name: "የጠበቃ ዝርዝር", nameEn: "Waitlist", href: "/waitlist", icon: UserCheck },
  { name: "ክፍያዎች", nameEn: "Payments", href: "/payments", icon: CreditCard },
  { name: "ሰራተኞች", nameEn: "Employees", href: "/employees", icon: Users },
  { name: "አስተዳዳሪ", nameEn: "Admin", href: "/admin", icon: Settings },
  { name: "ስታቲስቲክስ", nameEn: "Statistics", href: "/stats", icon: BarChart3 },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-2">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            <span className="hidden md:inline">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
