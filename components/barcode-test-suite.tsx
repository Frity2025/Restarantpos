"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  TestTube,
  CheckCircle,
  XCircle,
  Camera,
  Package,
  ShoppingCart,
  Utensils,
  AlertTriangle,
  Copy,
  RefreshCw,
} from "lucide-react"
import { BarcodeGenerator } from "@/lib/barcode-generator"
import { BarcodeScannerModal } from "./barcode-scanner-modal"
import { toast } from "@/hooks/use-toast"

interface TestProduct {
  id: string
  name: string
  nameAmharic: string
  category: string
  price: number
  barcode: string
  type: "product" | "inventory" | "order"
}

interface TestResult {
  testName: string
  barcode: string
  expected: string
  actual: string
  passed: boolean
  timestamp: Date
}

export function BarcodeTestSuite() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [currentTest, setCurrentTest] = useState<string>("")
  const [customBarcode, setCustomBarcode] = useState("")
  const [testLog, setTestLog] = useState<string[]>([])

  // Sample test products with generated barcodes
  const testProducts: TestProduct[] = [
    {
      id: "1",
      name: "Doro Wot",
      nameAmharic: "ዶሮ ወጥ",
      category: "main-dishes",
      price: 350,
      barcode: BarcodeGenerator.generateProductBarcode("1", "main-dishes"),
      type: "product",
    },
    {
      id: "2",
      name: "Injera",
      nameAmharic: "እንጀራ",
      category: "sides",
      price: 25,
      barcode: BarcodeGenerator.generateProductBarcode("2", "sides"),
      type: "product",
    },
    {
      id: "3",
      name: "Ethiopian Coffee",
      nameAmharic: "የኢትዮጵያ ቡና",
      category: "beverages",
      price: 45,
      barcode: BarcodeGenerator.generateProductBarcode("3", "beverages"),
      type: "product",
    },
    {
      id: "4",
      name: "Tibs",
      nameAmharic: "ጥብስ",
      category: "main-dishes",
      price: 280,
      barcode: BarcodeGenerator.generateProductBarcode("4", "main-dishes"),
      type: "product",
    },
    {
      id: "5",
      name: "Honey Wine",
      nameAmharic: "ጠጅ",
      category: "beverages",
      price: 120,
      barcode: BarcodeGenerator.generateProductBarcode("5", "beverages"),
      type: "product",
    },
  ]

  // Sample inventory items
  const testInventoryItems: TestProduct[] = [
    {
      id: "inv1",
      name: "Berbere Spice",
      nameAmharic: "ቤርቤሬ",
      category: "spices",
      price: 0,
      barcode: BarcodeGenerator.generateInventoryBarcode("inv1", "supplier1"),
      type: "inventory",
    },
    {
      id: "inv2",
      name: "Coffee Beans",
      nameAmharic: "የቡና ፍሬ",
      category: "ingredients",
      price: 0,
      barcode: BarcodeGenerator.generateInventoryBarcode("inv2", "supplier2"),
      type: "inventory",
    },
  ]

  // Sample orders
  const testOrders: TestProduct[] = [
    {
      id: "ord1",
      name: "Order #001",
      nameAmharic: "ትዕዛዝ #001",
      category: "orders",
      price: 0,
      barcode: BarcodeGenerator.generateOrderBarcode("ord1"),
      type: "order",
    },
  ]

  const allTestItems = [...testProducts, ...testInventoryItems, ...testOrders]

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setTestLog((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)])
  }

  const runBarcodeValidationTest = () => {
    addToLog("Starting barcode validation tests...")
    let passed = 0
    let total = 0

    allTestItems.forEach((item) => {
      total++
      const isValid = BarcodeGenerator.validateBarcode(item.barcode)
      const testResult: TestResult = {
        testName: `Validate ${item.name}`,
        barcode: item.barcode,
        expected: "valid",
        actual: isValid ? "valid" : "invalid",
        passed: isValid,
        timestamp: new Date(),
      }

      if (isValid) passed++
      setTestResults((prev) => [testResult, ...prev])
    })

    addToLog(`Validation tests completed: ${passed}/${total} passed`)
    toast({
      title: "Validation Tests Complete",
      description: `${passed}/${total} barcodes passed validation`,
      variant: passed === total ? "default" : "destructive",
    })
  }

  const runBarcodeParsingTest = () => {
    addToLog("Starting barcode parsing tests...")
    let passed = 0
    let total = 0

    allTestItems.forEach((item) => {
      total++
      const parsed = BarcodeGenerator.parseBarcode(item.barcode)
      const expectedType = item.type
      const actualType = parsed?.type || "unknown"

      const testResult: TestResult = {
        testName: `Parse ${item.name}`,
        barcode: item.barcode,
        expected: expectedType,
        actual: actualType,
        passed: actualType === expectedType,
        timestamp: new Date(),
      }

      if (testResult.passed) passed++
      setTestResults((prev) => [testResult, ...prev])
    })

    addToLog(`Parsing tests completed: ${passed}/${total} passed`)
    toast({
      title: "Parsing Tests Complete",
      description: `${passed}/${total} barcodes parsed correctly`,
      variant: passed === total ? "default" : "destructive",
    })
  }

  const runGenerationTest = () => {
    addToLog("Starting barcode generation tests...")
    const categories = ["appetizers", "main-dishes", "desserts", "beverages"]
    let passed = 0
    const total = categories.length

    categories.forEach((category) => {
      const barcode = BarcodeGenerator.generateProductBarcode(Date.now().toString(), category)
      const isValid = BarcodeGenerator.validateBarcode(barcode)
      const parsed = BarcodeGenerator.parseBarcode(barcode)

      const testResult: TestResult = {
        testName: `Generate ${category}`,
        barcode: barcode,
        expected: "valid product barcode",
        actual: isValid && parsed?.type === "product" ? "valid product barcode" : "invalid",
        passed: isValid && parsed?.type === "product",
        timestamp: new Date(),
      }

      if (testResult.passed) passed++
      setTestResults((prev) => [testResult, ...prev])
    })

    addToLog(`Generation tests completed: ${passed}/${total} passed`)
    toast({
      title: "Generation Tests Complete",
      description: `${passed}/${total} barcodes generated successfully`,
      variant: passed === total ? "default" : "destructive",
    })
  }

  const testCustomBarcode = () => {
    if (!customBarcode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a barcode to test",
        variant: "destructive",
      })
      return
    }

    addToLog(`Testing custom barcode: ${customBarcode}`)

    const isValid = BarcodeGenerator.validateBarcode(customBarcode)
    const parsed = BarcodeGenerator.parseBarcode(customBarcode)

    const testResult: TestResult = {
      testName: "Custom Barcode Test",
      barcode: customBarcode,
      expected: "valid barcode",
      actual: `${isValid ? "valid" : "invalid"} - type: ${parsed?.type || "unknown"}`,
      passed: isValid,
      timestamp: new Date(),
    }

    setTestResults((prev) => [testResult, ...prev])
    addToLog(`Custom barcode test result: ${isValid ? "PASS" : "FAIL"}`)

    toast({
      title: "Custom Test Complete",
      description: `Barcode ${customBarcode} is ${isValid ? "valid" : "invalid"}`,
      variant: isValid ? "default" : "destructive",
    })
  }

  const handleScanTest = (barcode: string) => {
    addToLog(`Scanned barcode: ${barcode}`)
    setCurrentTest(barcode)

    const parsed = BarcodeGenerator.parseBarcode(barcode)
    const foundItem = allTestItems.find((item) => item.barcode === barcode)

    if (foundItem) {
      addToLog(`✓ Found matching test item: ${foundItem.name}`)
      toast({
        title: "Scan Successful",
        description: `Found: ${foundItem.nameAmharic} (${foundItem.name})`,
      })
    } else {
      addToLog(`✗ No matching test item found`)
      toast({
        title: "Scan Result",
        description: `Barcode: ${barcode} - Type: ${parsed?.type || "unknown"}`,
        variant: "destructive",
      })
    }

    const testResult: TestResult = {
      testName: "Live Scan Test",
      barcode: barcode,
      expected: "recognized item",
      actual: foundItem ? `${foundItem.name}` : "unknown item",
      passed: !!foundItem,
      timestamp: new Date(),
    }

    setTestResults((prev) => [testResult, ...prev])
  }

  const copyBarcode = (barcode: string) => {
    navigator.clipboard.writeText(barcode)
    toast({
      title: "Copied",
      description: "Barcode copied to clipboard",
    })
  }

  const clearResults = () => {
    setTestResults([])
    setTestLog([])
    addToLog("Test results cleared")
  }

  const runAllTests = () => {
    clearResults()
    addToLog("Starting comprehensive test suite...")

    setTimeout(() => runBarcodeValidationTest(), 100)
    setTimeout(() => runBarcodeParsingTest(), 500)
    setTimeout(() => runGenerationTest(), 1000)

    addToLog("All automated tests queued")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Barcode Testing Suite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button onClick={runAllTests} className="bg-blue-600 hover:bg-blue-700">
              <TestTube className="mr-2 h-4 w-4" />
              Run All Tests
            </Button>
            <Button onClick={runBarcodeValidationTest} variant="outline" className="bg-transparent">
              Validation Tests
            </Button>
            <Button onClick={runBarcodeParsingTest} variant="outline" className="bg-transparent">
              Parsing Tests
            </Button>
            <Button onClick={runGenerationTest} variant="outline" className="bg-transparent">
              Generation Tests
            </Button>
            <Button onClick={() => setIsScannerOpen(true)} variant="outline" className="bg-transparent">
              <Camera className="mr-2 h-4 w-4" />
              Live Scan Test
            </Button>
            <Button onClick={clearResults} variant="outline" className="bg-transparent">
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear Results
            </Button>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This test suite validates barcode generation, parsing, and scanning functionality. Use the sample barcodes
              below for testing.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="products">Test Products</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Items</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="custom">Custom Test</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Sample Products for Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {testProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{product.nameAmharic}</h4>
                      <p className="text-sm text-muted-foreground">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{product.category}</Badge>
                        <span className="text-sm font-medium">{product.price} ብር</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">{product.barcode}</code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyBarcode(product.barcode)}
                        className="bg-transparent"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Sample Inventory Items for Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {testInventoryItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.nameAmharic}</h4>
                      <p className="text-sm text-muted-foreground">{item.name}</p>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">{item.barcode}</code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyBarcode(item.barcode)}
                        className="bg-transparent"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Sample Orders for Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {testOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{order.nameAmharic}</h4>
                      <p className="text-sm text-muted-foreground">{order.name}</p>
                      <Badge variant="outline">Order</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">{order.barcode}</code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyBarcode(order.barcode)}
                        className="bg-transparent"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Barcode Testing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="custom-barcode">Enter Custom Barcode</Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-barcode"
                    value={customBarcode}
                    onChange={(e) => setCustomBarcode(e.target.value)}
                    placeholder="Enter barcode to test..."
                    className="font-mono"
                  />
                  <Button onClick={testCustomBarcode}>Test</Button>
                </div>
              </div>

              <div>
                <Label>Generate Test Barcodes</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const barcode = BarcodeGenerator.generateProductBarcode(Date.now().toString(), "main-dishes")
                      setCustomBarcode(barcode)
                    }}
                    className="bg-transparent"
                  >
                    Product Barcode
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const barcode = BarcodeGenerator.generateInventoryBarcode(Date.now().toString(), "supplier1")
                      setCustomBarcode(barcode)
                    }}
                    className="bg-transparent"
                  >
                    Inventory Barcode
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const barcode = BarcodeGenerator.generateOrderBarcode(Date.now().toString())
                      setCustomBarcode(barcode)
                    }}
                    className="bg-transparent"
                  >
                    Order Barcode
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCustomBarcode(Math.random().toString().slice(2, 14))}
                    className="bg-transparent"
                  >
                    Random Number
                  </Button>
                </div>
              </div>

              {currentTest && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Last scanned: <code className="font-mono">{currentTest}</code>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {testResults.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No test results yet. Run some tests!</p>
                  ) : (
                    testResults.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          result.passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{result.testName}</span>
                          {result.passed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <div>
                            Barcode: <code className="font-mono">{result.barcode}</code>
                          </div>
                          <div>Expected: {result.expected}</div>
                          <div>Actual: {result.actual}</div>
                          <div>Time: {result.timestamp.toLocaleTimeString()}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {testLog.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No log entries yet.</p>
                  ) : (
                    testLog.map((entry, index) => (
                      <div key={index} className="text-xs font-mono p-2 bg-gray-50 rounded">
                        {entry}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScanTest}
        title="Live Barcode Scan Test"
      />
    </div>
  )
}
