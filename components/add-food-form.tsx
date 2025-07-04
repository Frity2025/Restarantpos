"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { foodManager } from "@/lib/food-management"

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
    spicyLevel: "0",
    preparationTime: "",
    ingredients: "",
    allergens: "",
    image: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newFood = {
      ...formData,
      price: Number.parseFloat(formData.price),
      spicyLevel: Number.parseInt(formData.spicyLevel),
      preparationTime: Number.parseInt(formData.preparationTime),
      ingredients: formData.ingredients.split(",").map((item) => item.trim()),
      allergens: formData.allergens
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
    }

    foodManager.addFood(newFood)
    onFoodAdded()
    onClose()
  }

  const categories = ["ዋና ምግቦች", "ቁርስ", "ሾርባዎች", "መጠጦች", "ፈጣን ምግቦች"]
  const types = [
    { value: "VEG", label: "አትክልታዊ" },
    { value: "NON_VEG", label: "ስጋ" },
    { value: "FISH", label: "ዓሳ" },
    { value: "DAIRY", label: "የወተት ተዋጽኦ" },
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>አዲስ ምግብ ጨምር</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">የምግብ ስም</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">ዋጋ (ብር)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">መግለጫ</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">ምድብ</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="ምድብ ይምረጡ" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">አይነት</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="አይነት ይምረጡ" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="spicyLevel">የቅመም ደረጃ (0-5)</Label>
              <Input
                id="spicyLevel"
                type="number"
                min="0"
                max="5"
                value={formData.spicyLevel}
                onChange={(e) => setFormData({ ...formData, spicyLevel: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="preparationTime">የዝግጅት ጊዜ (ደቂቃ)</Label>
              <Input
                id="preparationTime"
                type="number"
                value={formData.preparationTime}
                onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="ingredients">ንጥረ ነገሮች (በኮማ ይለዩ)</Label>
            <Input
              id="ingredients"
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              placeholder="ምሳሌ: እንጀራ, ዶሮ, በርበሬ"
              required
            />
          </div>

          <div>
            <Label htmlFor="allergens">አለርጂ አስከሳሾች (በኮማ ይለዩ)</Label>
            <Input
              id="allergens"
              value={formData.allergens}
              onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
              placeholder="ምሳሌ: ግሉተን, ወተት"
            />
          </div>

          <div>
            <Label htmlFor="image">የምስል አድራሻ</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              ምግብ ጨምር
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
