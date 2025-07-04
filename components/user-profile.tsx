"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogOut, User, Clock, Calendar } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { roleNames } from "@/config/roles-permissions"

export function UserProfile() {
  const { employee, logout } = useAuth()

  if (!employee) return null

  return (
    <Card className="w-80">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm text-gray-600">{employee.email}</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">ደረጃ:</span>
            <Badge>{roleNames[employee.role]}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">ስልክ:</span>
            <span className="text-sm">{employee.phone}</span>
          </div>
          {employee.shift && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">ሽፍት:</span>
              <span className="text-sm">
                {employee.shift === "morning" ? "ጠዋት" : employee.shift === "afternoon" ? "ከሰዓት" : "ማታ"}
              </span>
            </div>
          )}
          {employee.lastLogin && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">የመጨረሻ መግቢያ:</span>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-3 w-3" />
                {new Date(employee.lastLogin).toLocaleString("am-ET")}
              </div>
            </div>
          )}
          {employee.hireDate && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">የቅጥር ቀን:</span>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-3 w-3" />
                {new Date(employee.hireDate).toLocaleDateString("am-ET")}
              </div>
            </div>
          )}
        </div>

        <Button onClick={logout} variant="outline" className="w-full bg-transparent">
          <LogOut className="mr-2 h-4 w-4" />
          ውጣ
        </Button>
      </CardContent>
    </Card>
  )
}
