"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  ShoppingCart,
  Users,
  ChefHat,
  BarChart3,
  Settings,
  Package,
  Calendar,
  Clock,
  CreditCard,
  Menu,
  LogOut,
  UserCheck,
  Truck,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

const navigation = [
  { name: "ዋና ገጽ", href: "/", icon: Home, permission: "pos_view" },
  { name: "ትዕዛዞች", href: "/orders", icon: ShoppingCart, permission: "orders_view" },
  { name: "ኩሽና", href: "/kitchen", icon: ChefHat, permission: "kitchen_view" },
  { name: "ጠረጴዛዎች", href: "/tables", icon: Calendar, permission: "tables_view" },
  { name: "ቦታ ማስያዝ", href: "/reservations", icon: Clock, permission: "reservations_view" },
  { name: "ጥበቃ ዝርዝር", href: "/waitlist", icon: UserCheck, permission: "waitlist_view" },
  { name: "ክምችት", href: "/inventory", icon: Package, permission: "inventory_view" },
  { name: "አቅራቢዎች", href: "/suppliers", icon: Truck, permission: "suppliers_view" },
  { name: "ክፍያዎች", href: "/payments", icon: CreditCard, permission: "payments_view" },
  { name: "ሰራተኞች", href: "/employees", icon: Users, permission: "employees_view" },
  { name: "ሪፖርቶች", href: "/stats", icon: BarChart3, permission: "reports_view" },
  { name: "አስተዳደር", href: "/admin", icon: Settings, permission: "admin_access" },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { employee, logout, hasPermission } = useAuth()
  const [open, setOpen] = useState(false)

  const filteredNavigation = navigation.filter((item) => hasPermission(item.permission) || hasPermission("all"))

  const NavContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <ChefHat className="h-6 w-6" />
          <span>ሬስቶራንት POS</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{employee?.name}</p>
            <p className="text-xs text-muted-foreground">{employee?.role}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          ውጣ
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block w-64">
        <NavContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden fixed top-4 left-4 z-40 bg-transparent">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-64">
          <NavContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
