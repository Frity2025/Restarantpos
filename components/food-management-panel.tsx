"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, AlertTriangle } from "lucide-react"
import { foodManager } from "@/lib/food-management"
import { AddFoodForm } from "./add-food-form"

export function FoodManagementPanel() {
  const [foods, setFoods] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ሁሉም")
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const allFoods = foodManager.getAllFoods()
      setFoods(allFoods || [])
      setLoading(false)
    } catch (err) {
      setError("Failed to load foods")
      setLoading(false)
    }
  }, [])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    try {
      if (term.trim() === "") {
        setFoods(foodManager.getFoodsByCategory(selectedCategory) || [])
      } else {
        setFoods(foodManager.searchFoods(term) || [])
      }
    } catch (err) {
      setError("Search failed")
    }
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    try {
      setFoods(foodManager.getFoodsByCategory(category) || [])
      setSearchTerm("")
    } catch (err) {
      setError("Category filter failed")
    }
  }

  const handleDeleteFood = (id: string) => {
    try {
      foodManager.deleteFood(id)
      setFoods(foodManager.getFoodsByCategory(selectedCategory) || [])
    } catch (err) {
      setError("Failed to delete food")
    }
  }

  const handleFoodAdded = () => {
    try {
      setFoods(foodManager.getAllFoods() || [])
      setShowAddForm(false)
    } catch (err) {
      setError("Failed to refresh foods")
    }
  }

  const categories = ["ሁሉም", "ዋና ምግቦች", "ቁርስ", "ሾርባዎች", "መጠጦች", "ፈጣን ምግቦች"]

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading foods...</p>
        </div>
      </div>
    )
  }

  if (showAddForm) {
    return (
      <div className="p-6">
        <AddFoodForm onClose={() => setShowAddForm(false)} onFoodAdded={handleFoodAdded} />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <span className="text-red-800">{error}</span>
          <Button variant="outline" size="sm" onClick={() => setError(null)} className="ml-auto">
            Dismiss
          </Button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">የምግብ አስተዳደር</h2>
        <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          አዲስ ምግብ ጨምር
        </Button>
      </div>

      {/* ፍለጋ እና ማጣሪያ */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="ምግብ ፈልግ..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => handleCategoryFilter(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* የምግብ ዝርዝር */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {foods && foods.length > 0 ? (
          foods.map((food) => (
            <Card key={food.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={food.image || "/placeholder.svg?height=200&width=300"}
                  alt={food.title || "Food item"}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDeleteFood(food.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{food.title || "Untitled"}</h3>
                  <span className="text-green-600 font-bold">{(food.price || 0).toFixed(2)} ብር</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{food.description || "No description available"}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="outline">{food.category || "Uncategorized"}</Badge>
                  <Badge variant={food.type === "VEG" ? "default" : "destructive"}>
                    {food.type === "VEG" ? "አትክልታዊ" : food.type === "NON_VEG" ? "ስጋ" : food.type || "Unknown"}
                  </Badge>
                  {food.spicyLevel > 0 && (
                    <Badge variant="secondary">ቅመም: {"🌶️".repeat(Math.min(food.spicyLevel, 5))}</Badge>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  <p>የዝግጅት ጊዜ: {food.preparationTime || 0} ደቂቃ</p>
                  <p>
                    ንጥረ ነገሮች:{" "}
                    {food.ingredients && Array.isArray(food.ingredients)
                      ? food.ingredients.slice(0, 3).join(", ") + (food.ingredients.length > 3 ? "..." : "")
                      : "No ingredients listed"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">ምንም ምግብ አልተገኘም</p>
            <Button onClick={() => setShowAddForm(true)} className="mt-4" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              የመጀመሪያ ምግብዎን ይጨምሩ
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
