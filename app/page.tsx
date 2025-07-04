"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Users, DollarSign, TrendingUp, Clock, ChefHat, AlertTriangle, CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function HomePage() {
  const { employee } = useAuth()

  const stats = [
    {
      title: "ዛሬ ትዕዛዞች",
      value: "24",
      change: "+12%",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "ንቁ ደንበኞች",
      value: "18",
      change: "+5%",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "ዛሬ ገቢ",
      value: "12,450 ብር",
      change: "+8%",
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      title: "አማካይ ትዕዛዝ",
      value: "520 ብር",
      change: "+3%",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  const recentOrders = [
    { id: "ORD-001", table: "ጠረጴዛ 4", items: 3, total: "450 ብር", status: "በዝግጅት ላይ" },
    { id: "ORD-002", table: "ጠረጴዛ 2", items: 2, total: "320 ብር", status: "ዝግጁ" },
    { id: "ORD-003", table: "ጠረጴዛ 7", items: 5, total: "680 ብር", status: "በመጠባበቅ ላይ" },
  ]

  const alerts = [
    { type: "warning", message: "ክምችት ዝቅተኛ: ዶሮ ወጥ", time: "5 ደቂቃ በፊት" },
    { type: "info", message: "አዲስ ትዕዛዝ ተቀብሏል", time: "2 ደቂቃ በፊት" },
    { type: "success", message: "ጠረጴዛ 3 ክፍያ ተጠናቋል", time: "1 ደቂቃ በፊት" },
  ]

  return (
    <ProtectedRoute requiredPermission="pos_view">
      <div className="flex h-screen bg-gray-50">
        <SidebarNav />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Welcome Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">እንኳን ደህና መጡ, {employee?.name}!</h1>
                  <p className="text-gray-600 mt-1">ዛሬ የእርስዎ ምግብ ቤት እንዴት እየሰራ ነው እንይ</p>
                </div>
                <div className="flex space-x-2">
                  <Link href="/orders">
                    <Button>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      አዲስ ትዕዛዝ
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <Card key={stat.title}>
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <Icon className={`h-8 w-8 ${stat.color}`} />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                            <div className="flex items-center">
                              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                              <Badge variant="secondary" className="ml-2">
                                {stat.change}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      የቅርብ ጊዜ ትዕዛዞች
                    </CardTitle>
                    <CardDescription>ዛሬ የተደረጉ የቅርብ ጊዜ ትዕዛዞች</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-gray-600">
                              {order.table} • {order.items} ንጥሎች
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{order.total}</p>
                            <Badge
                              variant={
                                order.status === "ዝግጁ"
                                  ? "default"
                                  : order.status === "በዝግጅት ላይ"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Link href="/orders">
                        <Button variant="outline" className="w-full bg-transparent">
                          ሁሉንም ትዕዛዞች ይመልከቱ
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Alerts & Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      ማሳወቂያዎች
                    </CardTitle>
                    <CardDescription>አስፈላጊ ማሳወቂያዎች እና ማንቂያዎች</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {alerts.map((alert, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />}
                          {alert.type === "info" && <ChefHat className="h-5 w-5 text-blue-600 mt-0.5" />}
                          {alert.type === "success" && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{alert.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/orders">
                      <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                        <ShoppingCart className="h-6 w-6" />
                        <span>አዲስ ትዕዛዝ</span>
                      </Button>
                    </Link>
                    <Link href="/kitchen">
                      <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                        <ChefHat className="h-6 w-6" />
                        <span>ኩሽና</span>
                      </Button>
                    </Link>
                    <Link href="/tables">
                      <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                        <Users className="h-6 w-6" />
                        <span>ጠረጴዛዎች</span>
                      </Button>
                    </Link>
                    <Link href="/stats">
                      <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                        <TrendingUp className="h-6 w-6" />
                        <span>ሪፖርቶች</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  )
}
