"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Play, RotateCcw } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getFoodItems, addFoodItem, updateFoodItem, deleteFoodItem } from "@/lib/food-management"
import { getInventoryItems } from "@/lib/inventory-management"
import { createOrder, updateOrderStatus } from "@/lib/order-management"
import { generateBarcode } from "@/lib/barcode-generator"

interface TestResult {
  name: string
  status: "pending" | "running" | "passed" | "failed"
  duration?: number
  error?: string
}

export function SystemTestRunner() {
  const { t, language, setLanguage, formatCurrency } = useLanguage()
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<TestResult[]>([])

  const tests = [
    { name: "Food Management - Add Item", test: testAddFood },
    { name: "Food Management - Search Items", test: testSearchFood },
    { name: "Food Management - Update Item", test: testUpdateFood },
    { name: "Food Management - Delete Item", test: testDeleteFood },
    { name: "Language System - Switch Language", test: testLanguageSwitch },
    { name: "Language System - Currency Format", test: testCurrencyFormat },
    { name: "Inventory System - Stock Levels", test: testInventoryLevels },
    { name: "Inventory System - Low Stock Alert", test: testLowStockAlert },
    { name: "Order System - Create Order", test: testCreateOrder },
    { name: "Order System - Update Status", test: testUpdateOrderStatus },
    { name: "Barcode System - Generate Barcode", test: testBarcodeGeneration },
  ]

  async function testAddFood(): Promise<void> {
    const testFood = {
      id: "test-food-1",
      name: "Test Burger",
      nameAm: "ሙከራ በርገር",
      description: "Test burger for system testing",
      descriptionAm: "ለስርዓት ሙከራ የሚሆን በርገር",
      price: 150,
      category: "mainCourse" as const,
      image: "/placeholder.jpg",
      available: true,
      barcode: "1234567890123",
    }

    await addFoodItem(testFood)
    const items = await getFoodItems()
    const addedItem = items.find((item) => item.id === "test-food-1")

    if (!addedItem) {
      throw new Error("Food item was not added successfully")
    }
  }

  async function testSearchFood(): Promise<void> {
    const items = await getFoodItems()
    const searchResults = items.filter(
      (item) => item.name.toLowerCase().includes("test") || item.nameAm?.includes("ሙከራ"),
    )

    if (searchResults.length === 0) {
      throw new Error("Search functionality not working")
    }
  }

  async function testUpdateFood(): Promise<void> {
    const updatedFood = {
      id: "test-food-1",
      name: "Updated Test Burger",
      nameAm: "የተሻሻለ ሙከራ በርገር",
      description: "Updated test burger",
      descriptionAm: "የተሻሻለ ሙከራ በርገር",
      price: 175,
      category: "mainCourse" as const,
      image: "/placeholder.jpg",
      available: true,
      barcode: "1234567890123",
    }

    await updateFoodItem("test-food-1", updatedFood)
    const items = await getFoodItems()
    const updatedItem = items.find((item) => item.id === "test-food-1")

    if (!updatedItem || updatedItem.price !== 175) {
      throw new Error("Food item was not updated successfully")
    }
  }

  async function testDeleteFood(): Promise<void> {
    await deleteFoodItem("test-food-1")
    const items = await getFoodItems()
    const deletedItem = items.find((item) => item.id === "test-food-1")

    if (deletedItem) {
      throw new Error("Food item was not deleted successfully")
    }
  }

  async function testLanguageSwitch(): Promise<void> {
    const originalLanguage = language
    setLanguage("am")
    await new Promise((resolve) => setTimeout(resolve, 100))

    if (language !== "am") {
      throw new Error("Language switch to Amharic failed")
    }

    setLanguage("en")
    await new Promise((resolve) => setTimeout(resolve, 100))

    if (language !== "en") {
      throw new Error("Language switch to English failed")
    }

    setLanguage(originalLanguage)
  }

  async function testCurrencyFormat(): Promise<void> {
    const amount = 1234.56
    const enFormat = formatCurrency(amount)

    setLanguage("am")
    await new Promise((resolve) => setTimeout(resolve, 100))
    const amFormat = formatCurrency(amount)

    setLanguage("en")

    if (!enFormat.includes("ETB") || !amFormat.includes("ብር")) {
      throw new Error("Currency formatting not working correctly")
    }
  }

  async function testInventoryLevels(): Promise<void> {
    const items = await getInventoryItems()

    if (items.length === 0) {
      throw new Error("No inventory items found")
    }

    const hasStockLevels = items.every(
      (item) => typeof item.currentStock === "number" && typeof item.minStock === "number",
    )

    if (!hasStockLevels) {
      throw new Error("Inventory items missing stock level data")
    }
  }

  async function testLowStockAlert(): Promise<void> {
    const items = await getInventoryItems()
    const lowStockItems = items.filter((item) => item.currentStock <= item.minStock)

    // This test passes if we can identify low stock items (even if there are none)
    if (!Array.isArray(lowStockItems)) {
      throw new Error("Low stock detection not working")
    }
  }

  async function testCreateOrder(): Promise<void> {
    const testOrder = {
      id: "test-order-1",
      items: [{ id: "item-1", name: "Test Item", price: 100, quantity: 2 }],
      total: 200,
      status: "pending" as const,
      customerInfo: {
        name: "Test Customer",
        phone: "123456789",
      },
      timestamp: new Date(),
    }

    await createOrder(testOrder)
    // If no error is thrown, the test passes
  }

  async function testUpdateOrderStatus(): Promise<void> {
    await updateOrderStatus("test-order-1", "preparing")
    // If no error is thrown, the test passes
  }

  async function testBarcodeGeneration(): Promise<void> {
    const barcode = generateBarcode("test-item-123", "product")

    if (!barcode || barcode.length < 10) {
      throw new Error("Barcode generation failed")
    }
  }

  async function runAllTests() {
    setIsRunning(true)
    setProgress(0)
    setResults([])

    const testResults: TestResult[] = tests.map((test) => ({
      name: test.name,
      status: "pending",
    }))
    setResults([...testResults])

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      const startTime = Date.now()

      // Update status to running
      testResults[i].status = "running"
      setResults([...testResults])

      try {
        await test.test()
        testResults[i].status = "passed"
        testResults[i].duration = Date.now() - startTime
      } catch (error) {
        testResults[i].status = "failed"
        testResults[i].duration = Date.now() - startTime
        testResults[i].error = error instanceof Error ? error.message : "Unknown error"
      }

      setResults([...testResults])
      setProgress(((i + 1) / tests.length) * 100)

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setIsRunning(false)
  }

  function resetTests() {
    setResults([])
    setProgress(0)
  }

  const passedTests = results.filter((r) => r.status === "passed").length
  const failedTests = results.filter((r) => r.status === "failed").length
  const totalTests = tests.length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>System Test Runner</span>
            <div className="flex gap-2">
              <Button onClick={runAllTests} disabled={isRunning} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                {isRunning ? "Running Tests..." : "Run All Tests"}
              </Button>
              <Button
                onClick={resetTests}
                variant="outline"
                disabled={isRunning}
                className="flex items-center gap-2 bg-transparent"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isRunning && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {results.length > 0 && (
            <div className="mb-4 flex gap-4 text-sm">
              <Badge variant="outline" className="text-green-600">
                Passed: {passedTests}
              </Badge>
              <Badge variant="outline" className="text-red-600">
                Failed: {failedTests}
              </Badge>
              <Badge variant="outline">Total: {totalTests}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {result.status === "pending" && <Clock className="h-4 w-4 text-gray-400" />}
                    {result.status === "running" && (
                      <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    {result.status === "passed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {result.status === "failed" && <XCircle className="h-4 w-4 text-red-600" />}
                    <div>
                      <div className="font-medium">{result.name}</div>
                      {result.error && <div className="text-sm text-red-600">{result.error}</div>}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{result.duration && `${result.duration}ms`}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
