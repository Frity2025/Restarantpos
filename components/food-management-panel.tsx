"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Plus, Search, Edit, Trash2, Filter, ChefHat, Clock, DollarSign, Star, AlertTriangle } from "lucide-react"
import { getAllFoodItems, addFoodItem, updateFoodItem, deleteFoodItem, type FoodItem } from "@/lib/food-management"
import { foodCategories } from "@/config/restaurant-config"

export function FoodManagementPanel() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    loadFoodItems()
  }, [])

  const loadFoodItems = async () => {
    try {
      setLoading(true)
      const items = await getAllFoodItems()
      setFoodItems(items || [])
    } catch (error) {
      console.error("Error loading food items:", error)
      toast({
        title: "ስህተት",
        description: "የምግብ ዝርዝር መጫን አልተቻለም",
        variant: "destructive",
      })
      setFoodItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (newItem: Omit<FoodItem, "id">) => {
    try {
      const addedItem = await addFoodItem(newItem)
      setFoodItems((prev) => [...prev, addedItem])
      toast({
        title: "ተሳክቷል",
        description: "አዲስ ምግብ ተጨምሯል",
      })
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "ስህተት",
        description: "ምግብ መጨመር አልተቻለም",
        variant: "destructive",
      })
    }
  }

  const handleUpdateItem = async (updatedItem: FoodItem) => {
    try {
      await updateFoodItem(updatedItem)
      setFoodItems((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
      toast({
        title: "ተሳክቷል",
        description: "ምግብ ተዘምኗል",
      })
      setEditingItem(null)
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "ስህተት",
        description: "ምግብ ማዘመን አልተቻለም",
        variant: "destructive",
      })
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm("ይህንን ምግብ መሰረዝ ይፈልጋሉ?")) return

    try {
      await deleteFoodItem(id)
      setFoodItems((prev) => prev.filter((item) => item.id !== id))
      toast({
        title: "ተሳክቷል",
        description: "ምግብ ተሰርዟል",
      })
    } catch (error) {
      toast({
        title: "ስህተት",
        description: "ምግብ መሰረዝ አልተቻለም",
        variant: "destructive",
      })
    }
  }

  const filteredItems = foodItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (available: boolean) => {
    return available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getStatusText = (available: boolean) => {
    return available ? "ዝግጁ" : "አልተገኘም"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">የምግብ አስተዳደር</h1>
          <p className="text-gray-600">የምግብ ቤት ምግቦችን ያስተዳድሩ</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="h-4 w-4 mr-2" />
              አዲስ ምግብ ጨምር
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? "ምግብ አርትዕ" : "አዲስ ምግብ ጨምር"}</DialogTitle>
            </DialogHeader>
            <FoodForm
              item={editingItem}
              onSubmit={editingItem ? handleUpdateItem : handleAddItem}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingItem(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="ምግብ ፈልግ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="ምድብ ምረጥ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ሁሉም ምድቦች</SelectItem>
            {foodCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{foodItems.length}</p>
                <p className="text-sm text-gray-600">ጠቅላላ ምግቦች</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{foodItems.filter((item) => item.available).length}</p>
                <p className="text-sm text-gray-600">ዝግጁ ምግቦች</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{foodItems.filter((item) => !item.available).length}</p>
                <p className="text-sm text-gray-600">ያልተገኙ ምግቦች</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(foodItems.reduce((sum, item) => sum + item.price, 0) / foodItems.length || 0)} ብር
                </p>
                <p className="text-sm text-gray-600">አማካይ ዋጋ</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Food Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              {item.image ? (
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ChefHat className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <Badge className={`absolute top-2 right-2 ${getStatusColor(item.available)}`}>
                {getStatusText(item.available)}
              </Badge>
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {foodCategories.find((cat) => cat.id === item.category)?.name || item.category}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">{item.price} ብር</p>
                  {item.preparationTime && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {item.preparationTime} ደቂቃ
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {item.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>}
              {item.ingredients && item.ingredients.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">ንጥረ ነገሮች:</p>
                  <div className="flex flex-wrap gap-1">
                    {item.ingredients.slice(0, 3).map((ingredient, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {ingredient}
                      </Badge>
                    ))}
                    {item.ingredients.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.ingredients.length - 3} ተጨማሪ
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingItem(item)
                    setIsDialogOpen(true)
                  }}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  አርትዕ
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteItem(item.id)}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  ሰርዝ
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">ምንም ምግብ አልተገኘም</h3>
          <p className="text-gray-600">የፍለጋ ቃልዎን ይቀይሩ ወይም አዲስ ምግብ ይጨምሩ</p>
        </div>
      )}
    </div>
  )
}

function FoodForm({
  item,
  onSubmit,
  onCancel,
}: {
  item: FoodItem | null
  onSubmit: (item: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price || 0,
    category: item?.category || "",
    ingredients: item?.ingredients?.join(", ") || "",
    preparationTime: item?.preparationTime || 0,
    available: item?.available ?? true,
    image: item?.image || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const submitData = {
      ...formData,
      ingredients: formData.ingredients
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
      id: item?.id,
    }

    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">የምግብ ስም *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">ዋጋ (ብር) *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">ምድብ *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="ምድብ ምረጥ" />
            </SelectTrigger>
            <SelectContent>
              {foodCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="preparationTime">የዝግጅት ጊዜ (ደቂቃ)</Label>
          <Input
            id="preparationTime"
            type="number"
            min="0"
            value={formData.preparationTime}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, preparationTime: Number.parseInt(e.target.value) || 0 }))
            }
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">መግለጫ</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="ingredients">ንጥረ ነገሮች (በኮማ ይለዩ)</Label>
        <Textarea
          id="ingredients"
          value={formData.ingredients}
          onChange={(e) => setFormData((prev) => ({ ...prev, ingredients: e.target.value }))}
          placeholder="ሽንኩርት, ቅመም, ዘይት..."
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="image">የምስል URL</Label>
        <Input
          id="image"
          type="url"
          value={formData.image}
          onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="available"
          checked={formData.available}
          onChange={(e) => setFormData((prev) => ({ ...prev, available: e.target.checked }))}
          className="rounded"
        />
        <Label htmlFor="available">ዝግጁ ነው</Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {item ? "አዘምን" : "ጨምር"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          ሰርዝ
        </Button>
      </div>
    </form>
  )
}
