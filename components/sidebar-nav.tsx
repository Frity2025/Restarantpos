"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  ShoppingCart,
  Users,
  ChefHat,
  BarChart3,
  Settings,
  TableIcon,
  CalendarRange,
  Truck,
  Package,
  UserCheck,
  CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { hasPermission } from "@/lib/auth"

const navigationItems = [
  {
    title: "ዋና ገጽ",
    href: "/",
    icon: Home,
    permission: "pos_view",
  },
  {
    title: "ትዕዛዞች",
    href: "/orders",
    icon: ShoppingCart,
    permission: "orders_view",
  },
  {
    title: "ኩሽና",
    href: "/kitchen",
    icon: ChefHat,
    permission: "kitchen_view",
  },
  {
    title: "ጠረጴዛዎች",
    href: "/tables",
    icon: TableIcon,
    permission: "tables_view",
  },
  {
    title: "ቦታ ማስያዝ",
    href: "/reservations",
    icon: CalendarRange,
    permission: "reservations_view",
  },
  {
    title: "የጠበቃ ዝርዝር",
    href: "/waitlist",
    icon: UserCheck,
    permission: "waitlist_view",
  },
  {
    title: "ክምችት",
    href: "/inventory",
    icon: Package,
    permission: "inventory_view",
  },
  {
    title: "አቅራቢዎች",
    href: "/suppliers",
    icon: Truck,
    permission: "suppliers_view",
  },
  {
    title: "ክፍያዎች",
    href: "/payments",
    icon: CreditCard,
    permission: "payments_view",
  },
  {
    title: "ሪፖርቶች",
    href: "/stats",
    icon: BarChart3,
    permission: "reports_view",
  },
  {
    title: "ሰራተኞች",
    href: "/employees",
    icon: Users,
    permission: "employees_view",
  },
  {
    title: "አስተዳደር",
    href: "/admin",
    icon: Settings,
    permission: "admin_access",
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { employee } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  if (!employee) return null

  const visibleItems = navigationItems.filter((item) => hasPermission(employee, item.permission))

  return (
    <div className={cn("bg-white border-r border-gray-200 transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!collapsed && <h2 className="text-lg font-semibold text-gray-800">ቺሊ POS</h2>}
            <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {visibleItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start h-10",
                        collapsed ? "px-2" : "px-3",
                        isActive && "bg-green-50 text-green-700 border-green-200",
                      )}
                    >
                      <Icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </Button>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Info */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{employee.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{employee.name}</p>
                <p className="text-xs text-gray-500 truncate">{employee.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
