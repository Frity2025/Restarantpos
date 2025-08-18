"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { CategoryFilter } from "@/components/category-filter"
import { FoodGrid } from "@/components/food-grid"
import { Cart } from "@/components/cart"
import { BarcodeInput } from "@/components/barcode-input"
import { Search, ShoppingCart, Scan, Settings } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { t, formatCurrency } = useLanguage()
  const { items, getTotal, getItemCount } = useCart()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Restaurant POS</h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                v2.0
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  {t("admin")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={t("search")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Dialog open={showBarcodeScanner} onOpenChange={setShowBarcodeScanner}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Scan className="h-4 w-4 mr-2" />
                      {t("scanBarcode")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("barcodeScanner")}</DialogTitle>
                    </DialogHeader>
                    <BarcodeInput onClose={() => setShowBarcodeScanner(false)} />
                  </DialogContent>
                </Dialog>
              </div>

              <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
            </div>

            {/* Food Grid */}
            <FoodGrid searchTerm={searchTerm} selectedCategory={selectedCategory} />
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    {t("cart")}
                  </span>
                  <Badge variant="secondary">{getItemCount()}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Cart />

                {items.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>{t("total")}:</span>
                      <span>{formatCurrency(getTotal())}</span>
                    </div>
                    <Button className="w-full mt-4" size="lg">
                      {t("checkout")}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
