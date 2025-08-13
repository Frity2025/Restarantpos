"use client"

import { BarcodeTestSuite } from "@/components/barcode-test-suite"
import { POSBarcodeScanner } from "@/components/pos-barcode-scanner"
import { InventoryBarcodeScanner } from "@/components/inventory-barcode-scanner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TestTube, Info, Package, ShoppingCart } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function TestBarcodePage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("barcodeScanner")} Testing Suite</h1>
          <p className="text-muted-foreground">Test and validate barcode scanning functionality</p>
        </div>
        <TestTube className="h-8 w-8 text-blue-600" />
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This comprehensive testing suite allows you to validate barcode generation, parsing, and scanning
          functionality. Use the sample products provided or test with custom barcodes.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="test-suite" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="test-suite">Test Suite</TabsTrigger>
          <TabsTrigger value="pos-scanner">POS Scanner</TabsTrigger>
          <TabsTrigger value="inventory-scanner">Inventory Scanner</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
        </TabsList>

        <TabsContent value="test-suite">
          <BarcodeTestSuite />
        </TabsContent>

        <TabsContent value="pos-scanner">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                POS Barcode Scanner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <POSBarcodeScanner />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory-scanner">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Barcode Scanner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryBarcodeScanner />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructions">
          <Card>
            <CardHeader>
              <CardTitle>Testing Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Automated Tests</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>
                      • <strong>Validation Tests:</strong> Check if generated barcodes are valid
                    </li>
                    <li>
                      • <strong>Parsing Tests:</strong> Verify barcode type detection
                    </li>
                    <li>
                      • <strong>Generation Tests:</strong> Test barcode creation for different categories
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Manual Tests</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>
                      • <strong>Live Scan:</strong> Use camera to scan physical barcodes
                    </li>
                    <li>
                      • <strong>Custom Test:</strong> Enter any barcode for validation
                    </li>
                    <li>
                      • <strong>Sample Data:</strong> Test with provided sample products
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-2">Sample Barcodes for Testing</h4>
                <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                  <div>
                    Product: <code>0210000001234</code>
                  </div>
                  <div>
                    Inventory: <code>0120000004567</code>
                  </div>
                  <div>
                    Order: <code>ORD000001789</code>
                  </div>
                  <div>
                    Custom: <code>1234567890123</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
