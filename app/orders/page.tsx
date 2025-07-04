"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

// Sample orders data
const sampleOrders = [
  {
    id: "ORD-001",
    tableNumber: 5,
    customerName: "አህመድ አሊ",
    items: [
      { name: "ዶሮ ወጥ", quantity: 2, price: 180 },
      { name: "ኢንጀራ", quantity: 4, price: 15 },
    ],
    total: 420,
    status: "pending",
    orderTime: "2024-01-15T14:30:00Z",
    estimatedTime: 25,
  },
  {
    id: "ORD-002",
    tableNumber: 3,
    customerName: "ፋጢማ መሀመድ",
    items: [
      { name: "ቅጤ ፍርፍር", quantity: 1, price: 85 },
      { name: "ሻይ", quantity: 2, price: 12 },
    ],
    total: 109,
    status: "preparing",
    orderTime: "2024-01-15T14:45:00Z",
    estimatedTime: 15,
  },
  {
    id: "ORD-003",
    tableNumber: 8,
    customerName: "ዳዊት ተስፋዬ",
    items: [
      { name: "ሽሮ ወጥ", quantity: 1, price: 65 },
      { name: "ኢንጀራ", quantity: 2, price: 15 },
    ],
    total: 95,
    status: "ready",
    orderTime: "2024-01-15T15:00:00Z",
    estimatedTime: 0,
  },
]

function getStatusIcon(status: string) {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />
    case "preparing":
      return <AlertCircle className="h-4 w-4" />
    case "ready":
      return <CheckCircle className="h-4 w-4" />
    case "completed":
      return <CheckCircle className="h-4 w-4" />
    case "cancelled":
      return <XCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "preparing":
      return "bg-blue-100 text-blue-800"
    case "ready":
      return "bg-green-100 text-green-800"
    case "completed":
      return "bg-gray-100 text-gray-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "pending":
      return "በመጠባበቅ ላይ"
    case "preparing":
      return "በዝግጅት ላይ"
    case "ready":
      return "ዝግጁ"
    case "completed":
      return "ተጠናቋል"
    case "cancelled":
      return "ተሰርዟል"
    default:
      return "ያልታወቀ"
  }
}

function OrderCard({ order }: { order: any }) {
  const [status, setStatus] = useState(order.status)

  const updateStatus = (newStatus: string) => {
    setStatus(newStatus)
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{order.id}</CardTitle>
            <CardDescription>
              ጠረጴዛ {order.tableNumber} • {order.customerName}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(status)}>
            <div className="flex items-center gap-1">
              {getStatusIcon(status)}
              {getStatusText(status)}
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          {order.items.map((item: any, index: number) => (
            <div key={index} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>{item.quantity * item.price} ብር</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm text-gray-600">
            ጠቅላላ: <span className="font-semibold">{order.total} ብር</span>
          </div>
          <div className="flex gap-2">
            {status === "pending" && (
              <Button size="sm" onClick={() => updateStatus("preparing")}>
                ዝግጅት ጀምር
              </Button>
            )}
            {status === "preparing" && (
              <Button size="sm" onClick={() => updateStatus("ready")}>
                ዝግጁ ነው
              </Button>
            )}
            {status === "ready" && (
              <Button size="sm" onClick={() => updateStatus("completed")}>
                ተጠናቋል
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function OrdersContent() {
  const pendingOrders = sampleOrders.filter((order) => order.status === "pending")
  const preparingOrders = sampleOrders.filter((order) => order.status === "preparing")
  const readyOrders = sampleOrders.filter((order) => order.status === "ready")
  const allOrders = sampleOrders

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">ትዕዛዞች</h1>
        <p className="text-gray-600">የምግብ ቤት ትዕዛዞችን ይቆጣጠሩ</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">ሁሉም ({allOrders.length})</TabsTrigger>
          <TabsTrigger value="pending">በመጠባበቅ ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="preparing">በዝግጅት ({preparingOrders.length})</TabsTrigger>
          <TabsTrigger value="ready">ዝግጁ ({readyOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4">
            {allOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <div className="grid gap-4">
            {pendingOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="preparing" className="mt-6">
          <div className="grid gap-4">
            {preparingOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ready" className="mt-6">
          <div className="grid gap-4">
            {readyOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function OrdersPage() {
  return (
    <ProtectedRoute requiredPermission="orders_view">
      <OrdersContent />
    </ProtectedRoute>
  )
}
