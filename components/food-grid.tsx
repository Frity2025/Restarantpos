"use client"

import { useState, useMemo } from "react"
import { FoodCard } from "./food-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ScanLine } from "lucide-react"
import { foodService } from "@/lib/food-management"
import { BarcodeScannerModal } from "./barcode-scanner-modal"
import { toast } from "@/hooks/use-toast"

interface FoodGridProps {
  selectedCategory: string
}

export function FoodGrid({ selectedCategory }: FoodGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isScannerOpen, setIsScannerOpen] = useState(false)

  const foods = useMemo(() => {
    let filteredFoods = foodService.getFoodsByCategory(selectedCategory)

    if (searchQuery.trim()) {
      filteredFoods = foodService.searchFoods(searchQuery)
    }

    return filteredFoods.filter((food) => food.isAvailable)
  }, [selectedCategory, searchQuery])

  const handleBarcodeScan = (barcode: string) => {
    const food = foodService.getFoodByBarcode(barcode)

    if (food) {
      setSearchQuery(food.name)
      toast({
        title: "Product Found",
        description: `Found: ${food.nameAmharic} (${food.name})`,
      })
    } else {
      toast({
        title: "Product Not Found",
        description: `No product found for barcode: ${barcode}`,
        variant: "destructive",
      })
    }

    setIsScannerOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon" onClick={() => setIsScannerOpen(true)} className="bg-transparent">
          <ScanLine className="h-4 w-4" />
        </Button>
      </div>

      {foods.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {searchQuery ? "No items found matching your search." : "No items available in this category."}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}

      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleBarcodeScan}
        title="Scan Product Barcode"
      />
    </div>
  )
}
