"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { hasPermission } from "@/lib/auth"
import { Home, ShoppingCart, Users, ChefHat, BarChart3, Settings, Calendar, Clock, UserPlus, Table } from "lucide-react"

const navigation = [
  {
    name: "ዋና ገጽ",
    href: "/",
    icon: Home,
    permission: null,
  },
  {
    name: "ትዕዛዞች",
    href: "/orders",
    icon: ShoppingCart,
    permission: "order_management",
  },
  {
    name: "ጠረጴዛዎች",
    href: "/tables",
    icon: Table,
    permission: "table_management",
  },
  {
    name: "ቦታ ማስያዝ",
    href: "/reservations",
    icon: Calendar,
    permission: "table_management",
  },
  {
    name: "የጥበቃ ዝርዝር",
    href: "/waitlist",
    icon: Clock,
    permission: "table_management",
  },
  {
    name: "ሰራተኞች",
    href: "/employees",
    icon: Users,
    permission: "employee_management",
  },
  {
    name: "ወደ ጠረጴዛ ማስያዝ",
    href: "/book-table",
    icon: UserPlus,
    permission: "table_management",
  },
  {
    name: "ኩሽና",
    href: "/kitchen",
    icon: ChefHat,
    permission: "kitchen_access",
  },
  {
    name: "ስታቲስቲክስ",
    href: "/stats",
    icon: BarChart3,
    permission: "view_reports",
  },
  {
    name: "አስተዳደር",
    href: "/admin",
    icon: Settings,
    permission: "admin_access",
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  const filteredNavigation = navigation.filter((item) => {
    if (!item.permission) return true
    return user && hasPermission(user.role, item.permission)
  })

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold text-gray-900">የምግብ ቤት POS</h1>
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    pathname === item.href
                      ? "bg-blue-100 text-blue-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  )}
                >
                  <Icon
                    className={cn(
                      pathname === item.href ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500",
                      "mr-3 flex-shrink-0 h-6 w-6",
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
