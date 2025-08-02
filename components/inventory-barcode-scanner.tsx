"use client"

import { useState } from "react"
import { Camera, Package, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarcodeScannerModal } from "./barcode-scanner-modal"
import { BarcodeGenerator } from "@/lib/barcode-generator"
import { inventoryService } from "@/lib/inventory-management"
import { toast } from "@/hooks/use-toast"
import type { InventoryItem } from "@/types/inventory"

export function InventoryBarcodeScanner() {
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [scannedItem, setScannedItem] = useState<InventoryItem | null>(null)
  const [stockUpdateData, setStockUpdateData] = useState({
    type: "in" as "in" | "out",
    quantity: 0,
    reason: "",
  })

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

    // Look for inventory item
    const inventoryItems = inventoryService.getAllInventoryItems()
    const foundItem = inventoryItems.find(
      (item) =>
        item.barcode === barcode ||
        item.id.includes(parsed.id) ||
        item.name.toLowerCase().includes(barcode.toLowerCase()),
    )

    if (foundItem) {
      setScannedItem(foundItem)
      toast({
        title: "Item Found",
        description: `${foundItem.nameAmharic} - Current Stock: ${foundItem.currentStock} ${foundItem.unit}`,
      })
    } else {
      toast({
        title: "Item Not Found",
        description: `No inventory item found for barcode: ${barcode}`,
        variant: "destructive",
      })
    }
  }

  const handleStockUpdate = () => {
    if (!scannedItem || stockUpdateData.quantity <= 0 || !stockUpdateData.reason.trim()) {
      toast({
        title: "Invalid Data",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const success = inventoryService.updateStock(
      scannedItem.id,
      stockUpdateData.quantity,
      stockUpdateData.type,
      stockUpdateData.reason,
      "Barcode Scanner User",
    )

    if (success) {
      toast({
        title: "Stock Updated",
        description: `${scannedItem.nameAmharic} stock ${stockUpdateData.type === "in" ? "increased" : "decreased"} by ${stockUpdateData.quantity} ${scannedItem.unit}`,
      })

      // Reset form
      setScannedItem(null)
      setStockUpdateData({
        type: "in",
        quantity: 0,
        reason: "",
      })
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update stock. Please try again.",
        variant: "destructive",
      })
    }
  }

  const generateBarcode = () => {
    if (!scannedItem) return

    const newBarcode = BarcodeGenerator.generateInventoryBarcode(scannedItem.id, scannedItem.supplierId)

    // Update item with new barcode
    inventoryService.updateInventoryItem(scannedItem.id, { barcode: newBarcode })

    setScannedItem({
      ...scannedItem,
      barcode: newBarcode,
    })

    toast({
      title: "Barcode Generated",
      description: `New barcode: ${newBarcode}`,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Inventory Barcode Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => setIsScannerOpen(true)} className="w-full" size="lg">
            <Camera className="mr-2 h-5 w-5" />
            Scan Inventory Barcode
          </Button>

          <div className="text-xs text-muted-foreground text-center">
            Scan inventory item barcodes to quickly update stock levels
          </div>
        </CardContent>
      </Card>

      {scannedItem && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Scanned Item
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium">{scannedItem.nameAmharic}</h4>
                  <p className="text-sm text-muted-foreground">{scannedItem.name}</p>
                </div>
                <Badge variant="outline" style={{ borderColor: scannedItem.category.color }}>
                  {scannedItem.category.nameAmharic}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Current Stock:</span>
                  <div className="font-medium">
                    {scannedItem.currentStock} {scannedItem.unit}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Min Level:</span>
                  <div className="font-medium">
                    {scannedItem.minStockLevel} {scannedItem.unit}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Unit Price:</span>
                  <div className="font-medium">{scannedItem.unitPrice} ብር</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <div className="font-medium">{scannedItem.location}</div>
                </div>
              </div>

              {scannedItem.barcode ? (
                <div className="mt-2 text-xs font-mono bg-white p-2 rounded border">Barcode: {scannedItem.barcode}</div>
              ) : (
                <Button onClick={generateBarcode} variant="outline" size="sm" className="mt-2 bg-transparent">
                  Generate Barcode
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Update Stock</h4>

              <div>
                <Label>Action Type</Label>
                <Select
                  value={stockUpdateData.type}
                  onValueChange={(value: "in" | "out") => setStockUpdateData((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">
                      <div className="flex items-center">
                        <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
                        Stock In (Add)
                      </div>
                    </SelectItem>
                    <SelectItem value="out">
                      <div className="flex items-center">
                        <TrendingDown className="mr-2 h-4 w-4 text-red-600" />
                        Stock Out (Remove)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Quantity ({scannedItem.unit})</Label>
                <Input
                  type="number"
                  min="1"
                  value={stockUpdateData.quantity}
                  onChange={(e) => setStockUpdateData((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                />
              </div>

              <div>
                <Label>Reason</Label>
                <Textarea
                  value={stockUpdateData.reason}
                  onChange={(e) => setStockUpdateData((prev) => ({ ...prev, reason: e.target.value }))}
                  placeholder="Enter reason for stock change..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleStockUpdate} className="flex-1">
                  Update Stock
                </Button>
                <Button onClick={() => setScannedItem(null)} variant="outline">
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleBarcodeScan}
        title="Scan Inventory Barcode"
      />
    </div>
  )
}
