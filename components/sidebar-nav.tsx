"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Home,
  ShoppingCart,
  Users,
  ChefHat,
  BarChart3,
  Settings,
  Calendar,
  Clock,
  Package,
  Truck,
  FileText,
  ClipboardList,
  Workflow,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { userHasPermission } from "@/config/roles-permissions"

const navigationItems = [
  {
    title: "ዋና ገጽ",
    href: "/",
    icon: Home,
    permissions: [],
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
    permissions: ["view_orders"],
  },
  {
    title: "ጠረጴዛዎች",
    href: "/tables",
    icon: Calendar,
    permissions: ["view_tables"],
  },
  {
    title: "ቦታ ማስያዝ",
    href: "/reservations",
    icon: Calendar,
    permissions: ["view_reservations"],
  },
  {
    title: "የደንበኞች ጥበቃ",
    href: "/waitlist",
    icon: Clock,
    permissions: ["view_waitlist"],
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
    title: "የግዢ ትዕዛዞች",
    href: "/purchase-orders",
    icon: FileText,
    permissions: ["view_purchase_orders"],
  },
  {
    title: "የግዢ ፍሰት",
    href: "/purchase-orders/workflow",
    icon: Workflow,
    permissions: ["approve_purchase_orders"],
  },
  {
    title: "የግዢ ቅጦች",
    href: "/purchase-orders/templates",
    icon: ClipboardList,
    permissions: ["manage_purchase_templates"],
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
    permissions: ["view_stats"],
  },
  {
    title: "አስተዳደር",
    href: "/admin",
    icon: Settings,
    permissions: ["manage_system_settings"],
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  const filteredItems = navigationItems.filter((item) => {
    if (item.permissions.length === 0) return true
    if (!user) return false
    return item.permissions.some((permission) => userHasPermission(user.role, permission))
  })

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">የምግብ ቤት POS</h2>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start", isActive && "bg-secondary")}
                asChild
              >
                <Link href={item.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            )
          })}
        </nav>
        <Separator className="my-4" />
        <div className="space-y-2">
          <p className="px-3 text-xs font-medium text-muted-foreground">ተጨማሪ ባህሪያት</p>
          {user && userHasPermission(user.role, "manage_food") && (
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/admin">
                <Settings className="mr-2 h-4 w-4" />
                የምግብ አስተዳደር
              </Link>
            </Button>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
