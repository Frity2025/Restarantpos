"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { categories, type FoodItem } from "@/lib/food-management"
import { spicyLevels, allergens } from "@/config/restaurant-config"

interface AddFoodFormProps {
  onSubmit: (data: Omit<FoodItem, "id">) => void
  onCancel: () => void
  initialData?: FoodItem
  isEditing?: boolean
}

export function AddFoodForm({ onSubmit, onCancel, initialData, isEditing = false }: AddFoodFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    nameEn: initialData?.nameEn || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    category: initialData?.category || "",
    image: initialData?.image || "",
    available: initialData?.available ?? true,
    preparationTime: initialData?.preparationTime || 0,
    ingredients: initialData?.ingredients || [],
    allergens: initialData?.allergens || [],
    spicyLevel: initialData?.spicyLevel || 0,
    isVegetarian: initialData?.isVegetarian || false,
    isVegan: initialData?.isVegan || false,
    isGlutenFree: initialData?.isGlutenFree || false,
    tags: initialData?.tags || [],
    nutritionalInfo: initialData?.nutritionalInfo || {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  })

  const [newIngredient, setNewIngredient] = useState("")
  const [newTag, setNewTag] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
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

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const toggleAllergen = (allergen: string) => {
    setFormData((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter((a) => a !== allergen)
        : [...prev.allergens, allergen],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">መሰረታዊ መረጃ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">የምግብ ስም (አማርኛ) *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="nameEn">የምግብ ስም (English) *</Label>
            <Input
              id="nameEn"
              value={formData.nameEn}
              onChange={(e) => setFormData((prev) => ({ ...prev, nameEn: e.target.value }))}
              required
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                {categories.map((category) => (
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
          <Label htmlFor="image">የምስል URL</Label>
          <Input
            id="image"
            type="url"
            value={formData.image}
            onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      {/* Ingredients */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">ንጥረ ነገሮች</h3>
        <div className="flex gap-2">
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
          {formData.ingredients.map((ingredient, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {ingredient}
              <button type="button" onClick={() => removeIngredient(ingredient)} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Allergens */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">አለርጂ አስከሳሾች</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {allergens.map((allergen) => (
            <label key={allergen} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allergens.includes(allergen)}
                onChange={() => toggleAllergen(allergen)}
                className="rounded"
              />
              <span className="text-sm">{allergen}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Dietary Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">የአመጋገብ ምርጫዎች</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isVegetarian}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isVegetarian: checked }))}
            />
            <Label>ቬጀቴሪያን</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isVegan}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isVegan: checked }))}
            />
            <Label>ቪጋን</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isGlutenFree}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isGlutenFree: checked }))}
            />
            <Label>ግሉተን ነጻ</Label>
          </div>
        </div>
      </div>

      {/* Spicy Level */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">የቅመም ደረጃ</h3>
        <Select
          value={formData.spicyLevel.toString()}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, spicyLevel: Number.parseInt(value) }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="የቅመም ደረጃ ምረጥ" />
          </SelectTrigger>
          <SelectContent>
            {spicyLevels.map((level) => (
              <SelectItem key={level.level} value={level.level.toString()}>
                {level.icon} {level.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">መለያዎች</h3>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="መለያ ጨምር..."
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="gap-1">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Nutritional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">የአመጋገብ መረጃ</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    calories: Number.parseInt(e.target.value) || 0,
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
                    protein: Number.parseFloat(e.target.value) || 0,
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
                    carbs: Number.parseFloat(e.target.value) || 0,
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
                    fat: Number.parseFloat(e.target.value) || 0,
                  },
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.available}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, available: checked }))}
        />
        <Label>ይገኛል</Label>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1">
          {isEditing ? "አዘምን" : "ጨምር"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          ሰርዝ
        </Button>
      </div>
    </form>
  )
}
