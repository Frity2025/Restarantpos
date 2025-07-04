"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/auth-context"
import {
  Home,
  ShoppingCart,
  Users,
  ChefHat,
  BarChart3,
  Settings,
  Calendar,
  Clock,
  Table,
  UserCheck,
} from "lucide-react"

const navigation = [
  {
    name: "ዋና ገጽ",
    href: "/",
    icon: Home,
    permissions: [],
  },
  {
    name: "ትዕዛዞች",
    href: "/orders",
    icon: ShoppingCart,
    permissions: ["view_orders"],
  },
  {
    name: "ጠረጴዛዎች",
    href: "/tables",
    icon: Table,
    permissions: ["manage_tables"],
  },
  {
    name: "ቦታ ማስያዝ",
    href: "/reservations",
    icon: Calendar,
    permissions: ["manage_reservations"],
  },
  {
    name: "ጥበቃ ዝርዝር",
    href: "/waitlist",
    icon: Clock,
    permissions: ["manage_waitlist", "view_waitlist"],
  },
  {
    name: "ኩሽና",
    href: "/kitchen",
    icon: ChefHat,
    permissions: ["kitchen_access"],
  },
  {
    name: "ሰራተኞች",
    href: "/employees",
    icon: Users,
    permissions: ["manage_employees"],
  },
  {
    name: "ስታቲስቲክስ",
    href: "/stats",
    icon: BarChart3,
    permissions: ["view_analytics"],
  },
  {
    name: "አስተዳደር",
    href: "/admin",
    icon: Settings,
    permissions: ["admin_access"],
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { user, hasPermission } = useAuth()

  const filteredNavigation = navigation.filter((item) => {
    if (item.permissions.length === 0) return true
    return item.permissions.some((permission) => hasPermission(permission))
  })

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r">
      <div className="flex h-16 items-center border-b px-6">
        <UserCheck className="h-6 w-6 text-blue-600" />
        <span className="ml-2 text-lg font-semibold">የምግብ ቤት POS</span>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {filteredNavigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", isActive && "bg-blue-50 text-blue-700 hover:bg-blue-100")}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
      {user && (
        <div className="border-t p-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-700">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
