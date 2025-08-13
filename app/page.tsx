"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FoodGrid } from "@/components/food-grid"
import { Cart } from "@/components/cart"
import { CategoryFilter } from "@/components/category-filter"
import { DiningMode } from "@/components/dining-mode"
import { POSBarcodeScanner } from "@/components/pos-barcode-scanner"
import { useCart } from "@/contexts/cart-context"
import { useLanguage } from "@/contexts/language-context"
import { foodService } from "@/lib/food-management"
import { ShoppingCart, Search, Scan } from "lucide-react"
import type { Food } from "@/types/order"

export default function HomePage() {
  const { items, getTotal, getTotalItems } = useCart()
  const { t, formatCurrency } = useLanguage()
  const [foods, setFoods] = useState<Food[]>([])
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showScanner, setShowScanner] = useState(false)
  const [diningMode, setDiningMode] = useState<"dine-in" | "takeout" | "delivery">("dine-in")

  useEffect(() => {
    const allFoods = foodService.getAllFoods()
    setFoods(allFoods)
    setFilteredFoods(allFoods)
  }, [])

  useEffect(() => {
    let filtered = foods

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((food) => food.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (food) =>
          food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          food.nameAmharic.includes(searchTerm) ||
          food.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          food.descriptionAmharic.includes(searchTerm),
      )
    }

    // Only show available items
    filtered = filtered.filter((food) => food.isAvailable)

    setFilteredFoods(filtered)
  }, [foods, selectedCategory, searchTerm])

  const handleBarcodeScanned = (barcode: string) => {
    const food = foodService.getFoodByBarcode(barcode)
    if (food) {
      // Add to cart logic would go here
      console.log("Food found:", food)
    }
    setShowScanner(false)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">{t("home")}</h1>
              <p className="text-muted-foreground">
                {filteredFoods.length} {t("available")} items
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowScanner(true)} className="flex items-center gap-2">
                <Scan className="h-4 w-4" />
                {t("search")} Barcode
              </Button>
            </div>
          </div>

          {/* Dining Mode */}
          <DiningMode value={diningMode} onChange={setDiningMode} />

          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder={`${t("search")} foods...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
              </div>
            </CardContent>
          </Card>

          {/* Food Grid */}
          <FoodGrid foods={filteredFoods} />

          {/* Barcode Scanner Modal */}
          {showScanner && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Scan Barcode</h3>
                <POSBarcodeScanner onBarcodeScanned={handleBarcodeScanned} onClose={() => setShowScanner(false)} />
              </div>
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    {t("orders")}
                  </div>
                  <Badge variant="secondary">{getTotalItems()} items</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Cart />
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>{t("total")}:</span>
                    <span>{formatCurrency(getTotal())}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
