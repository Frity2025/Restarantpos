"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Bell, User, Settings, LogOut, Moon, Sun, ChefHat, Clock, AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "next-themes"
import { RoleSwitcher } from "./role-switcher"

export function Header() {
  const { employee, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "አዲስ ትዕዛዝ",
      message: "ጠረጴዛ 5 አዲስ ትዕዛዝ አስቀምጧል",
      time: "2 ደቂቃ በፊት",
      type: "order",
      unread: true,
    },
    {
      id: 2,
      title: "ክምችት ማስጠንቀቂያ",
      message: "የዶሮ ወጥ ንጥረ ነገሮች እየተጠናቀቁ ነው",
      time: "15 ደቂቃ በፊት",
      type: "warning",
      unread: true,
    },
    {
      id: 3,
      title: "ትዕዛዝ ዝግጁ",
      message: "ትዕዛዝ #ORD-001 ለማቅረብ ዝግጁ ነው",
      time: "30 ደቂቃ በፊት",
      type: "ready",
      unread: false,
    },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ChefHat className="h-4 w-4 text-blue-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "ready":
        return <Clock className="h-4 w-4 text-green-600" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "cashier":
        return "bg-green-100 text-green-800"
      case "kitchen":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "አስተዳዳሪ"
      case "cashier":
        return "ገንዘብ ተቀባይ"
      case "kitchen":
        return "ኩሽና ሰራተኛ"
      default:
        return role
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Search */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="ፈልግ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Role Switcher */}
          <RoleSwitcher />

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>ማሳወቂያዎች</span>
                {unreadCount > 0 && <Badge variant="secondary">{unreadCount} አዲስ</Badge>}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-3">
                    <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{notification.title}</p>
                        {notification.unread && <div className="h-2 w-2 bg-blue-600 rounded-full" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 gap-2 px-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {employee?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{employee?.name}</span>
                  <Badge className={`text-xs ${getRoleColor(employee?.role || "")}`}>
                    {getRoleText(employee?.role || "")}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{employee?.name}</p>
                  <p className="text-xs text-muted-foreground">{getRoleText(employee?.role || "")}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>መገለጫ</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>ቅንብሮች</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>ውጣ</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
