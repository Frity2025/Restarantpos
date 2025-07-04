"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Settings, ShoppingCart, ChefHat, Users, ArrowRight, Shield, Clock, CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface RoleOption {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  permissions: string[]
  defaultRoute: string
}

const roleOptions: RoleOption[] = [
  {
    id: "admin",
    name: "አስተዳዳሪ",
    description: "ሙሉ የስርዓት መዳረሻ እና አስተዳደር",
    icon: Settings,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    permissions: ["all"],
    defaultRoute: "/admin",
  },
  {
    id: "cashier",
    name: "ገንዘብ ተቀባይ",
    description: "ትዕዛዝ አስተዳደር እና ክፍያ ሂደት",
    icon: ShoppingCart,
    color: "bg-green-100 text-green-800 border-green-200",
    permissions: ["pos_view", "orders_view", "payments_view"],
    defaultRoute: "/",
  },
  {
    id: "kitchen",
    name: "ኩሽና ሰራተኛ",
    description: "የምግብ ዝግጅት እና ትዕዛዝ አስተዳደር",
    icon: ChefHat,
    color: "bg-orange-100 text-orange-800 border-orange-200",
    permissions: ["kitchen_view", "orders_view"],
    defaultRoute: "/kitchen",
  },
]

export function RoleSwitcher() {
  const { employee, login } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [switching, setSwitching] = useState(false)

  const handleRoleSwitch = async (roleId: string) => {
    setSwitching(true)

    try {
      // Demo credentials for role switching
      const credentials = {
        admin: { username: "admin", password: "admin123" },
        cashier: { username: "cashier", password: "cashier123" },
        kitchen: { username: "kitchen", password: "kitchen123" },
      }

      const cred = credentials[roleId as keyof typeof credentials]
      if (cred) {
        const result = await login(cred.username, cred.password)
        if (result.success) {
          const targetRole = roleOptions.find((r) => r.id === roleId)
          if (targetRole) {
            router.push(targetRole.defaultRoute)
            setIsOpen(false)
          }
        }
      }
    } catch (error) {
      console.error("Role switch failed:", error)
    } finally {
      setSwitching(false)
    }
  }

  const currentRole = roleOptions.find((role) => role.id === employee?.role)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Users className="h-4 w-4" />
          ሚና ቀይር
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            የሚና መቀያየር
          </DialogTitle>
        </DialogHeader>

        {/* Current Role */}
        {currentRole && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={currentRole.color}>
                      <currentRole.icon className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">የአሁኑ ሚና</CardTitle>
                    <CardDescription>{employee?.name}</CardDescription>
                  </div>
                </div>
                <Badge className={currentRole.color}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {currentRole.name}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Available Roles */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">ሚናዎች ይምረጡ</h3>
          <div className="grid gap-3">
            {roleOptions.map((role) => {
              const isCurrentRole = role.id === employee?.role
              const Icon = role.icon

              return (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isCurrentRole ? "ring-2 ring-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => !isCurrentRole && !switching && handleRoleSwitch(role.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${role.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{role.name}</h4>
                          <p className="text-sm text-gray-600">{role.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {role.permissions.slice(0, 3).map((permission, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {permission === "all" ? "ሁሉም ፈቃዶች" : permission}
                              </Badge>
                            ))}
                            {role.permissions.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{role.permissions.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCurrentRole ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            አሁኑ
                          </Badge>
                        ) : (
                          <Button size="sm" disabled={switching} className="gap-1">
                            {switching ? (
                              <>
                                <Clock className="h-3 w-3 animate-spin" />
                                እየቀየረ...
                              </>
                            ) : (
                              <>
                                <ArrowRight className="h-3 w-3" />
                                ቀይር
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Demo Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">ዴሞ መረጃ</p>
                <p className="text-blue-700">ይህ የዴሞ ስርዓት ነው። እያንዳንዱ ሚና የተለያዩ ፈቃዶች እና የመዳረሻ ደረጃዎች አሉት።</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
