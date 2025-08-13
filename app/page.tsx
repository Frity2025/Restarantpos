"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FoodGrid } from "@/components/food-grid"
import { Cart } from "@/components/cart"
import { CategoryFilter } from "@/components/category-filter"
import { DiningMode } from "@/components/dining-mode"
import { Header } from "@/components/header"
import { SidebarNav } from "@/components/sidebar-nav"
import { POSBarcodeScanner } from "@/components/pos-barcode-scanner"
import { useCart } from "@/contexts/cart-context"
import { useLanguage } from "@/contexts/language-context"
import { foodService } from "@/lib/food-management"
import { ShoppingCart, Utensils, Clock, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { t, formatCurrency } = useLanguage()
  const { items, getTotal } = useCart() // Fixed: using getTotal instead of getTotalPrice
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [diningMode, setDiningMode] = useState<"dine-in" | "takeout" | "delivery">("dine-in")
  const [foods, setFoods] = useState(foodService.getAllFoods())

  const filteredFoods = selectedCategory === "all" ? foods : foods.filter((food) => food.category === selectedCategory)

  const stats = {
    totalOrders: 156,
    revenue: 45231,
    activeOrders: 12,
    avgOrderTime: 18,
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarNav />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Stats Bar */}
            <div className="bg-white border-b p-4">
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t("totalRevenue")}</CardTitle>
                    <Utensils className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.revenue)}</div>
                    <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalOrders}</div>
                    <p className="text-xs text-muted-foreground">+8 new orders</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeOrders}</div>
                    <p className="text-xs text-muted-foreground">In kitchen</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Order Time</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.avgOrderTime}m</div>
                    <p className="text-xs text-muted-foreground">-2m from average</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white border-b p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <DiningMode value={diningMode} onChange={setDiningMode} />
                  <Badge variant="outline" className="flex items-center gap-1">
                    <ShoppingCart className="h-3 w-3" />
                    {items.length} items - {formatCurrency(getTotal())}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Link href="/test-barcode">
                    <Button variant="outline" size="sm">
                      Test Barcode Scanner
                    </Button>
                  </Link>
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      Admin Panel
                    </Button>
                  </Link>
                </div>
              </div>

              <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
            </div>

            {/* Food Grid */}
            <div className="flex-1 overflow-auto p-4">
              <FoodGrid foods={filteredFoods} />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-96 bg-white border-l flex flex-col">
            {/* Barcode Scanner */}
            <div className="p-4 border-b">
              <POSBarcodeScanner />
            </div>

            {/* Cart */}
            <div className="flex-1 overflow-auto">
              <Cart />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
