"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus } from "lucide-react"
import { foodItems } from "@/config/restaurant-config"
import { useCart } from "@/contexts/cart-context"

interface FoodGridProps {
  selectedCategory: string
}

export function FoodGrid({ selectedCategory }: FoodGridProps) {
  const { addItem, removeItem, getItemQuantity } = useCart()

  const filteredItems =
    selectedCategory === "all" ? foodItems : foodItems.filter((item) => item.category === selectedCategory)

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const quantity = getItemQuantity(item.id)

          return (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                {!item.available && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Badge variant="destructive">አልተገኘም</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">{item.price} ብር</span>
                  {item.available && (
                    <div className="flex items-center space-x-2">
                      {quantity > 0 && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => removeItem(item.id)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium">{quantity}</span>
                        </>
                      )}
                      <Button
                        size="sm"
                        onClick={() =>
                          addItem({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                          })
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
