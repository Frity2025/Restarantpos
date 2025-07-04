"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
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
  CreditCard,
  Calendar,
  Clock,
  UserCheck,
  Menu,
  X,
  Store,
  TableProperties,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  permissions?: string[]
}

const navItems: NavItem[] = [
  {
    title: "ዳሽቦርድ",
    href: "/",
    icon: Home,
    permissions: ["pos_view"],
  },
  {
    title: "ትዕዛዞች",
    href: "/orders",
    icon: ShoppingCart,
    permissions: ["view_orders"],
  },
  {
    title: "ኩሽና",
    href: "/kitchen",
    icon: ChefHat,
    permissions: ["kitchen_access"],
  },
  {
    title: "ጠረጴዛዎች",
    href: "/tables",
    icon: TableProperties,
    permissions: ["view_tables"],
  },
  {
    title: "ቦታ ማስያዝ",
    href: "/reservations",
    icon: Calendar,
    permissions: ["view_reservations"],
  },
  {
    title: "ጥበቃ ዝርዝር",
    href: "/waitlist",
    icon: Clock,
    permissions: ["view_waitlist"],
  },
  {
    title: "ክፍያዎች",
    href: "/payments",
    icon: CreditCard,
    permissions: ["process_payments"],
  },
  {
    title: "ክምችት",
    href: "/inventory",
    icon: Package,
    permissions: ["view_inventory"],
  },
  {
    title: "አቅራቢዎች",
    href: "/suppliers",
    icon: Truck,
    permissions: ["view_suppliers"],
  },
  {
    title: "ሰራተኞች",
    href: "/employees",
    icon: Users,
    permissions: ["view_employees"],
  },
  {
    title: "ስታቲስቲክስ",
    href: "/stats",
    icon: BarChart3,
    permissions: ["view_analytics"],
  },
  {
    title: "አስተዳደር",
    href: "/admin",
    icon: Settings,
    permissions: ["admin_access"],
  },
]

export function SidebarNav() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { employee, hasPermission } = useAuth()

  const filteredNavItems = navItems.filter((item) => {
    if (!item.permissions || item.permissions.length === 0) return true
    return item.permissions.some((permission) => hasPermission(permission))
  })

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Store className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg text-gray-900">Restaurant POS</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* User Info */}
      {!isCollapsed && employee && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <UserCheck className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{employee.name}</p>
              <p className="text-xs text-gray-500 truncate">{employee.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-10",
                    isCollapsed ? "px-2" : "px-3",
                    isActive && "bg-blue-50 text-blue-700 border-blue-200",
                  )}
                >
                  <Icon className={cn("h-4 w-4", isCollapsed ? "" : "mr-3")} />
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
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>Restaurant POS v1.0</p>
            <p>© 2024 All rights reserved</p>
          </div>
        </div>
      )}
    </div>
  )
}
