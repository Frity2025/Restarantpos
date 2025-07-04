"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { authService } from "@/lib/auth"
import { roleNames } from "@/config/roles-permissions"
import type { UserRole } from "@/types/auth"

interface AddEmployeeFormProps {
  onClose: () => void
  onEmployeeAdded: () => void
}

export function AddEmployeeForm({ onClose, onEmployeeAdded }: AddEmployeeFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "" as UserRole,
    password: "",
    shift: "morning" as "morning" | "afternoon" | "night",
    salary: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newEmployee = {
      ...formData,
      salary: Number.parseFloat(formData.salary),
      isActive: true,
      hireDate: new Date(),
    }

    authService.addEmployee(newEmployee)
    onEmployeeAdded()
    onClose()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>አዲስ ሰራተኛ ጨምር</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">ስም</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">የአባት ስም</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">ኢሜይል</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">ስልክ ቁጥር</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">ደረጃ</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="ደረጃ ይምረጡ" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleNames).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="shift">ሽፍት</Label>
              <Select
                value={formData.shift}
                onValueChange={(value: "morning" | "afternoon" | "night") => setFormData({ ...formData, shift: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">ጠዋት</SelectItem>
                  <SelectItem value="afternoon">ከሰዓት</SelectItem>
                  <SelectItem value="night">ማታ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">የይለፍ ቃል</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="salary">ደመወዝ (ብር)</Label>
              <Input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              ሰራተኛ ጨምር
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              ሰርዝ
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
