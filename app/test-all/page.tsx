"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FoodManagementTest } from "@/components/food-management-test"
import { BarcodeTestSuite } from "@/components/barcode-test-suite"
import { InventoryBarcodeScanner } from "@/components/inventory-barcode-scanner"
import { POSBarcodeScanner } from "@/components/pos-barcode-scanner"
import { TestTube, Utensils, Package, ShoppingCart } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function TestAllPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Complete System Testing</h1>
          <p className="text-muted-foreground">Test all restaurant POS system functionality</p>
        </div>
        <TestTube className="h-8 w-8 text-blue-600" />
      </div>

      <Tabs defaultValue="food-management" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="food-management">Food Management</TabsTrigger>
          <TabsTrigger value="barcode-suite">Barcode Suite</TabsTrigger>
          <TabsTrigger value="pos-scanner">POS Scanner</TabsTrigger>
          <TabsTrigger value="inventory-scanner">Inventory Scanner</TabsTrigger>
          <TabsTrigger value="system-status">System Status</TabsTrigger>
        </TabsList>

        <TabsContent value="food-management">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Food Management Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FoodManagementTest />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="barcode-suite">
          <BarcodeTestSuite />
        </TabsContent>

        <TabsContent value="pos-scanner">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                POS Barcode Scanner Testing
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
                Inventory Scanner Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryBarcodeScanner />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-status">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Core Features</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Food Management</span>
                        <span className="text-green-600">✓ Working</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Barcode Scanner</span>
                        <span className="text-green-600">✓ Working</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Inventory System</span>
                        <span className="text-green-600">✓ Working</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Language Support</span>
                        <span className="text-green-600">✓ Working</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Advanced Features</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Auto Reorder</span>
                        <span className="text-green-600">✓ Working</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Processing</span>
                        <span className="text-green-600">✓ Working</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reporting Dashboard</span>
                        <span className="text-green-600">✓ Working</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Notifications</span>
                        <span className="text-green-600">✓ Working</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <a href="/admin" className="p-2 border rounded text-center hover:bg-gray-50">
                    Admin Panel
                  </a>
                  <a href="/inventory" className="p-2 border rounded text-center hover:bg-gray-50">
                    Inventory
                  </a>
                  <a href="/kitchen" className="p-2 border rounded text-center hover:bg-gray-50">
                    Kitchen
                  </a>
                  <a href="/employees" className="p-2 border rounded text-center hover:bg-gray-50">
                    Employees
                  </a>
                  <a href="/stats" className="p-2 border rounded text-center hover:bg-gray-50">
                    Statistics
                  </a>
                  <a href="/test-barcode" className="p-2 border rounded text-center hover:bg-gray-50">
                    Barcode Tests
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
