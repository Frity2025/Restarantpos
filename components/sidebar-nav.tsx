"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  ShoppingCart,
  Users,
  ChefHat,
  BarChart3,
  Settings,
  Package,
  Truck,
  Calendar,
  Clock,
  CreditCard,
  UserCheck,
  Menu,
  X,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "ዋና ገጽ",
    href: "/",
    icon: Home,
    permission: null,
  },
  {
    title: "ትዕዛዞች",
    href: "/orders",
    icon: ShoppingCart,
    permission: "manage_orders",
    badge: "3",
  },
  {
    title: "ኩሽና",
    href: "/kitchen",
    icon: ChefHat,
    permission: "kitchen_access",
    badge: "5",
  },
  {
    title: "ክፍያዎች",
    href: "/payments",
    icon: CreditCard,
    permission: "process_payments",
  },
  {
    title: "ጠረጴዛዎች",
    href: "/tables",
    icon: Calendar,
    permission: "manage_tables",
  },
  {
    title: "ቦታ ማስያዝ",
    href: "/reservations",
    icon: Clock,
    permission: "manage_reservations",
  },
  {
    title: "የጥበቃ ዝርዝር",
    href: "/waitlist",
    icon: UserCheck,
    permission: "manage_waitlist",
  },
  {
    title: "ዕቃ መጋዘን",
    href: "/inventory",
    icon: Package,
    permission: "manage_inventory",
  },
  {
    title: "አቅራቢዎች",
    href: "/suppliers",
    icon: Truck,
    permission: "manage_suppliers",
  },
  {
    title: "ሰራተኞች",
    href: "/employees",
    icon: Users,
    permission: "manage_employees",
  },
  {
    title: "ሪፖርቶች",
    href: "/stats",
    icon: BarChart3,
    permission: "view_reports",
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
  const { employee, hasPermission } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Filter navigation items based on permissions
  const filteredItems = navigationItems.filter((item) => {
    if (!item.permission) return true
    return hasPermission(item.permission)
  })

  return (
    <div className={cn("flex flex-col h-full bg-white border-r", isCollapsed ? "w-16" : "w-64")}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">ቺሊ POS</h2>
              <p className="text-xs text-gray-500">ምግብ ቤት ስርዓት</p>
            </div>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* User Info */}
      {!isCollapsed && employee && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {employee.firstName} {employee.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{employee.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    isCollapsed && "justify-center px-2",
                    isActive && "bg-green-50 text-green-700 border-green-200",
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t">
          <div className="text-xs text-gray-500 text-center">
            <p>ቺሊ POS v1.0</p>
            <p>© 2024 ሁሉም መብቶች የተጠበቁ ናቸው</p>
          </div>
        </div>
      )}
    </div>
  )
}
