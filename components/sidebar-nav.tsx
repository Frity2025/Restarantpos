"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  ShoppingCart,
  Users,
  ChefHat,
  BarChart3,
  Settings,
  Package,
  Calendar,
  CreditCard,
  UserCheck,
  Clock,
  RefreshCw,
  Truck,
  Bell,
  FileText,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

const navigationItems = [
  {
    title: "ዳሽቦርድ",
    href: "/",
    icon: Home,
    permissions: ["pos_view", "admin_access", "kitchen_access"],
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
    icon: Calendar,
    permissions: ["admin_access", "pos_view"],
  },
  {
    title: "ክምችት",
    href: "/inventory",
    icon: Package,
    permissions: ["admin_access", "manage_inventory"],
  },
  {
    title: "አውቶ መሙላት",
    href: "/auto-reorder",
    icon: RefreshCw,
    permissions: ["admin_access", "manage_inventory"],
  },
  {
    title: "አቅራቢዎች",
    href: "/suppliers",
    icon: Truck,
    permissions: ["admin_access"],
  },
  {
    title: "ሰራተኞች",
    href: "/employees",
    icon: Users,
    permissions: ["admin_access"],
  },
  {
    title: "ክፍያዎች",
    href: "/payments",
    icon: CreditCard,
    permissions: ["admin_access", "pos_view"],
  },
  {
    title: "ማሳወቂያዎች",
    href: "/notifications",
    icon: Bell,
    permissions: ["admin_access"],
  },
  {
    title: "ሪፖርቶች",
    href: "/reports",
    icon: FileText,
    permissions: ["view_analytics", "admin_access"],
  },
  {
    title: "ተጠባባቂ ዝርዝር",
    href: "/waitlist",
    icon: Clock,
    permissions: ["admin_access", "pos_view"],
  },
  {
    title: "አስተዳደር",
    href: "/admin",
    icon: Settings,
    permissions: ["admin_access"],
  },
  {
    title: "ስታቲስቲክስ",
    href: "/stats",
    icon: BarChart3,
    permissions: ["view_analytics"],
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { employee, hasPermission } = useAuth()

  const filteredItems = navigationItems.filter((item) =>
    item.permissions.some((permission) => hasPermission(permission)),
  )

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col shadow-sm dark:bg-slate-900">
      <div className="p-6 border-b border-border bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-foreground font-bold text-lg">ር</span>
          </div>
          <div>
            <h2 className="font-bold text-foreground">የባህል ምግብ ቤት</h2>
            <p className="text-xs text-muted-foreground">POS ስርዓት</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-11 transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90" 
                      : "text-foreground hover:bg-primary/10 hover:text-primary",
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.title}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-border bg-gradient-to-t from-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <UserCheck className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{employee?.name}</p>
            <Badge className="text-xs bg-primary/10 text-primary border-primary/20 mt-1">
              {employee?.role === "admin"
                ? "አስተዳዳሪ"
                : employee?.role === "cashier"
                  ? "ገንዘብ ተቀባይ"
                  : employee?.role === "kitchen"
                    ? "ኩሽና"
                    : "ተጠቃሚ"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
