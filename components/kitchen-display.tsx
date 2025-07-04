"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"
import { orderManager } from "@/lib/order-management"
import type { Order, OrderStatus } from "@/types/order"

const statusNames: Record<OrderStatus, string> = {
  pending: "በመጠባበቅ ላይ",
  confirmed: "ተረጋግጧል",
  preparing: "በዝግጅት ላይ",
  ready: "ዝግጁ ነው",
  served: "ተሰርቷል",
  completed: "ተጠናቋል",
  cancelled: "ተሰርዟል",
}

export function KitchenDisplay() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    loadOrders()
    const interval = setInterval(loadOrders, 30000) // እያንዳንዱ 30 ሰከንድ አድስ
    return () => clearInterval(interval)
  }, [])

  const loadOrders = () => {
    const kitchenOrders = orderManager.getFilteredOrders({
      status: ["confirmed", "preparing"],
    })
    setOrders(kitchenOrders)
  }

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    orderManager.updateOrderStatus(orderId, newStatus)
    loadOrders()
  }

  const getOrderPriority = (order: Order): "high" | "medium" | "low" => {
    const elapsedTime = (Date.now() - order.createdAt.getTime()) / (1000 * 60) // በደቂቃ
    const estimatedTime = order.estimatedTime || 20

    if (elapsedTime > estimatedTime * 1.5) return "high"
    if (elapsedTime > estimatedTime) return "medium"
    return "low"
  }

  const getPriorityColor = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-50"
      case "medium":
        return "border-yellow-500 bg-yellow-50"
      default:
        return "border-green-500 bg-green-50"
    }
  }

  const formatElapsedTime = (createdAt: Date): string => {
    const elapsed = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60))
    return `${elapsed} ደቂቃ`
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">የኩሽና ማሳያ</h2>
        <div className="flex items-center gap-4">
          <Badge variant="destructive">{orders.filter((o) => getOrderPriority(o) === "high").length} አስቸኳይ</Badge>
          <Badge variant="secondary">{orders.length} ጠቅላላ ትዕዛዞች</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => {
          const priority = getOrderPriority(order)
          return (
            <Card key={order.id} className={`border-2 ${getPriorityColor(priority)}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{formatElapsedTime(order.createdAt)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>
                    {order.orderType === "dine_in"
                      ? `ጠረጴዛ ${order.tableNumber}`
                      : order.orderType === "takeaway"
                        ? "ይዞ መሄድ"
                        : "ማድረስ"}
                  </span>
                  <span>{order.customerName || "ያልተሰየመ"}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* የትዕዛዝ ንጥሎች */}
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="font-medium">{item.foodName}</span>
                      <Badge variant="outline">x{item.quantity}</Badge>
                    </div>
                  ))}
                </div>

                {/* ማስታወሻዎች */}
                {order.kitchenNotes && (
                  <div className="bg-yellow-100 p-2 rounded text-sm">
                    <strong>ማስታወሻ:</strong> {order.kitchenNotes}
                  </div>
                )}

                {order.customerNotes && (
                  <div className="bg-blue-100 p-2 rounded text-sm">
                    <strong>ከደንበኛ:</strong> {order.customerNotes}
                  </div>
                )}

                {/* ተግባር ቁልፎች */}
                <div className="flex gap-2">
                  {order.status === "confirmed" && (
                    <Button
                      onClick={() => handleStatusChange(order.id, "preparing")}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      ዝግጅት ጀምር
                    </Button>
                  )}
                  {order.status === "preparing" && (
                    <Button
                      onClick={() => handleStatusChange(order.id, "ready")}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      ዝግጁ ነው
                    </Button>
                  )}
                </div>

                {/* የቅድሚያ አመላካች */}
                {priority === "high" && (
                  <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                    <AlertCircle className="h-4 w-4" />
                    አስቸኳይ - ጊዜ አልፏል!
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">ምንም ትዕዛዝ የለም</p>
          <p className="text-gray-400">አዲስ ትዕዛዞች እዚህ ይታያሉ</p>
        </div>
      )}
    </div>
  )
}
