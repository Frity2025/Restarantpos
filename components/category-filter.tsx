"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { categories } from "@/lib/food-management"

interface CategoryFilterProps {
  value: string
  onChange: (value: string) => void
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">ምድቦች</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button variant={value === "all" ? "default" : "outline"} onClick={() => onChange("all")} size="sm">
            ሁሉም
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={value === category.id ? "default" : "outline"}
              onClick={() => onChange(category.id)}
              size="sm"
              className="flex items-center gap-1"
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
