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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-foreground font-bold text-lg">ር</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">የባህል ምግብ ቤት</h1>
                <p className="text-xs text-muted-foreground">Restaurant POS</p>
              </div>
              <Badge variant="outline" className="hidden sm:inline-flex ml-2 bg-primary/10 text-primary border-primary/20">
                v2.0
              </Badge>
            </div>

            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <Link href="/admin">
                <Button variant="outline" size="sm" className="border-primary/20 text-primary hover:bg-primary/5">
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
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder={t("search")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-card border-border focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <Dialog open={showBarcodeScanner} onOpenChange={setShowBarcodeScanner}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Available Items</h2>
              <FoodGrid searchTerm={searchTerm} selectedCategory={selectedCategory} />
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 shadow-lg border-border bg-card">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 rounded-t-lg">
                <CardTitle className="flex items-center justify-between text-foreground">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    {t("cart")}
                  </span>
                  <Badge className="bg-primary text-primary-foreground">{getItemCount()}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Cart />

                {items.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-foreground font-semibold">{t("total")}:</span>
                      <span className="text-2xl font-bold text-primary">{formatCurrency(getTotal())}</span>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6">
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
