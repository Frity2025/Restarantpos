"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  ChefHat,
  Package,
  AlertTriangle,
  Plus,
  Eye,
  Settings,
  BarChart3,
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { Header } from "@/components/header"
import { SidebarNav } from "@/components/sidebar-nav"
import { DiningMode } from "@/components/dining-mode"
import { CategoryFilter } from "@/components/category-filter"
import { FoodGrid } from "@/components/food-grid"
import { Cart } from "@/components/cart"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"

export default function HomePage() {
  const { employee, hasPermission } = useAuth()
  const { items } = useCart()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [diningMode, setDiningMode] = useState("dine-in")

  // Mock data for dashboard
  const stats = {
    todayOrders: 45,
    todayRevenue: 12500,
    activeOrders: 8,
    pendingOrders: 3,
    lowStockItems: 5,
    tablesOccupied: 12,
    totalTables: 20,
  }

  const recentOrders = [
    { id: "ORD-001", table: "ጠረጴዛ 5", items: 3, total: 450, status: "preparing", time: "5 ደቂቃ በፊት" },
    { id: "ORD-002", table: "ጠረጴዛ 2", items: 2, total: 320, status: "ready", time: "8 ደቂቃ በፊት" },
    { id: "ORD-003", table: "ጠረጴዛ 8", items: 4, total: 680, status: "served", time: "12 ደቂቃ በፊት" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparing":
        return "bg-yellow-100 text-yellow-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "served":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "preparing":
        return "እየተዘጋጀ"
      case "ready":
        return "ዝግጁ"
      case "served":
        return "ተቀርቧል"
      default:
        return status
    }
  }

  const getRoleBasedQuickActions = () => {
    const actions = []

    if (hasPermission("pos_create")) {
      actions.push({
        title: "አዲስ ትዕዛዝ",
        description: "አዲስ ትዕዛዝ ይጀምሩ",
        icon: Plus,
        href: "/",
        color: "bg-blue-500 hover:bg-blue-600",
      })
    }

    if (hasPermission("view_orders")) {
      actions.push({
        title: "ትዕዛዞች",
        description: "ሁሉንም ትዕዛዞች ይመልከቱ",
        icon: Eye,
        href: "/orders",
        color: "bg-green-500 hover:bg-green-600",
      })
    }

    if (hasPermission("kitchen_access")) {
      actions.push({
        title: "ኩሽና",
        description: "የኩሽና ዳሽቦርድ",
        icon: ChefHat,
        href: "/kitchen",
        color: "bg-orange-500 hover:bg-orange-600",
      })
    }

    if (hasPermission("admin_access")) {
      actions.push({
        title: "አስተዳደር",
        description: "የስርዓት ቅንብሮች",
        icon: Settings,
        href: "/admin",
        color: "bg-purple-500 hover:bg-purple-600",
      })
    }

    if (hasPermission("view_analytics")) {
      actions.push({
        title: "ሪፖርቶች",
        description: "የሽያጭ ሪፖርቶች",
        icon: BarChart3,
        href: "/stats",
        color: "bg-indigo-500 hover:bg-indigo-600",
      })
    }

    return actions
  }

  const quickActions = getRoleBasedQuickActions()

  return (
    <ProtectedRoute requiredPermissions={["pos_view", "admin_access", "kitchen_access"]}>
      <div className="flex h-screen bg-gray-50">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {employee?.role === "admin" ? (
              // Admin Dashboard
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">ዳሽቦርድ</h1>
                    <p className="text-gray-600">እንኳን ደህና መጡ, {employee.name}</p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">አስተዳዳሪ</Badge>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">የዛሬ ትዕዛዞች</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.todayOrders}</div>
                      <p className="text-xs text-muted-foreground">+12% ከትናንት</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">የዛሬ ገቢ</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.todayRevenue.toLocaleString()} ብር</div>
                      <p className="text-xs text-muted-foreground">+8% ከትናንት</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">ንቁ ትዕዛዞች</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.activeOrders}</div>
                      <p className="text-xs text-muted-foreground">{stats.pendingOrders} በመጠባበቅ ላይ</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">ጠረጴዛዎች</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.tablesOccupied}/{stats.totalTables}
                      </div>
                      <Progress value={(stats.tablesOccupied / stats.totalTables) * 100} className="mt-2" />
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>ፈጣን እርምጃዎች</CardTitle>
                    <CardDescription>በተደጋጋሚ የሚጠቀሙባቸው ተግባራት</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {quickActions.map((action, index) => (
                        <Link key={index} href={action.href}>
                          <Button className={`w-full h-20 flex flex-col gap-2 ${action.color} text-white`}>
                            <action.icon className="h-6 w-6" />
                            <span className="text-sm font-medium">{action.title}</span>
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Orders and Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>የቅርብ ጊዜ ትዕዛዞች</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{order.id}</span>
                                <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {order.table} • {order.items} ንጥሎች
                              </p>
                              <p className="text-xs text-gray-500">{order.time}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{order.total} ብር</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        ማስጠንቀቂያዎች
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                          <Package className="h-4 w-4 text-yellow-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">ዝቅተኛ ክምችት</p>
                            <p className="text-xs text-gray-600">{stats.lowStockItems} ንጥሎች ዝቅተኛ ደረጃ ላይ</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">በመጠባበቅ ላይ ያሉ ትዕዛዞች</p>
                            <p className="text-xs text-gray-600">{stats.pendingOrders} ትዕዛዞች ትኩረት ይፈልጋሉ</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : employee?.role === "kitchen" ? (
              // Kitchen Dashboard
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">ኩሽና ዳሽቦርድ</h1>
                    <p className="text-gray-600">እንኳን ደህና መጡ, {employee.name}</p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">ኩሽና ሰራተኛ</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        በመጠባበቅ ላይ
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</div>
                      <p className="text-sm text-gray-600">ትዕዛዞች</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ChefHat className="h-5 w-5 text-blue-600" />
                        እየተዘጋጀ
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">{stats.activeOrders}</div>
                      <p className="text-sm text-gray-600">ትዕዛዞች</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        ዛሬ ተጠናቀቁ
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">
                        {stats.todayOrders - stats.activeOrders - stats.pendingOrders}
                      </div>
                      <p className="text-sm text-gray-600">ትዕዛዞች</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>የቅርብ ጊዜ ትዕዛዞች</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders
                        .filter((order) => order.status !== "served")
                        .map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{order.id}</span>
                                <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {order.table} • {order.items} ንጥሎች
                              </p>
                              <p className="text-xs text-gray-500">{order.time}</p>
                            </div>
                            <div className="flex gap-2">
                              {order.status === "preparing" && (
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  ዝግጁ ነው
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                ዝርዝር
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Cashier POS Interface
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">የሽያጭ ነጥብ</h1>
                    <p className="text-gray-600">እንኳን ደህና መጡ, {employee.name}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">ገንዘብ ተቀባይ</Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                  {/* Left Panel - Menu */}
                  <div className="lg:col-span-2 space-y-4">
                    <DiningMode value={diningMode} onChange={setDiningMode} />
                    <CategoryFilter value={selectedCategory} onChange={setSelectedCategory} />
                    <div className="flex-1 overflow-y-auto">
                      <FoodGrid selectedCategory={selectedCategory} />
                    </div>
                  </div>

                  {/* Right Panel - Cart */}
                  <div className="lg:col-span-1">
                    <Cart diningMode={diningMode} />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
