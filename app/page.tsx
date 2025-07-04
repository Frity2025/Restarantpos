"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  ArrowRight,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { SidebarNav } from "@/components/sidebar-nav"
import { ProtectedRoute } from "@/components/protected-route"
import Link from "next/link"

// Mock data
const dashboardStats = {
  todayOrders: 45,
  todayRevenue: 12500,
  activeCustomers: 23,
  avgOrderValue: 278,
}

const recentOrders = [
  {
    id: "ORD-001",
    table: 5,
    customer: "አህመድ አሊ",
    items: 3,
    total: 420,
    status: "preparing",
    time: "10 ደቂቃ በፊት",
  },
  {
    id: "ORD-002",
    table: 8,
    customer: "ፋጢማ መሀመድ",
    items: 2,
    total: 180,
    status: "ready",
    time: "15 ደቂቃ በፊት",
  },
  {
    id: "ORD-003",
    table: 3,
    customer: "ዳዊት ተስፋዬ",
    items: 4,
    total: 650,
    status: "completed",
    time: "25 ደቂቃ በፊት",
  },
]

const quickActions = [
  {
    title: "አዲስ ትዕዛዝ",
    description: "አዲስ ትዕዛዝ ይጀምሩ",
    icon: Plus,
    href: "/orders",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "ኩሽና ይመልከቱ",
    description: "የኩሽና ሁኔታ ይመልከቱ",
    icon: Eye,
    href: "/kitchen",
    color: "bg-orange-500 hover:bg-orange-600",
  },
  {
    title: "ክፍያዎች",
    description: "ክፍያዎችን ያስተዳድሩ",
    icon: DollarSign,
    href: "/payments",
    color: "bg-green-500 hover:bg-green-600",
  },
]

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
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "pending":
      return "በመጠባበቅ"
    case "preparing":
      return "በዝግጅት"
    case "ready":
      return "ዝግጁ"
    case "completed":
      return "ተጠናቋል"
    default:
      return status
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "pending":
      return <Clock className="h-3 w-3" />
    case "preparing":
      return <AlertTriangle className="h-3 w-3" />
    case "ready":
    case "completed":
      return <CheckCircle className="h-3 w-3" />
    default:
      return <Clock className="h-3 w-3" />
  }
}

function DashboardContent() {
  const { employee } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">እንኳን ደህና መጡ, {employee?.name}!</h1>
                <p className="text-gray-600 mt-1">
                  {currentTime.toLocaleDateString("am-ET", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  - {currentTime.toLocaleTimeString("am-ET")}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800 px-3 py-1">
                {employee?.role === "admin"
                  ? "አስተዳዳሪ"
                  : employee?.role === "cashier"
                    ? "ገንዘብ ተቀባይ"
                    : employee?.role === "kitchen"
                      ? "ኩሽና ሰራተኛ"
                      : "ተጠቃሚ"}
              </Badge>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">የዛሬ ትዕዛዞች</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.todayOrders}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> ከትናንት
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">የዛሬ ገቢ</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.todayRevenue.toLocaleString()} ብር</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8%</span> ከትናንት
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ንቁ ደንበኞች</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.activeCustomers}</div>
                <p className="text-xs text-muted-foreground">በአሁኑ ጊዜ በምግብ ቤት ውስጥ</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">አማካይ ትዕዛዝ</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.avgOrderValue} ብር</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+5%</span> ከትናንት
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>የቅርብ ጊዜ ትዕዛዞች</CardTitle>
                    <CardDescription>የዛሬ የቅርብ ጊዜ ትዕዛዞች</CardDescription>
                  </div>
                  <Link href="/orders">
                    <Button variant="outline" size="sm">
                      ሁሉንም ይመልከቱ
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">T{order.table}</span>
                        </div>
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                          <p className="text-xs text-gray-500">
                            {order.items} ምግቦች • {order.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="font-medium">{order.total} ብር</p>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{getStatusText(order.status)}</span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>ፈጣን እርምጃዎች</CardTitle>
                <CardDescription>በተደጋጋሚ የሚጠቀሙባቸው ተግባራት</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <Link key={index} href={action.href}>
                        <Button
                          className={`w-full justify-start h-auto p-4 ${action.color} text-white`}
                          variant="default"
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-medium">{action.title}</div>
                            <div className="text-xs opacity-90">{action.description}</div>
                          </div>
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
