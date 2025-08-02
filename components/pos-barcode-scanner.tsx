"use client"

import { useState } from "react"
import { Camera, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarcodeScannerModal } from "./barcode-scanner-modal"
import { BarcodeGenerator } from "@/lib/barcode-generator"
import { foodService } from "@/lib/food-management"
import { inventoryService } from "@/lib/inventory-management"
import { useCart } from "@/contexts/cart-context"
import { toast } from "@/hooks/use-toast"

export function POSBarcodeScanner() {
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [lastScannedItem, setLastScannedItem] = useState<any>(null)
  const { addToCart } = useCart()

  const handleBarcodeScan = (barcode: string) => {
    const parsed = BarcodeGenerator.parseBarcode(barcode)

    if (!parsed) {
      toast({
        title: "Invalid Barcode",
        description: "The scanned barcode is not valid.",
        variant: "destructive",
      })
      return
    }

    let foundItem = null

    if (parsed.type === "product") {
      // Look for food item
      const foods = foodService.getAllFoods()
      foundItem = foods.find((food) => food.barcode === barcode || food.id.includes(parsed.id))

      if (foundItem) {
        addToCart({
          id: foundItem.id,
          name: foundItem.name,
          nameAmharic: foundItem.nameAmharic,
          price: foundItem.price,
          image: foundItem.image,
          category: foundItem.category,
        })

        setLastScannedItem({
          ...foundItem,
          type: "product",
        })

        toast({
          title: "Product Added",
          description: `${foundItem.nameAmharic} added to cart`,
        })
      }
    } else if (parsed.type === "inventory") {
      // Look for inventory item
      const inventoryItems = inventoryService.getAllInventoryItems()
      foundItem = inventoryItems.find((item) => item.barcode === barcode || item.id.includes(parsed.id))

      if (foundItem) {
        setLastScannedItem({
          ...foundItem,
          type: "inventory",
        })

        toast({
          title: "Inventory Item Found",
          description: `${foundItem.nameAmharic} - Stock: ${foundItem.currentStock} ${foundItem.unit}`,
        })
      }
    }

    if (!foundItem) {
      toast({
        title: "Item Not Found",
        description: `No item found for barcode: ${barcode}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Barcode Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => setIsScannerOpen(true)} className="w-full" size="lg">
            <Camera className="mr-2 h-5 w-5" />
            Scan Product Barcode
          </Button>

          {lastScannedItem && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium">{lastScannedItem.nameAmharic}</h4>
                  <p className="text-sm text-muted-foreground">{lastScannedItem.name}</p>
                </div>
                <Badge variant="outline">{lastScannedItem.type === "product" ? "Product" : "Inventory"}</Badge>
              </div>

              {lastScannedItem.type === "product" ? (
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">{lastScannedItem.price} ብር</span>
                  <Button
                    size="sm"
                    onClick={() =>
                      addToCart({
                        id: lastScannedItem.id,
                        name: lastScannedItem.name,
                        nameAmharic: lastScannedItem.nameAmharic,
                        price: lastScannedItem.price,
                        image: lastScannedItem.image,
                        category: lastScannedItem.category,
                      })
                    }
                  >
                    <ShoppingCart className="mr-1 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              ) : (
                <div className="text-sm">
                  <div>
                    Stock: {lastScannedItem.currentStock} {lastScannedItem.unit}
                  </div>
                  <div>
                    Price: {lastScannedItem.unitPrice} ብር per {lastScannedItem.unit}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            Scan product barcodes to quickly add items to cart or check inventory
          </div>
        </CardContent>
      </Card>

      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleBarcodeScan}
        title="Scan Product or Inventory Barcode"
      />
    </div>
  )
}
