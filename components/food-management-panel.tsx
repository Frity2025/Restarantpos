"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { foodManager } from "@/lib/food-management"

export function FoodManagementPanel() {
  const [foods, setFoods] = useState(foodManager.getAllFoods())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ሁሉም")
  const [showAddForm, setShowAddForm] = useState(false)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term.trim() === "") {
      setFoods(foodManager.getFoodsByCategory(selectedCategory))
    } else {
      setFoods(foodManager.searchFoods(term))
    }
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    setFoods(foodManager.getFoodsByCategory(category))
    setSearchTerm("")
  }

  const categories = ["ሁሉም", "ዋና ምግቦች", "ቁርስ", "ሾርባዎች", "መጠጦች", "ፈጣን ምግቦች"]

  return (
    <div className="p-6 space-y-6">
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
        <div className="flex gap-2">
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
        {foods.map((food) => (
          <Card key={food.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={food.image || "/placeholder.svg?height=200&width=300"}
                alt={food.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" className="h-8 w-8 p-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{food.title}</h3>
                <span className="text-green-600 font-bold">{food.price.toFixed(2)} ብር</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{food.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="outline">{food.category}</Badge>
                <Badge variant={food.type === "VEG" ? "default" : "destructive"}>
                  {food.type === "VEG" ? "አትክልታዊ" : food.type === "NON_VEG" ? "ስጋ" : food.type}
                </Badge>
                {food.spicyLevel > 0 && <Badge variant="secondary">ቅመም: {"🌶️".repeat(food.spicyLevel)}</Badge>}
              </div>
              <div className="text-xs text-gray-500">
                <p>የዝግጅት ጊዜ: {food.preparationTime} ደቂቃ</p>
                <p>ንጥረ ነገሮች: {food.ingredients.slice(0, 3).join(", ")}...</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {foods.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">ምንም ምግብ አልተገኘም</p>
        </div>
      )}
    </div>
  )
}
