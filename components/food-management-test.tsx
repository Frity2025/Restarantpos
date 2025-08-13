"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { foodService } from "@/lib/food-management"
import type { Food } from "@/types/order"
import { Plus, Edit, Trash2, Search, CheckCircle, XCircle } from "lucide-react"

export function FoodManagementTest() {
  const { t, formatCurrency } = useLanguage()
  const { toast } = useToast()
  const [foods, setFoods] = useState(foodService.getAllFoods())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [testResults, setTestResults] = useState<
    Array<{
      action: string
      result: string
      success: boolean
      timestamp: Date
    }>
  >([])

  const addTestResult = (action: string, result: string, success = true) => {
    setTestResults((prev) => [
      {
        action,
        result,
        timestamp: new Date(),
        success,
      },
      ...prev.slice(0, 9),
    ])
  }

  const testAddFood = () => {
    const newFood: Omit<Food, "id"> = {
      name: "Test Dish",
      nameAmharic: "የሙከራ ምግብ",
      description: "A test dish for testing purposes",
      descriptionAmharic: "ለሙከራ ዓላማ የተዘጋጀ ምግብ",
      price: 150,
      category: "mains",
      image: "/placeholder.jpg",
      isAvailable: true,
      preparationTime: 15,
      spiceLevel: "medium",
      isVegetarian: false,
      barcode: `TEST${Date.now()}`,
      ingredients: ["test ingredient 1", "test ingredient 2"],
      allergens: ["none"],
      nutritionalInfo: {
        calories: 350,
        protein: 25,
        carbs: 30,
        fat: 15,
      },
    }

    try {
      const addedFood = foodService.addFood(newFood)
      setFoods(foodService.getAllFoods())
      addTestResult("Add Food", `Successfully added "${addedFood.name}"`, true)
      toast({
        title: "Success",
        description: "Test food item added successfully",
      })
    } catch (error) {
      addTestResult("Add Food", `Failed: ${error}`, false)
      toast({
        title: "Error",
        description: "Failed to add test food item",
        variant: "destructive",
      })
    }
  }

  const testEditFood = () => {
    const firstFood = foods[0]
    if (!firstFood) {
      addTestResult("Edit Food", "No food items to edit", false)
      return
    }

    try {
      const updatedFood = foodService.updateFood(firstFood.id, {
        ...firstFood,
        name: `${firstFood.name} (Edited)`,
        price: firstFood.price + 10,
      })
      setFoods(foodService.getAllFoods())
      addTestResult("Edit Food", `Successfully edited "${updatedFood.name}"`, true)
      toast({
        title: "Success",
        description: "Food item edited successfully",
      })
    } catch (error) {
      addTestResult("Edit Food", `Failed: ${error}`, false)
      toast({
        title: "Error",
        description: "Failed to edit food item",
        variant: "destructive",
      })
    }
  }

  const testDeleteFood = () => {
    const testFood = foods.find((f) => f.name.includes("Test"))
    if (!testFood) {
      addTestResult("Delete Food", "No test food items to delete", false)
      return
    }

    try {
      foodService.deleteFood(testFood.id)
      setFoods(foodService.getAllFoods())
      addTestResult("Delete Food", `Successfully deleted "${testFood.name}"`, true)
      toast({
        title: "Success",
        description: "Test food item deleted successfully",
      })
    } catch (error) {
      addTestResult("Delete Food", `Failed: ${error}`, false)
      toast({
        title: "Error",
        description: "Failed to delete food item",
        variant: "destructive",
      })
    }
  }

  const testSearchFood = () => {
    const searchResults = foodService.searchFoods("injera")
    addTestResult("Search Food", `Found ${searchResults.length} results for "injera"`, searchResults.length > 0)
  }

  const testBarcodeSearch = () => {
    const testBarcode = "1234567890123"
    const result = foodService.getFoodByBarcode(testBarcode)
    addTestResult("Barcode Search", result ? `Found: ${result.name}` : "No food found with test barcode", !!result)
  }

  const filteredFoods = foods.filter((food) => {
    const matchesSearch =
      searchTerm === "" ||
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.nameAmharic.includes(searchTerm)
    const matchesCategory = selectedCategory === "all" || food.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", "appetizers", "mains", "desserts", "beverages", "specials"]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Food Management Testing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Actions */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <Button onClick={testAddFood} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Test Add
            </Button>
            <Button onClick={testEditFood} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Test Edit
            </Button>
            <Button onClick={testDeleteFood} variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />
              Test Delete
            </Button>
            <Button onClick={testSearchFood} variant="outline" size="sm">
              <Search className="h-4 w-4 mr-1" />
              Test Search
            </Button>
            <Button onClick={testBarcodeSearch} variant="outline" size="sm">
              Test Barcode
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Foods</Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or Amharic name..."
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : t(cat as any)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center gap-4">
            <Badge variant="outline">Total Foods: {foods.length}</Badge>
            <Badge variant="outline">Filtered: {filteredFoods.length}</Badge>
            <Badge variant="outline">Available: {foods.filter((f) => f.isAvailable).length}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No tests run yet</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <div className="font-medium">{result.action}</div>
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

      {/* Food List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Food Items ({filteredFoods.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredFoods.map((food) => (
              <div key={food.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{food.name}</h4>
                    <p className="text-sm text-muted-foreground">{food.nameAmharic}</p>
                  </div>
                  <Badge variant={food.isAvailable ? "default" : "secondary"}>
                    {food.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">{formatCurrency(food.price)}</span>
                  <Badge variant="outline">{t(food.category as any)}</Badge>
                </div>
                {food.barcode && <div className="text-xs text-muted-foreground">Barcode: {food.barcode}</div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
