"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarcodeInput } from "@/components/barcode-input"
import { POSBarcodeScanner } from "@/components/pos-barcode-scanner"
import { InventoryBarcodeScanner } from "@/components/inventory-barcode-scanner"
import { useLanguage } from "@/contexts/language-context"
import { Camera, Package, ShoppingCart, CheckCircle, XCircle } from "lucide-react"

export default function TestBarcodePage() {
  const { t } = useLanguage()
  const [scanResults, setScanResults] = useState<
    Array<{
      type: string
      barcode: string
      result: string
      timestamp: Date
      success: boolean
    }>
  >([])

  const handleScanResult = (type: string, barcode: string, result: string, success = true) => {
    setScanResults((prev) => [
      {
        type,
        barcode,
        result,
        timestamp: new Date(),
        success,
      },
      ...prev.slice(0, 9),
    ]) // Keep last 10 results
  }

  const testBarcodes = [
    { code: "1234567890123", type: "Product", name: "Doro Wat" },
    { code: "2345678901234", type: "Product", name: "Injera" },
    { code: "3456789012345", type: "Inventory", name: "Berbere Spice" },
    { code: "4567890123456", type: "Order", name: "Order #1001" },
  ]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Barcode Scanner Testing</h1>
          <p className="text-muted-foreground">Test all barcode scanning functionality</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Camera className="mr-2 h-4 w-4" />
          Test Suite
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* POS Scanner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              POS Barcode Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <POSBarcodeScanner onScanResult={(barcode, result) => handleScanResult("POS", barcode, result)} />
            <div className="space-y-2">
              <h4 className="font-medium">Test with sample barcodes:</h4>
              <div className="grid grid-cols-2 gap-2">
                {testBarcodes
                  .filter((b) => b.type === "Product")
                  .map((barcode) => (
                    <Button
                      key={barcode.code}
                      variant="outline"
                      size="sm"
                      onClick={() => handleScanResult("POS", barcode.code, `Added ${barcode.name} to cart`)}
                    >
                      {barcode.name}
                    </Button>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Scanner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Inventory Barcode Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InventoryBarcodeScanner
              onScanResult={(barcode, result) => handleScanResult("Inventory", barcode, result)}
            />
            <div className="space-y-2">
              <h4 className="font-medium">Test with sample barcodes:</h4>
              <div className="grid grid-cols-2 gap-2">
                {testBarcodes
                  .filter((b) => b.type === "Inventory")
                  .map((barcode) => (
                    <Button
                      key={barcode.code}
                      variant="outline"
                      size="sm"
                      onClick={() => handleScanResult("Inventory", barcode.code, `Updated ${barcode.name} stock`)}
                    >
                      {barcode.name}
                    </Button>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manual Input */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Barcode Input</CardTitle>
          </CardHeader>
          <CardContent>
            <BarcodeInput
              onScan={(barcode) => handleScanResult("Manual", barcode, "Barcode processed manually")}
              placeholder="Enter barcode manually"
            />
          </CardContent>
        </Card>

        {/* Scan Results */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Scan Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {scanResults.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No scans yet</p>
              ) : (
                scanResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <div className="font-medium">
                          {result.type}: {result.barcode}
                        </div>
                        <div className="text-sm text-muted-foreground">{result.result}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{result.timestamp.toLocaleTimeString()}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">1. Camera Scanning</h4>
              <p className="text-sm text-muted-foreground">
                Click "Start Camera" to use your device's camera for live barcode scanning. Point the camera at a
                barcode and it will be detected automatically.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">2. Manual Input</h4>
              <p className="text-sm text-muted-foreground">
                Type or paste a barcode number in the manual input field and press Enter or click the scan button.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">3. Test Buttons</h4>
              <p className="text-sm text-muted-foreground">
                Use the sample barcode buttons to simulate scanning different types of items without needing actual
                barcodes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
