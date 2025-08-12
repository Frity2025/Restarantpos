"use client"

import type React from "react"
import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { BarcodeInput } from "./barcode-input"
import { BarcodeGenerator } from "@/lib/barcode-generator"
import { foodService, categories } from "@/lib/food-management"
import { toast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import type { Food } from "@/types/order"

interface AddFoodFormProps {
  onSuccess: () => void
  onCancel: () => void
  initialData?: Food
  isEditing?: boolean
}

export function AddFoodForm({ onSuccess, onCancel, initialData, isEditing = false }: AddFoodFormProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    nameAmharic: initialData?.nameAmharic || "",
    description: initialData?.description || "",
    descriptionAmharic: initialData?.descriptionAmharic || "",
    price: initialData?.price || 0,
    category: initialData?.category || "",
    preparationTime: initialData?.preparationTime || 15,
    spiceLevel: (initialData?.spiceLevel as "mild" | "medium" | "hot") || "medium",
    isVegetarian: initialData?.isVegetarian || false,
    isAvailable: initialData?.isAvailable !== undefined ? initialData.isAvailable : true,
    barcode: initialData?.barcode || "",
    ingredients: initialData?.ingredients || [],
    allergens: initialData?.allergens || [],
    nutritionalInfo: initialData?.nutritionalInfo || {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  })

  const [newIngredient, setNewIngredient] = useState("")
  const [newAllergen, setNewAllergen] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.nameAmharic || !formData.category || formData.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Generate barcode if not provided
    let barcode = formData.barcode
    if (!barcode) {
      barcode = BarcodeGenerator.generateProductBarcode(Date.now().toString(), formData.category)
    }

    const foodData: Omit<Food, "id"> = {
      name: formData.name,
      nameAmharic: formData.nameAmharic,
      description: formData.description,
      descriptionAmharic: formData.descriptionAmharic,
      price: formData.price,
      category: formData.category,
      image: `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(formData.nameAmharic)}`,
      preparationTime: formData.preparationTime,
      spiceLevel: formData.spiceLevel,
      isVegetarian: formData.isVegetarian,
      isAvailable: formData.isAvailable,
      barcode,
      ingredients: formData.ingredients,
      allergens: formData.allergens,
      nutritionalInfo: formData.nutritionalInfo,
    }

    let success = false
    if (isEditing && initialData) {
      success = foodService.updateFood(initialData.id, foodData)
    } else {
      success = foodService.addFood(foodData)
    }

    if (success) {
      toast({
        title: t("success"),
        description: isEditing ? t("itemUpdated") : t("itemAdded"),
      })
      onSuccess()
    } else {
      toast({
        title: t("error"),
        description: t("operationFailed"),
        variant: "destructive",
      })
    }
  }

  const addIngredient = () => {
    if (newIngredient.trim() && !formData.ingredients.includes(newIngredient.trim())) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim()],
      }))
      setNewIngredient("")
    }
  }

  const removeIngredient = (ingredient: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((i) => i !== ingredient),
    }))
  }

  const addAllergen = () => {
    if (newAllergen.trim() && !formData.allergens.includes(newAllergen.trim())) {
      setFormData((prev) => ({
        ...prev,
        allergens: [...prev.allergens, newAllergen.trim()],
      }))
      setNewAllergen("")
    }
  }

  const removeAllergen = (allergen: string) => {
    setFormData((prev) => ({
      ...prev,
      allergens: prev.allergens.filter((a) => a !== allergen),
    }))
  }

  const generateBarcode = () => {
    if (formData.category) {
      const newBarcode = BarcodeGenerator.generateProductBarcode(Date.now().toString(), formData.category)
      setFormData((prev) => ({ ...prev, barcode: newBarcode }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>መሰረታዊ መረጃ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">ስም (English) *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="nameAmharic">ስም (አማርኛ) *</Label>
              <Input
                id="nameAmharic"
                value={formData.nameAmharic}
                onChange={(e) => setFormData((prev) => ({ ...prev, nameAmharic: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description">መግለጫ (English)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="descriptionAmharic">መግለጫ (አማርኛ)</Label>
              <Textarea
                id="descriptionAmharic"
                value={formData.descriptionAmharic}
                onChange={(e) => setFormData((prev) => ({ ...prev, descriptionAmharic: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">ዋጋ (ብር) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">ምድብ *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="ምድብ ይምረጡ" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nameAmharic}
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
                min="1"
                value={formData.preparationTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, preparationTime: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="spiceLevel">የቅመም ደረጃ</Label>
              <Select
                value={formData.spiceLevel}
                onValueChange={(value: "mild" | "medium" | "hot") =>
                  setFormData((prev) => ({ ...prev, spiceLevel: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">🌶️ ቀላል</SelectItem>
                  <SelectItem value="medium">🌶️🌶️ መካከለኛ</SelectItem>
                  <SelectItem value="hot">🌶️🌶️🌶️ ጠንካራ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-4 pt-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isVegetarian"
                  checked={formData.isVegetarian}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isVegetarian: checked as boolean }))}
                />
                <Label htmlFor="isVegetarian">ቬጀቴሪያን</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isAvailable: checked as boolean }))}
                />
                <Label htmlFor="isAvailable">ይገኛል</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ባርኮድ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <BarcodeInput
                value={formData.barcode}
                onChange={(value) => setFormData((prev) => ({ ...prev, barcode: value }))}
                label="የምርት ባርኮድ"
                placeholder="ባርኮድ ይስካን ወይም ያስገቡ"
              />
            </div>
            <Button type="button" variant="outline" onClick={generateBarcode} className="mt-6 bg-transparent">
              ፍጠር
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ንጥረ ነገሮች እና አለርጂ አስነሳሾች</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>ንጥረ ነገሮች</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="ንጥረ ነገር ጨምር..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addIngredient())}
              />
              <Button type="button" onClick={addIngredient} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.ingredients.map((ingredient) => (
                <Badge key={ingredient} variant="secondary" className="flex items-center gap-1">
                  {ingredient}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeIngredient(ingredient)} />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>አለርጂ አስነሳሾች</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newAllergen}
                onChange={(e) => setNewAllergen(e.target.value)}
                placeholder="አለርጂ አስነሳሽ ጨምር..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAllergen())}
              />
              <Button type="button" onClick={addAllergen} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.allergens.map((allergen) => (
                <Badge key={allergen} variant="destructive" className="flex items-center gap-1">
                  {allergen}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeAllergen(allergen)} />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>የአመጋገብ መረጃ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="calories">ካሎሪ</Label>
              <Input
                id="calories"
                type="number"
                min="0"
                value={formData.nutritionalInfo.calories}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    nutritionalInfo: {
                      ...prev.nutritionalInfo,
                      calories: Number(e.target.value),
                    },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="protein">ፕሮቲን (ግ)</Label>
              <Input
                id="protein"
                type="number"
                min="0"
                step="0.1"
                value={formData.nutritionalInfo.protein}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    nutritionalInfo: {
                      ...prev.nutritionalInfo,
                      protein: Number(e.target.value),
                    },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="carbs">ካርቦሃይድሬት (ግ)</Label>
              <Input
                id="carbs"
                type="number"
                min="0"
                step="0.1"
                value={formData.nutritionalInfo.carbs}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    nutritionalInfo: {
                      ...prev.nutritionalInfo,
                      carbs: Number(e.target.value),
                    },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="fat">ስብ (ግ)</Label>
              <Input
                id="fat"
                type="number"
                min="0"
                step="0.1"
                value={formData.nutritionalInfo.fat}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    nutritionalInfo: {
                      ...prev.nutritionalInfo,
                      fat: Number(e.target.value),
                    },
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button type="submit">
          <Plus className="mr-2 h-4 w-4" />
          {isEditing ? "ምግብ አዘምን" : "ምግብ ጨምር"}
        </Button>
      </div>
    </form>
  )
}
