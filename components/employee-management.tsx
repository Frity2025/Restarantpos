"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Search, Users } from "lucide-react"
import { authService } from "@/lib/auth"
import { roleNames } from "@/config/roles-permissions"

export function EmployeeManagement() {
  const [employees, setEmployees] = useState(authService.getAllEmployees())
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteEmployee = (id: string) => {
    if (confirm("ይህንን ሰራተኛ መሰረዝ ይፈልጋሉ?")) {
      authService.deleteEmployee(id)
      setEmployees(authService.getAllEmployees())
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h2 className="text-2xl font-bold">የሰራተኞች አስተዳደር</h2>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          አዲስ ሰራተኛ ጨምር
        </Button>
      </div>

      {/* ስታቲስቲክስ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{employees.length}</div>
            <p className="text-sm text-gray-600">ጠቅላላ ሰራተኞች</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{employees.filter((emp) => emp.isActive).length}</div>
            <p className="text-sm text-gray-600">ንቁ ሰራተኞች</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {employees.filter((emp) => emp.role === "admin" || emp.role === "manager").length}
            </div>
            <p className="text-sm text-gray-600">አስተዳዳሪዎች</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {
                employees.filter((emp) => emp.lastLogin && emp.lastLogin > new Date(Date.now() - 24 * 60 * 60 * 1000))
                  .length
              }
            </div>
            <p className="text-sm text-gray-600">ዛሬ የገቡ</p>
          </CardContent>
        </Card>
      </div>

      {/* ፍለጋ */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="ሰራተኛ ፈልግ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* የሰራተኞች ዝርዝር */}
      <Card>
        <CardHeader>
          <CardTitle>የሰራተኞች ዝርዝር</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ስም</TableHead>
                <TableHead>ኢሜይል</TableHead>
                <TableHead>ስልክ</TableHead>
                <TableHead>ደረጃ</TableHead>
                <TableHead>ሁኔታ</TableHead>
                <TableHead>የመጨረሻ መግቢያ</TableHead>
                <TableHead>ተግባሮች</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>
                    <Badge variant={employee.role === "admin" ? "default" : "secondary"}>
                      {roleNames[employee.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={employee.isActive ? "default" : "destructive"}>
                      {employee.isActive ? "ንቁ" : "ቦዝኗል"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {employee.lastLogin ? new Date(employee.lastLogin).toLocaleDateString("am-ET") : "ከዚህ በፊት"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteEmployee(employee.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
