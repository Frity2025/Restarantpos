"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, RefreshCw, Filter } from "lucide-react"
import { orderManager } from "@/lib/order-management"
import type { Order, OrderStatus, OrderType, OrderFilter } from "@/types/order"

const statusNames: Record<OrderStatus, string> = {
  pending: "በመጠባበቅ ላይ",
  confirmed: "ተረጋግጧል",
  preparing: "በዝግጅት ላይ",
  ready: "ዝግጁ ነው",
  served: "ተሰርቷል",
  completed: "ተጠናቋል",
  cancelled: "ተሰርዟል",
}

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  ready: "bg-green-100 text-green-800",
  served: "bg-purple-100 text-purple-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
}

const orderTypeNames: Record<OrderType, string> = {
  dine_in: "በቦታው መመገብ",
  takeaway: "ይዞ መሄድ",
  delivery: "ማድረስ",
}

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filter, setFilter] = useState<OrderFilter>({
    status: [],
    orderType: [],
    dateFrom: undefined,
    dateTo: undefined,
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [orders, searchTerm, filter])

  const loadOrders = () => {
    const allOrders = orderManager.getAllOrders()
    setOrders(allOrders)
  }

  const applyFilters = () => {
    let filtered = orderManager.getFilteredOrders(filter)

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.tableNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredOrders(filtered)
  }

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    orderManager.updateOrderStatus(orderId, newStatus)
    loadOrders()
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ብር`
  }

  const formatTime = (date: Date) => {
    return date.toLocaleString("am-ET", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">የትዕዛዝ ታሪክ</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            ማጣሪያ
          </Button>
          <Button onClick={loadOrders}>
            <RefreshCw className="mr-2 h-4 w-4" />
            አድስ
          </Button>
        </div>
      </div>

      {/* ፍለጋ እና ማጣሪያ */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="ትዕዛዝ ፈልግ (ቁጥር፣ ደንበኛ፣ ጠረጴዛ)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">ሁኔታ</label>
                  <Select
                    value={filter.status?.[0] || "all"}
                    onValueChange={(value) =>
                      setFilter({ ...filter, status: value === "all" ? [] : [value as OrderStatus] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="ሁሉም ሁኔታዎች" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ሁሉም ሁኔታዎች</SelectItem>
                      {Object.entries(statusNames).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">አይነት</label>
                  <Select
                    value={filter.orderType?.[0] || "all"}
                    onValueChange={(value) =>
                      setFilter({ ...filter, orderType: value === "all" ? [] : [value as OrderType] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="ሁሉም አይነቶች" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ሁሉም አይነቶች</SelectItem>
                      {Object.entries(orderTypeNames).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">ከቀን</label>
                  <Input
                    type="date"
                    value={filter.dateFrom?.toISOString().split("T")[0] || ""}
                    onChange={(e) =>
                      setFilter({ ...filter, dateFrom: e.target.value ? new Date(e.target.value) : undefined })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">እስከ ቀን</label>
                  <Input
                    type="date"
                    value={filter.dateTo?.toISOString().split("T")[0] || ""}
                    onChange={(e) =>
                      setFilter({ ...filter, dateTo: e.target.value ? new Date(e.target.value) : undefined })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* የትዕዛዝ ዝርዝር */}
      <Card>
        <CardHeader>
          <CardTitle>ትዕዛዞች ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ቁጥር</TableHead>
                <TableHead>ደንበኛ</TableHead>
                <TableHead>ጠረጴዛ</TableHead>
                <TableHead>አይነት</TableHead>
                <TableHead>ንጥሎች</TableHead>
                <TableHead>ጠቅላላ</TableHead>
                <TableHead>ሁኔታ</TableHead>
                <TableHead>ጊዜ</TableHead>
                <TableHead>ተግባሮች</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.customerName || "ያልተሰየመ"}</TableCell>
                  <TableCell>{order.tableNumber || "-"}</TableCell>
                  <TableCell>{orderTypeNames[order.orderType]}</TableCell>
                  <TableCell>{order.items.length} ንጥሎች</TableCell>
                  <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                    >
                      <SelectTrigger className="w-32">
                        <Badge className={statusColors[order.status]}>{statusNames[order.status]}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusNames).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{formatTime(order.createdAt)}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">ምንም ትዕዛዝ አልተገኘም</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* የትዕዛዝ ዝርዝር ሞዳል */}
      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  )
}

// የትዕዛዝ ዝርዝር ሞዳል
function OrderDetailsModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>ትዕዛዝ ዝርዝር - {order.orderNumber}</CardTitle>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* የደንበኛ መረጃ */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">የደንበኛ መረጃ</h4>
              <p>ስም: {order.customerName || "ያልተሰየመ"}</p>
              <p>ስልክ: {order.customerPhone || "-"}</p>
              {order.customerAddress && <p>አድራሻ: {order.customerAddress}</p>}
              <p>ጠረጴዛ: {order.tableNumber || "-"}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">የትዕዛዝ መረጃ</h4>
              <p>አይነት: {orderTypeNames[order.orderType]}</p>
              <p>
                ሁኔታ: <Badge className={statusColors[order.status]}>{statusNames[order.status]}</Badge>
              </p>
              <p>የተፈጠረበት ጊዜ: {order.createdAt.toLocaleString("am-ET")}</p>
              <p>ሰራተኛ: {order.employeeName}</p>
            </div>
          </div>

          {/* የትዕዛዝ ንጥሎች */}
          <div>
            <h4 className="font-semibold mb-2">የትዕዛዝ ንጥሎች</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ምግብ</TableHead>
                  <TableHead>ዋጋ</TableHead>
                  <TableHead>ብዛት</TableHead>
                  <TableHead>ጠቅላላ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.foodName}</TableCell>
                    <TableCell>{item.price.toFixed(2)} ብር</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.totalPrice.toFixed(2)} ብር</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* የክፍያ ዝርዝር */}
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>ንዑስ ድምር:</span>
                <span>{order.subtotal.toFixed(2)} ብር</span>
              </div>
              <div className="flex justify-between">
                <span>ታክስ:</span>
                <span>{order.tax.toFixed(2)} ብር</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>ቅናሽ:</span>
                  <span>-{order.discount.toFixed(2)} ብር</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>ጠቅላላ:</span>
                <span>{order.totalAmount.toFixed(2)} ብር</span>
              </div>
            </div>
          </div>

          {/* ማስታወሻዎች */}
          {(order.kitchenNotes || order.customerNotes) && (
            <div>
              <h4 className="font-semibold mb-2">ማስታወሻዎች</h4>
              {order.kitchenNotes && (
                <p className="text-sm bg-orange-50 p-2 rounded">
                  <strong>ለኩሽና:</strong> {order.kitchenNotes}
                </p>
              )}
              {order.customerNotes && (
                <p className="text-sm bg-blue-50 p-2 rounded mt-2">
                  <strong>ከደንበኛ:</strong> {order.customerNotes}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
