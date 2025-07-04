"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Bell, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"

export function Header() {
  const { employee, logout } = useAuth()
  const { itemCount } = useCart()

  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-green-600">የኢትዮጵያ ምግብ ቤት POS</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="ምግብ ፈልግ..." className="pl-10 w-64" />
          </div>

          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">3</Badge>
          </Button>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-medium">{employee?.name}</p>
              <p className="text-xs text-gray-500">{employee?.role}</p>
            </div>
            <Button variant="ghost" size="sm">
              <User className="h-5 w-5" />
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
