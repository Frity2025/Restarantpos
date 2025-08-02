"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { foodManager } from "@/lib/food-management"
import { foodCategories } from "@/config/restaurant-config"

interface AddFoodFormProps {
  onClose: () => void
  onFoodAdded: () => void
}

export function AddFoodForm({ onClose, onFoodAdded }: AddFoodFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    type: "",
    spicyLevel: 0,
    preparationTime: "",
    ingredients: [] as string[],
    image: "",
  })
  const [currentIngredient, setCurrentIngredient] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const foodTypes = ["VEG", "NON_VEG", "VEGAN"]

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addIngredient = () => {
    if (currentIngredient.trim() && !formData.ingredients.includes(currentIngredient.trim())) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, currentIngredient.trim()],
      }))
      setCurrentIngredient("")
    }
  }

  const removeIngredient = (ingredient: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((ing) => ing !== ingredient),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validation
      if (!formData.title.trim()) {
        throw new Error("Food title is required")
      }
      if (!formData.price || Number.parseFloat(formData.price) <= 0) {
        throw new Error("Valid price is required")
      }
      if (!formData.category) {
        throw new Error("Category is required")
      }
      if (!formData.type) {
        throw new Error("Food type is required")
      }

      const newFood = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number.parseFloat(formData.price),
        category: formData.category,
        type: formData.type,
        spicyLevel: formData.spicyLevel,
        preparationTime: Number.parseInt(formData.preparationTime) || 15,
        ingredients: formData.ingredients,
        image: formData.image || "/placeholder.svg?height=200&width=300",
        available: true,
      }

      foodManager.addFood(newFood)
      onFoodAdded()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add food")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>አዲስ ምግብ ጨምር</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">የምግብ ስም *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="ምግቡን ስም ያስገቡ"
                required
              />
            </div>
            <div>
              <Label htmlFor="price">ዋጋ (ብር) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">መግለጫ</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="የምግቡን መግለጫ ያስገቡ"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>ምድብ *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="ምድብ ይምረጡ" />
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
              <Label>የምግብ አይነት *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="አይነት ይምረጡ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VEG">አትክልታዊ</SelectItem>
                  <SelectItem value="NON_VEG">ስጋ</SelectItem>
                  <SelectItem value="VEGAN">ቪጋን</SelectItem>
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
                onChange={(e) => handleInputChange("preparationTime", e.target.value)}
                placeholder="15"
              />
            </div>
          </div>

          <div>
            <Label>የቅመም ደረጃ</Label>
            <div className="flex gap-2 mt-2">
              {[0, 1, 2, 3, 4, 5].map((level) => (
                <Button
                  key={level}
                  type="button"
                  variant={formData.spicyLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleInputChange("spicyLevel", level)}
                >
                  {level === 0 ? "ምንም" : "🌶️".repeat(level)}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>ንጥረ ነገሮች</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                placeholder="ንጥረ ነገር ያስገቡ"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addIngredient())}
              />
              <Button type="button" onClick={addIngredient} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.ingredients.map((ingredient) => (
                <Badge key={ingredient} variant="secondary" className="flex items-center gap-1">
                  {ingredient}
                  <button
                    type="button"
                    onClick={() => removeIngredient(ingredient)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="image">የምግብ ምስል URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => handleInputChange("image", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "እየጨመረ..." : "ምግብ ጨምር"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              ሰርዝ
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
