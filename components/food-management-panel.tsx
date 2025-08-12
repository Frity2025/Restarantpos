"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, Eye, Package, AlertTriangle, TrendingUp } from "lucide-react"
import { AddFoodForm } from "./add-food-form"
import { foodService, categories, type FoodItem } from "@/lib/food-management"
import { toast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"

export function FoodManagementPanel() {
  const { t, formatCurrency } = useLanguage()
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setIsLoading(true)
      setError(null)
      const allFoods = foodService.getAllFoods()
      setFoods(allFoods)
      setFilteredFoods(allFoods)
    } catch (err) {
      setError("Failed to load food items")
      console.error("Error loading food items:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    try {
      let filtered = [...foods]

      if (searchQuery) {
        filtered = foodService.searchFoods(searchQuery)
      }

      if (selectedCategory !== "all") {
        filtered = filtered.filter((food) => food.category === selectedCategory)
      }

      setFilteredFoods(filtered)
    } catch (err) {
      console.error("Error filtering foods:", err)
      setFilteredFoods([])
    }
  }, [foods, searchQuery, selectedCategory])

  const handleAddFood = async (foodData: Omit<FoodItem, "id">) => {
    try {
      const success = foodService.addFood(foodData)
      if (success) {
        const updatedFoods = foodService.getAllFoods()
        setFoods(updatedFoods)
        setIsAddDialogOpen(false)
        toast({
          title: t("success"),
          description: t("itemAdded"),
        })
      } else {
        throw new Error("Failed to add food")
      }
    } catch (error) {
      console.error("Error adding food:", error)
      toast({
        title: t("error"),
        description: t("operationFailed"),
        variant: "destructive",
      })
    }
  }

  const handleEditFood = async (foodData: Omit<FoodItem, "id">) => {
    if (!editingFood) return

    try {
      const success = foodService.updateFood(editingFood.id, foodData)
      if (success) {
        const updatedFoods = foodService.getAllFoods()
        setFoods(updatedFoods)
        setEditingFood(null)
        toast({
          title: t("success"),
          description: t("itemUpdated"),
        })
      } else {
        throw new Error("Failed to update food")
      }
    } catch (error) {
      console.error("Error updating food:", error)
      toast({
        title: t("error"),
        description: t("operationFailed"),
        variant: "destructive",
      })
    }
  }

  const handleDeleteFood = async (foodId: string) => {
    try {
      const success = foodService.deleteFood(foodId)
      if (success) {
        const updatedFoods = foodService.getAllFoods()
        setFoods(updatedFoods)
        toast({
          title: t("success"),
          description: t("itemDeleted"),
        })
      } else {
        throw new Error("Failed to delete food")
      }
    } catch (error) {
      console.error("Error deleting food:", error)
      toast({
        title: t("error"),
        description: t("operationFailed"),
        variant: "destructive",
      })
    }
  }

  const getAvailabilityBadge = (available: boolean) => {
    return available ? (
      <Badge className="bg-green-100 text-green-800">{t("available")}</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">{t("unavailable")}</Badge>
    )
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category?.nameAmharic || categoryId
  }

  const stats = {
    totalItems: foods.length,
    availableItems: foods.filter((food) => food.isAvailable).length,
    unavailableItems: foods.filter((food) => !food.isAvailable).length,
    categories: [...new Set(foods.map((food) => food.category))].length,
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t("foodManagement")}</h2>
          <p className="text-gray-600">ምግቦችን ያስተዳድሩ እና ያዘምኑ</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t("addNewFood")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("addNewFood")}</DialogTitle>
              <DialogDescription>አዲስ ምግብ ወደ ሜኑ ለመጨመር ዝርዝሮቹን ይሙሉ</DialogDescription>
            </DialogHeader>
            <AddFoodForm
              onSuccess={() => {
                setIsAddDialogOpen(false)
                const updatedFoods = foodService.getAllFoods()
                setFoods(updatedFoods)
              }}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalItems")}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("availableItems")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.availableItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("unavailableItems")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.unavailableItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("categories")}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>ፍልተሮች</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="ምግብ ፈልግ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">ሁሉም ምድቦች</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nameAmharic}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Food Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>ምግቦች ({filteredFoods.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ምግብ</TableHead>
                  <TableHead>ምድብ</TableHead>
                  <TableHead>ዋጋ</TableHead>
                  <TableHead>ሁኔታ</TableHead>
                  <TableHead>ንጥረ ነገሮች</TableHead>
                  <TableHead className="text-right">እርምጃዎች</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFoods.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-8 w-8 text-gray-400" />
                        <p className="text-gray-500">ምንም ምግብ አልተገኘም</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFoods.map((food) => (
                    <TableRow key={food.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium">{food.nameAmharic}</p>
                            <p className="text-sm text-gray-500">{food.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryName(food.category)}</TableCell>
                      <TableCell>{formatCurrency(food.price)}</TableCell>
                      <TableCell>{getAvailabilityBadge(food.isAvailable)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(food.ingredients || []).slice(0, 2).map((ingredient, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {ingredient}
                            </Badge>
                          ))}
                          {(food.ingredients || []).length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{(food.ingredients || []).length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Dialog
                            open={editingFood?.id === food.id}
                            onOpenChange={(open) => !open && setEditingFood(null)}
                          >
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setEditingFood(food)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>ምግብ አርትዕ</DialogTitle>
                                <DialogDescription>የምግብ ዝርዝሮችን ያዘምኑ</DialogDescription>
                              </DialogHeader>
                              {editingFood && (
                                <AddFoodForm
                                  initialData={editingFood}
                                  onSuccess={() => {
                                    setEditingFood(null)
                                    const updatedFoods = foodService.getAllFoods()
                                    setFoods(updatedFoods)
                                  }}
                                  onCancel={() => setEditingFood(null)}
                                  isEditing
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>ምግብ ሰርዝ</AlertDialogTitle>
                                <AlertDialogDescription>
                                  እርግጠኛ ነዎት "{food.nameAmharic}" ን መሰረዝ ይፈልጋሉ? ይህ እርምጃ መልሰው ማድረግ አይችሉም።
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>ሰርዝ</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteFood(food.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  አዎ፣ ሰርዝ
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
