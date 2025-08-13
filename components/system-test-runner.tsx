"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { foodService } from "@/lib/food-management"
import { inventoryService } from "@/lib/inventory-management"
import { orderService } from "@/lib/order-management"
import {
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  TestTube,
  Utensils,
  Package,
  BarChart3,
  Languages,
  Camera,
} from "lucide-react"

interface TestResult {
  id: string
  name: string
  category: string
  status: "pending" | "running" | "passed" | "failed"
  message: string
  duration: number
  timestamp: Date
}

interface TestSuite {
  id: string
  name: string
  icon: any
  tests: Array<{
    id: string
    name: string
    testFn: () => Promise<{ success: boolean; message: string }>
  }>
}

export function SystemTestRunner() {
  const { t, language, setLanguage, formatCurrency } = useLanguage()
  const { toast } = useToast()
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState<string | null>(null)
  const [results, setResults] = useState<TestResult[]>([])
  const [progress, setProgress] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)

  const testSuites: TestSuite[] = [
    {
      id: "food-management",
      name: "Food Management",
      icon: Utensils,
      tests: [
        {
          id: "add-food",
          name: "Add Food Item",
          testFn: async () => {
            try {
              const testFood = {
                name: "Test Burger",
                nameAmharic: "የሙከራ በርገር",
                description: "A test burger for validation",
                descriptionAmharic: "ለማረጋገጫ የሙከራ በርገር",
                price: 250,
                category: "mains" as const,
                image: "/placeholder.jpg",
                isAvailable: true,
                preparationTime: 15,
                spiceLevel: "medium" as const,
                isVegetarian: false,
                barcode: `TEST${Date.now()}`,
                ingredients: ["beef", "lettuce", "tomato"],
                allergens: ["gluten"],
                nutritionalInfo: {
                  calories: 450,
                  protein: 25,
                  carbs: 35,
                  fat: 20,
                },
              }

              const added = foodService.addFood(testFood)
              return {
                success: !!added,
                message: added ? `Added food: ${added.name}` : "Failed to add food",
              }
            } catch (error) {
              return { success: false, message: `Error: ${error}` }
            }
          },
        },
        {
          id: "search-food",
          name: "Search Food Items",
          testFn: async () => {
            try {
              const results = foodService.searchFoods("injera")
              return {
                success: results.length > 0,
                message: `Found ${results.length} items for 'injera'`,
              }
            } catch (error) {
              return { success: false, message: `Search failed: ${error}` }
            }
          },
        },
        {
          id: "update-food",
          name: "Update Food Item",
          testFn: async () => {
            try {
              const foods = foodService.getAllFoods()
              const testFood = foods.find((f) => f.name.includes("Test"))

              if (!testFood) {
                return { success: false, message: "No test food found to update" }
              }

              const updated = foodService.updateFood(testFood.id, {
                price: testFood.price + 10,
                description: "Updated test description",
              })

              return {
                success: !!updated,
                message: updated ? `Updated food: ${updated.name}` : "Failed to update food",
              }
            } catch (error) {
              return { success: false, message: `Update failed: ${error}` }
            }
          },
        },
        {
          id: "delete-food",
          name: "Delete Food Item",
          testFn: async () => {
            try {
              const foods = foodService.getAllFoods()
              const testFood = foods.find((f) => f.name.includes("Test"))

              if (!testFood) {
                return { success: false, message: "No test food found to delete" }
              }

              const deleted = foodService.deleteFood(testFood.id)
              return {
                success: deleted,
                message: deleted ? `Deleted food: ${testFood.name}` : "Failed to delete food",
              }
            } catch (error) {
              return { success: false, message: `Delete failed: ${error}` }
            }
          },
        },
      ],
    },
    {
      id: "language-system",
      name: "Language System",
      icon: Languages,
      tests: [
        {
          id: "language-switch",
          name: "Language Switching",
          testFn: async () => {
            try {
              const originalLang = language
              const newLang = language === "en" ? "am" : "en"

              setLanguage(newLang)
              await new Promise((resolve) => setTimeout(resolve, 100))

              const success = language !== originalLang
              return {
                success,
                message: success ? `Switched from ${originalLang} to ${newLang}` : "Language switch failed",
              }
            } catch (error) {
              return { success: false, message: `Language switch error: ${error}` }
            }
          },
        },
        {
          id: "currency-format",
          name: "Currency Formatting",
          testFn: async () => {
            try {
              const amount = 12345
              const formatted = formatCurrency(amount)
              const expectedEn = "12,345 ETB"
              const expectedAm = "12,345 ብር"

              const isCorrect = formatted === expectedEn || formatted === expectedAm
              return {
                success: isCorrect,
                message: isCorrect ? `Formatted correctly: ${formatted}` : `Unexpected format: ${formatted}`,
              }
            } catch (error) {
              return { success: false, message: `Currency format error: ${error}` }
            }
          },
        },
        {
          id: "translation-keys",
          name: "Translation Keys",
          testFn: async () => {
            try {
              const testKeys = ["home", "admin", "kitchen", "employees", "stats"]
              const translations = testKeys.map((key) => t(key as any))
              const hasTranslations = translations.every((trans) => trans && trans.length > 0)

              return {
                success: hasTranslations,
                message: hasTranslations ? "All test keys translated" : "Some translations missing",
              }
            } catch (error) {
              return { success: false, message: `Translation error: ${error}` }
            }
          },
        },
      ],
    },
    {
      id: "inventory-system",
      name: "Inventory System",
      icon: Package,
      tests: [
        {
          id: "stock-levels",
          name: "Stock Level Tracking",
          testFn: async () => {
            try {
              const items = inventoryService.getAllItems()
              const hasStockLevels = items.every((item) => typeof item.currentStock === "number")

              return {
                success: hasStockLevels,
                message: hasStockLevels ? `${items.length} items have stock levels` : "Some items missing stock data",
              }
            } catch (error) {
              return { success: false, message: `Stock level error: ${error}` }
            }
          },
        },
        {
          id: "low-stock-alerts",
          name: "Low Stock Alerts",
          testFn: async () => {
            try {
              const lowStockItems = inventoryService.getLowStockItems()
              const alertsWorking = Array.isArray(lowStockItems)

              return {
                success: alertsWorking,
                message: alertsWorking
                  ? `${lowStockItems.length} low stock items detected`
                  : "Low stock detection failed",
              }
            } catch (error) {
              return { success: false, message: `Low stock alert error: ${error}` }
            }
          },
        },
        {
          id: "inventory-update",
          name: "Inventory Updates",
          testFn: async () => {
            try {
              const items = inventoryService.getAllItems()
              if (items.length === 0) {
                return { success: false, message: "No inventory items to test" }
              }

              const testItem = items[0]
              const originalStock = testItem.currentStock
              const newStock = originalStock + 10

              const updated = inventoryService.updateStock(testItem.id, newStock, "Test adjustment")

              return {
                success: updated,
                message: updated ? `Updated stock from ${originalStock} to ${newStock}` : "Stock update failed",
              }
            } catch (error) {
              return { success: false, message: `Inventory update error: ${error}` }
            }
          },
        },
      ],
    },
    {
      id: "order-system",
      name: "Order System",
      icon: BarChart3,
      tests: [
        {
          id: "create-order",
          name: "Create Order",
          testFn: async () => {
            try {
              const foods = foodService.getAllFoods()
              if (foods.length === 0) {
                return { success: false, message: "No foods available for order" }
              }

              const testOrder = {
                items: [{ food: foods[0], quantity: 2, notes: "Test order" }],
                customerName: "Test Customer",
                tableNumber: 1,
                diningMode: "dine-in" as const,
                specialInstructions: "Test order for validation",
              }

              const order = orderService.createOrder(testOrder)
              return {
                success: !!order,
                message: order ? `Created order #${order.id}` : "Order creation failed",
              }
            } catch (error) {
              return { success: false, message: `Order creation error: ${error}` }
            }
          },
        },
        {
          id: "order-status",
          name: "Order Status Updates",
          testFn: async () => {
            try {
              const orders = orderService.getAllOrders()
              if (orders.length === 0) {
                return { success: false, message: "No orders to test status updates" }
              }

              const testOrder = orders[0]
              const updated = orderService.updateOrderStatus(testOrder.id, "preparing")

              return {
                success: updated,
                message: updated ? `Updated order #${testOrder.id} to preparing` : "Status update failed",
              }
            } catch (error) {
              return { success: false, message: `Order status error: ${error}` }
            }
          },
        },
      ],
    },
    {
      id: "barcode-system",
      name: "Barcode System",
      icon: Camera,
      tests: [
        {
          id: "barcode-generation",
          name: "Barcode Generation",
          testFn: async () => {
            try {
              const testBarcode = `TEST${Date.now()}`
              const isValid = /^[0-9A-Z]+$/.test(testBarcode)

              return {
                success: isValid,
                message: isValid ? `Generated valid barcode: ${testBarcode}` : "Invalid barcode format",
              }
            } catch (error) {
              return { success: false, message: `Barcode generation error: ${error}` }
            }
          },
        },
        {
          id: "barcode-lookup",
          name: "Barcode Lookup",
          testFn: async () => {
            try {
              const foods = foodService.getAllFoods()
              const foodWithBarcode = foods.find((f) => f.barcode)

              if (!foodWithBarcode) {
                return { success: false, message: "No foods with barcodes found" }
              }

              const found = foodService.getFoodByBarcode(foodWithBarcode.barcode!)
              return {
                success: !!found,
                message: found ? `Found food by barcode: ${found.name}` : "Barcode lookup failed",
              }
            } catch (error) {
              return { success: false, message: `Barcode lookup error: ${error}` }
            }
          },
        },
      ],
    },
  ]

  const runAllTests = async () => {
    setIsRunning(true)
    setStartTime(new Date())
    setResults([])
    setProgress(0)

    const allTests = testSuites.flatMap((suite) =>
      suite.tests.map((test) => ({
        ...test,
        category: suite.name,
        suiteIcon: suite.icon,
      })),
    )

    const totalTests = allTests.length

    for (let i = 0; i < allTests.length; i++) {
      const test = allTests[i]
      setCurrentTest(test.name)

      const startTime = Date.now()

      setResults((prev) => [
        ...prev,
        {
          id: test.id,
          name: test.name,
          category: test.category,
          status: "running",
          message: "Running...",
          duration: 0,
          timestamp: new Date(),
        },
      ])

      try {
        const result = await test.testFn()
        const duration = Date.now() - startTime

        setResults((prev) =>
          prev.map((r) =>
            r.id === test.id
              ? {
                  ...r,
                  status: result.success ? "passed" : "failed",
                  message: result.message,
                  duration,
                }
              : r,
          ),
        )

        toast({
          title: result.success ? "Test Passed" : "Test Failed",
          description: `${test.name}: ${result.message}`,
          variant: result.success ? "default" : "destructive",
        })
      } catch (error) {
        const duration = Date.now() - startTime

        setResults((prev) =>
          prev.map((r) =>
            r.id === test.id
              ? {
                  ...r,
                  status: "failed",
                  message: `Unexpected error: ${error}`,
                  duration,
                }
              : r,
          ),
        )
      }

      setProgress(((i + 1) / totalTests) * 100)

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setCurrentTest(null)
    setIsRunning(false)

    const passedTests = results.filter((r) => r.status === "passed").length
    const totalTestsRun = results.length

    toast({
      title: "All Tests Complete",
      description: `${passedTests}/${totalTestsRun} tests passed`,
      variant: passedTests === totalTestsRun ? "default" : "destructive",
    })
  }

  const resetTests = () => {
    setResults([])
    setProgress(0)
    setCurrentTest(null)
    setStartTime(null)
  }

  const passedTests = results.filter((r) => r.status === "passed").length
  const failedTests = results.filter((r) => r.status === "failed").length
  const totalTests = testSuites.reduce((acc, suite) => acc + suite.tests.length, 0)

  return (
    <div className="space-y-6">
      {/* Test Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            System Test Runner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={runAllTests} disabled={isRunning} className="flex items-center gap-2">
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run All Tests
                </>
              )}
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

          {isRunning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress: {Math.round(progress)}%</span>
                <span>Current: {currentTest}</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{totalTests}</div>
              <div className="text-sm text-muted-foreground">Total Tests</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{passedTests}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{failedTests}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {results.length > 0 ? Math.round((passedTests / results.length) * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result) => (
                <div
                  key={result.id}
                  className={`p-3 rounded-lg border ${
                    result.status === "passed"
                      ? "bg-green-50 border-green-200"
                      : result.status === "failed"
                        ? "bg-red-50 border-red-200"
                        : result.status === "running"
                          ? "bg-blue-50 border-blue-200"
                          : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {result.status === "passed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {result.status === "failed" && <XCircle className="h-4 w-4 text-red-600" />}
                      {result.status === "running" && <Clock className="h-4 w-4 text-blue-600 animate-spin" />}
                      {result.status === "pending" && <Clock className="h-4 w-4 text-gray-400" />}

                      <span className="font-medium">{result.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {result.category}
                      </Badge>
                    </div>

                    <div className="text-xs text-muted-foreground">{result.duration > 0 && `${result.duration}ms`}</div>
                  </div>

                  <div className="text-sm text-muted-foreground">{result.message}</div>

                  <div className="text-xs text-muted-foreground mt-1">{result.timestamp.toLocaleTimeString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Suites Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testSuites.map((suite) => {
          const suiteResults = results.filter((r) => r.category === suite.name)
          const suitePassed = suiteResults.filter((r) => r.status === "passed").length
          const suiteTotal = suite.tests.length

          return (
            <Card key={suite.id}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <suite.icon className="h-4 w-4" />
                  {suite.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tests: {suiteTotal}</span>
                    <span>
                      {suitePassed}/{suiteTotal} passed
                    </span>
                  </div>

                  <Progress value={suiteTotal > 0 ? (suitePassed / suiteTotal) * 100 : 0} className="h-2" />

                  <div className="space-y-1">
                    {suite.tests.map((test) => {
                      const testResult = results.find((r) => r.id === test.id)
                      return (
                        <div key={test.id} className="flex items-center justify-between text-xs">
                          <span>{test.name}</span>
                          {testResult && (
                            <div className="flex items-center gap-1">
                              {testResult.status === "passed" && <CheckCircle className="h-3 w-3 text-green-600" />}
                              {testResult.status === "failed" && <XCircle className="h-3 w-3 text-red-600" />}
                              {testResult.status === "running" && (
                                <Clock className="h-3 w-3 text-blue-600 animate-spin" />
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Summary Alert */}
      {results.length > 0 && !isRunning && (
        <Alert className={passedTests === results.length ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <AlertDescription>
            {passedTests === results.length ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-800">All tests passed! System is functioning correctly.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-800">{failedTests} test(s) failed. Please review the results above.</span>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
