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
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-foreground">
          {employee?.role === "admin" ? "አስተዳደር ዳሽቦርድ" : employee?.role === "kitchen" ? "ኩሽና ዳሽቦርድ" : "የሽያጭ ነጥብ"}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative text-foreground hover:bg-primary/10">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive text-white">
            3
          </Badge>
        </Button>

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Role Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-primary/10 hover:border-primary/20">
              ሚና ቀይር
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuLabel className="text-foreground">ሚና ምረጥ</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleRoleSwitch("admin")} className="text-foreground cursor-pointer hover:bg-primary/10">አስተዳዳሪ</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRoleSwitch("cashier")} className="text-foreground cursor-pointer hover:bg-primary/10">ገንዘብ ተቀባይ</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRoleSwitch("kitchen")} className="text-foreground cursor-pointer hover:bg-primary/10">ኩሽና ሰራተኛ</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-foreground hover:bg-primary/10">
              <User className="h-4 w-4" />
              <span>{employee?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuLabel className="text-foreground">የእኔ መለያ</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-foreground cursor-pointer hover:bg-primary/10">
              <Settings className="h-4 w-4 mr-2" />
              ቅንብሮች
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer hover:bg-destructive/10">
              <LogOut className="h-4 w-4 mr-2" />
              ውጣ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
