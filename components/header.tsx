"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, User, LogOut, Settings } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { ThemeSwitcher } from "./theme-switcher"

export function Header() {
  const { employee, logout, switchRole } = useAuth()

  const handleRoleSwitch = (role: "admin" | "cashier" | "kitchen") => {
    switchRole(role)
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900">
          {employee?.role === "admin" ? "አስተዳደር ዳሽቦርድ" : employee?.role === "kitchen" ? "ኩሽና ዳሽቦርድ" : "የሽያጭ ነጥብ"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
            3
          </Badge>
        </Button>

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Role Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              ሚና ቀይር
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>ሚና ምረጥ</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleRoleSwitch("admin")}>አስተዳዳሪ</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRoleSwitch("cashier")}>ገንዘብ ተቀባይ</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRoleSwitch("kitchen")}>ኩሽና ሰራተኛ</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{employee?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>የእኔ መለያ</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              ቅንብሮች
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              ውጣ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
