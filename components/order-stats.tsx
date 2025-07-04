"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, Clock, DollarSign, ShoppingCart } from "lucide-react"
import { orderManager } from "@/lib/order-management"
import type { OrderStats } from "@/types/order"

export function OrderStatsComponent() {
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = () => {
    const fromDate = dateFrom ? new Date(dateFrom) : undefined
    const toDate = dateTo ? new Date(dateTo) : undefined
    const orderStats = orderManager.getOrderStats(fromDate, toDate)
    setStats(orderStats)
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ብር`
  }

  if (!stats) {
    return <div>እየጫን ነው...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">የትዕዛዝ ስታቲስቲክስ</h2>
        <div className="flex gap-2">
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} placeholder="ከቀን" />
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} placeholder="እስከ ቀን" />
          <Button onClick={loadStats}>ማጣሪያ</Button>
        </div>
      </div>

      {/* ዋና ስታቲስቲክስ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ጠቅላላ ትዕዛዞች</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ጠቅላላ ገቢ</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">አማካይ ትዕዛዝ ዋጋ</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.averageOrderValue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">አማካይ ዝግጅት ጊዜ</p>
                <p className="text-2xl font-bold">{Math.round(stats.averagePreparationTime)} ደቂቃ</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* በሁኔታ ትዕዛዞች */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>በሁኔታ ትዕዛዞች</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>በመጠባበቅ ላይ</span>
                <Badge variant="secondary">{stats.ordersByStatus.pending}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>በዝግጅት ላይ</span>
                <Badge className="bg-orange-100 text-orange-800">{stats.ordersByStatus.preparing}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>ተጠናቋል</span>
                <Badge className="bg-green-100 text-green-800">{stats.ordersByStatus.completed}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>ተሰርዟል</span>
                <Badge variant="destructive">{stats.ordersByStatus.cancelled}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>በአይነት ትዕዛዞች</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>በቦታው መመገብ</span>
                <Badge>{stats.ordersByType.dine_in}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>ይዞ መሄድ</span>
                <Badge>{stats.ordersByType.takeaway}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>ማድረስ</span>
                <Badge>{stats.ordersByType.delivery}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* በጣም የሚሸጡ ምግቦች */}
      <Card>
        <CardHeader>
          <CardTitle>በጣም የሚሸጡ ምግቦች</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ደረጃ</TableHead>
                <TableHead>የምግብ ስም</TableHead>
                <TableHead>የተሸጠ ብዛት</TableHead>
                <TableHead>ጠቅላላ ገቢ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.topSellingItems.map((item, index) => (
                <TableRow key={item.foodId}>
                  <TableCell>
                    <Badge variant={index < 3 ? "default" : "secondary"}>{index + 1}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.foodName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatCurrency(item.revenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
