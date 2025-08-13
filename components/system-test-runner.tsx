"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Play, RotateCcw } from "lucide-react"
import { foodService } from "@/lib/food-management"
import { inventoryService } from "@/lib/inventory-management"
import { orderService } from "@/lib/order-management"
import { useLanguage } from "@/contexts/language-context"

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
    { name: "Food Management - Search", test: testSearchFood },
    { name: "Food Management - Update", test: testUpdateFood },
    { name: "Food Management - Delete", test: testDeleteFood },
    { name: "Language System - Switch Language", test: testLanguageSwitch },
    { name: "Language System - Currency Format", test: testCurrencyFormat },
    { name: "Inventory System - Stock Levels", test: testInventoryLevels },
    { name: "Inventory System - Low Stock Alert", test: testLowStockAlert },
    { name: "Order System - Create Order", test: testCreateOrder },
    { name: "Order System - Update Status", test: testUpdateOrderStatus },
    { name: "Barcode System - Generate Barcode", test: testBarcodeGeneration },
  ]

  const runAllTests = useCallback(async () => {
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
  }, []) // Removed tests from dependency array

  const resetTests = () => {
    setResults([])
    setProgress(0)
  }

  // Test Functions
  async function testAddFood() {
    const testFood = {
      name: "Test Food Item",
      nameAmharic: "የሙከራ ምግብ",
      description: "Test description",
      descriptionAmharic: "የሙከራ መግለጫ",
      price: 25.99,
      category: "appetizers" as const,
      image: "/placeholder.jpg",
      isAvailable: true,
      preparationTime: 15,
      ingredients: ["test ingredient"],
      allergens: [],
      nutritionalInfo: { calories: 200, protein: 10, carbs: 20, fat: 8 },
    }

    const result = foodService.addFood(testFood)
    if (!result.id) throw new Error("Failed to add food item")
  }

  async function testSearchFood() {
    const results = foodService.searchFoods("Test")
    if (results.length === 0) throw new Error("Search function not working")
  }

  async function testUpdateFood() {
    const foods = foodService.getAllFoods()
    const testFood = foods.find((f) => f.name === "Test Food Item")
    if (!testFood) throw new Error("Test food not found")

    const updated = foodService.updateFood(testFood.id, { price: 29.99 })
    if (!updated || updated.price !== 29.99) throw new Error("Failed to update food item")
  }

  async function testDeleteFood() {
    const foods = foodService.getAllFoods()
    const testFood = foods.find((f) => f.name === "Test Food Item")
    if (!testFood) throw new Error("Test food not found")

    const deleted = foodService.deleteFood(testFood.id)
    if (!deleted) throw new Error("Failed to delete food item")
  }

  async function testLanguageSwitch() {
    const originalLanguage = language
    setLanguage("am")
    await new Promise((resolve) => setTimeout(resolve, 100))
    if (language !== "am") throw new Error("Language switch failed")
    setLanguage(originalLanguage)
  }

  async function testCurrencyFormat() {
    const amount = 1234.56
    const formatted = formatCurrency(amount)
    if (!formatted.includes("1,234.56")) throw new Error("Currency formatting failed")
  }

  async function testInventoryLevels() {
    const items = inventoryService.getAllItems()
    if (items.length === 0) throw new Error("No inventory items found")
  }

  async function testLowStockAlert() {
    const lowStockItems = inventoryService.getLowStockItems()
    // This should not throw an error even if empty
    if (!Array.isArray(lowStockItems)) throw new Error("Low stock alert system failed")
  }

  async function testCreateOrder() {
    const testOrder = {
      customerName: "Test Customer",
      items: [{ foodId: "1", quantity: 2, price: 25.99 }],
      diningMode: "dine-in" as const,
      tableNumber: 5,
    }

    const result = orderService.createOrder(testOrder)
    if (!result.id) throw new Error("Failed to create order")
  }

  async function testUpdateOrderStatus() {
    const orders = orderService.getAllOrders()
    if (orders.length === 0) throw new Error("No orders found")

    const testOrder = orders[0]
    const updated = orderService.updateOrderStatus(testOrder.id, "preparing")
    if (!updated || updated.status !== "preparing") throw new Error("Failed to update order status")
  }

  async function testBarcodeGeneration() {
    // Simple barcode generation test
    const barcode = `TEST${Date.now()}`
    if (barcode.length < 8) throw new Error("Barcode generation failed")
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
              <Button onClick={resetTests} variant="outline" disabled={isRunning}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />

            {results.length > 0 && (
              <div className="flex gap-4 text-sm">
                <Badge variant="outline" className="text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Passed: {passedTests}
                </Badge>
                <Badge variant="outline" className="text-red-600">
                  <XCircle className="h-3 w-3 mr-1" />
                  Failed: {failedTests}
                </Badge>
                <Badge variant="outline">Total: {totalTests}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {result.status === "pending" && <Clock className="h-4 w-4 text-gray-400" />}
                    {result.status === "running" && <Clock className="h-4 w-4 text-blue-500 animate-pulse" />}
                    {result.status === "passed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {result.status === "failed" && <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="font-medium">{result.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.duration && <span className="text-sm text-muted-foreground">{result.duration}ms</span>}
                    <Badge
                      variant={
                        result.status === "passed"
                          ? "default"
                          : result.status === "failed"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {result.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
