"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, TestTube, Utensils, Plus, Edit, Trash2 } from "lucide-react"
import { foodService, categories } from "@/lib/food-management"
import { toast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import type { Food } from "@/types/order"

export function FoodManagementTest() {
  const { t, formatCurrency } = useLanguage()
  const [testResults, setTestResults] = useState<
    Array<{
      test: string
      passed: boolean
      message: string
      timestamp: Date
    }>
  >([])

  const addTestResult = (test: string, passed: boolean, message: string) => {
    setTestResults((prev) => [
      {
        test,
        passed,
        message,
        timestamp: new Date(),
      },
      ...prev.slice(0, 19),
    ]) // Keep last 20 results
  }

  const testAddFood = async () => {
    try {
      const testFood: Omit<Food, "id"> = {
        name: "Test Dish",
        nameAmharic: "የሙከራ ምግብ",
        description: "A test dish for validation",
        descriptionAmharic: "ለማረጋገጫ የሙከራ ምግብ",
        price: 150,
        category: "main-dishes",
        image: "/placeholder.svg?height=200&width=200&text=Test",
        preparationTime: 20,
        spiceLevel: "medium",
        isVegetarian: false,
        isAvailable: true,
        barcode: `TEST${Date.now()}`,
        ingredients: ["test ingredient 1", "test ingredient 2"],
        allergens: ["test allergen"],
        nutritionalInfo: {
          calories: 300,
          protein: 20,
          carbs: 30,
          fat: 10,
        },
      }

      const success = foodService.addFood(testFood)

      if (success) {
        addTestResult("Add Food", true, "Successfully added test food item")
        toast({
          title: t("success"),
          description: "Test food added successfully",
        })
      } else {
        throw new Error("Failed to add food")
      }
    } catch (error) {
      addTestResult("Add Food", false, `Failed: ${error}`)
      toast({
        title: t("error"),
        description: "Failed to add test food",
        variant: "destructive",
      })
    }
  }

  const testUpdateFood = async () => {
    try {
      const foods = foodService.getAllFoods()
      const testFood = foods.find((f) => f.name.includes("Test"))

      if (!testFood) {
        throw new Error("No test food found to update")
      }

      const success = foodService.updateFood(testFood.id, {
        price: 175,
        description: "Updated test dish description",
      })

      if (success) {
        addTestResult("Update Food", true, "Successfully updated test food item")
        toast({
          title: t("success"),
          description: "Test food updated successfully",
        })
      } else {
        throw new Error("Failed to update food")
      }
    } catch (error) {
      addTestResult("Update Food", false, `Failed: ${error}`)
      toast({
        title: t("error"),
        description: "Failed to update test food",
        variant: "destructive",
      })
    }
  }

  const testDeleteFood = async () => {
    try {
      const foods = foodService.getAllFoods()
      const testFood = foods.find((f) => f.name.includes("Test"))

      if (!testFood) {
        throw new Error("No test food found to delete")
      }

      const success = foodService.deleteFood(testFood.id)

      if (success) {
        addTestResult("Delete Food", true, "Successfully deleted test food item")
        toast({
          title: t("success"),
          description: "Test food deleted successfully",
        })
      } else {
        throw new Error("Failed to delete food")
      }
    } catch (error) {
      addTestResult("Delete Food", false, `Failed: ${error}`)
      toast({
        title: t("error"),
        description: "Failed to delete test food",
        variant: "destructive",
      })
    }
  }

  const testSearchFood = async () => {
    try {
      const searchResults = foodService.searchFoods("ዶሮ")

      if (searchResults.length > 0) {
        addTestResult("Search Food", true, `Found ${searchResults.length} items for 'ዶሮ'`)
        toast({
          title: t("success"),
          description: `Search returned ${searchResults.length} results`,
        })
      } else {
        throw new Error("No search results found")
      }
    } catch (error) {
      addTestResult("Search Food", false, `Failed: ${error}`)
      toast({
        title: t("error"),
        description: "Search test failed",
        variant: "destructive",
      })
    }
  }

  const testCategoryFilter = async () => {
    try {
      const mainDishes = foodService.getFoodsByCategory("main-dishes")
      const beverages = foodService.getFoodsByCategory("beverages")

      if (mainDishes.length > 0 && beverages.length > 0) {
        addTestResult("Category Filter", true, `Main dishes: ${mainDishes.length}, Beverages: ${beverages.length}`)
        toast({
          title: t("success"),
          description: "Category filtering works correctly",
        })
      } else {
        throw new Error("Category filtering returned unexpected results")
      }
    } catch (error) {
      addTestResult("Category Filter", false, `Failed: ${error}`)
      toast({
        title: t("error"),
        description: "Category filter test failed",
        variant: "destructive",
      })
    }
  }

  const runAllTests = async () => {
    setTestResults([])

    await testAddFood()
    await new Promise((resolve) => setTimeout(resolve, 500))

    await testUpdateFood()
    await new Promise((resolve) => setTimeout(resolve, 500))

    await testSearchFood()
    await new Promise((resolve) => setTimeout(resolve, 500))

    await testCategoryFilter()
    await new Promise((resolve) => setTimeout(resolve, 500))

    await testDeleteFood()

    toast({
      title: "Tests Complete",
      description: "All food management tests have been executed",
    })
  }

  const currentFoods = foodService.getAllFoods()
  const availableFoods = foodService.getAvailableFoods()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Food Management Testing Suite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button onClick={runAllTests} className="bg-blue-600 hover:bg-blue-700">
              <TestTube className="mr-2 h-4 w-4" />
              Run All Tests
            </Button>
            <Button onClick={testAddFood} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Test Add Food
            </Button>
            <Button onClick={testUpdateFood} variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Test Update Food
            </Button>
            <Button onClick={testDeleteFood} variant="outline">
              <Trash2 className="mr-2 h-4 w-4" />
              Test Delete Food
            </Button>
            <Button onClick={testSearchFood} variant="outline">
              Test Search
            </Button>
            <Button onClick={testCategoryFilter} variant="outline">
              Test Categories
            </Button>
          </div>

          <Alert>
            <Utensils className="h-4 w-4" />
            <AlertDescription>
              Current Status: {currentFoods.length} total foods, {availableFoods.length} available
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Tabs defaultValue="results" className="space-y-4">
        <TabsList>
          <TabsTrigger value="results">Test Results</TabsTrigger>
          <TabsTrigger value="data">Current Data</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="results">
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
                        <span className="font-medium text-sm">{result.test}</span>
                        {result.passed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <div>{result.message}</div>
                        <div>Time: {result.timestamp.toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Current Food Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {currentFoods.slice(0, 5).map((food) => (
                  <div key={food.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{food.nameAmharic}</h4>
                      <p className="text-sm text-muted-foreground">{food.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{food.category}</Badge>
                        <span className="text-sm">{formatCurrency(food.price)}</span>
                      </div>
                    </div>
                    <Badge variant={food.isAvailable ? "default" : "secondary"}>
                      {food.isAvailable ? t("available") : t("unavailable")}
                    </Badge>
                  </div>
                ))}
                {currentFoods.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    ... and {currentFoods.length - 5} more items
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Food Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => {
                  const categoryFoods = foodService.getFoodsByCategory(category.id)
                  return (
                    <div key={category.id} className="p-3 border rounded-lg">
                      <h4 className="font-medium">{category.nameAmharic}</h4>
                      <p className="text-sm text-muted-foreground">{category.name}</p>
                      <Badge variant="outline" className="mt-2">
                        {categoryFoods.length} items
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
