"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Package, AlertTriangle, DollarSign } from "lucide-react"
import { inventoryService } from "@/lib/inventory-management"
import type { InventoryReport, LowStockAlert } from "@/types/inventory"

export function InventoryDashboard() {
  const [report, setReport] = useState<InventoryReport | null>(null)
  const [alerts, setAlerts] = useState<LowStockAlert[]>([])

  useEffect(() => {
    setReport(inventoryService.getInventoryReport())
    setAlerts(inventoryService.getLowStockAlerts())
  }, [])

  if (!report) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ጠቅላላ እቃዎች</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.totalItems}</div>
            <p className="text-xs text-muted-foreground">የተለያዩ የክምችት እቃዎች</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ጠቅላላ ዋጋ</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.totalValue.toLocaleString()} ብር</div>
            <p className="text-xs text-muted-foreground">የክምችት ጠቅላላ ዋጋ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ዝቅተኛ ክምችት</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{report.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">ትኩረት የሚፈልጉ እቃዎች</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ከክምችት ውጭ</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{report.outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">ወዲያውኑ መሙላት የሚፈልጉ</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories */}
      <Card>
        <CardHeader>
          <CardTitle>ዋና ምድቦች</CardTitle>
          <CardDescription>በዋጋ ከፍተኛ የሆኑ የእቃ ምድቦች</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {report.topCategories.map((category, index) => (
              <div key={category.category} className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-700">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.category}</span>
                    <span className="text-sm text-muted-foreground">{category.value.toLocaleString()} ብር</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{category.count} እቃዎች</span>
                    <span>{((category.value / report.totalValue) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(category.value / report.totalValue) * 100} className="h-2 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Stock Movements */}
      <Card>
        <CardHeader>
          <CardTitle>የቅርብ ጊዜ እንቅስቃሴዎች</CardTitle>
          <CardDescription>የክምችት ለውጦች እና እንቅስቃሴዎች</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {report.recentMovements.map((movement) => (
              <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      movement.type === "in" ? "bg-green-500" : movement.type === "out" ? "bg-red-500" : "bg-blue-500"
                    }`}
                  />
                  <div>
                    <div className="font-medium">{movement.itemName}</div>
                    <div className="text-sm text-muted-foreground">{movement.reason}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-medium ${
                      movement.type === "in"
                        ? "text-green-600"
                        : movement.type === "out"
                          ? "text-red-600"
                          : "text-blue-600"
                    }`}
                  >
                    {movement.type === "in" ? "+" : movement.type === "out" ? "-" : "±"}
                    {movement.quantity}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {movement.performedAt.toLocaleDateString("am-ET")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
