"use client"

import { useAuth } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { DiningMode } from "@/components/dining-mode"
import { CategoryFilter } from "@/components/category-filter"
import { FoodGrid } from "@/components/food-grid"
import { Cart } from "@/components/cart"
import { POSBarcodeScanner } from "@/components/pos-barcode-scanner"
import { InventoryBarcodeScanner } from "@/components/inventory-barcode-scanner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  ShoppingCart,
  Clock,
  TrendingUp,
  Package,
  AlertTriangle,
  Camera,
  Utensils,
  ChefHat,
  CreditCard,
} from "lucide-react"
import { useState } from "react"

export default function HomePage() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Restaurant POS</h1>
          <p className="text-muted-foreground">Please log in to continue</p>
        </div>
      </div>
    )
  }

  // Admin Dashboard
  if (user.role === "admin") {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Restaurant management overview</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Administrator
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,231 ብር</div>
              <p className="text-xs text-muted-foreground">+8% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tables</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18/24</div>
              <p className="text-xs text-muted-foreground">75% occupancy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">7</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Barcode Scanner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Scan product or inventory barcodes for quick access</p>
              <div className="grid grid-cols-2 gap-4">
                <POSBarcodeScanner />
                <InventoryBarcodeScanner />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Manage Inventory
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View Staff
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Sales Reports
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Utensils className="mr-2 h-4 w-4" />
                Menu Management
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Kitchen Dashboard
  if (user.role === "kitchen") {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Kitchen Dashboard</h1>
            <p className="text-muted-foreground">Order preparation and management</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <ChefHat className="mr-2 h-4 w-4" />
            Kitchen Staff
          </Badge>
        </div>

        {/* Kitchen Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">8</div>
              <p className="text-xs text-muted-foreground">Avg wait: 12 min</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <ChefHat className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">5</div>
              <p className="text-xs text-muted-foreground">Being prepared</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">89</div>
              <p className="text-xs text-muted-foreground">+15% from yesterday</p>
            </CardContent>
          </Card>
        </div>

        {/* Barcode Scanner for Kitchen */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Kitchen Barcode Scanner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Scan order barcodes or ingredient barcodes for quick access
            </p>
            <POSBarcodeScanner />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Cashier/POS Interface
  return (
    <CartProvider>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Point of Sale</h1>
            <p className="text-muted-foreground">Process orders and payments</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <CreditCard className="mr-2 h-4 w-4" />
            Cashier
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Menu and Scanner */}
          <div className="lg:col-span-3 space-y-6">
            {/* Barcode Scanner */}
            <POSBarcodeScanner />

            {/* Dining Mode */}
            <DiningMode />

            {/* Category Filter */}
            <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

            {/* Food Grid */}
            <FoodGrid selectedCategory={selectedCategory} />
          </div>

          {/* Right Column - Cart */}
          <div className="lg:col-span-1">
            <Cart />
          </div>
        </div>
      </div>
    </CartProvider>
  )
}
