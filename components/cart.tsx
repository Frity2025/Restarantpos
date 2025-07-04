"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export function Cart() {
  const { items, updateQuantity, removeItem, total, itemCount, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            የግዢ ጋሪ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">ጋሪዎ ባዶ ነው</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            የግዢ ጋሪ
          </div>
          <Badge variant="secondary">{itemCount}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 space-y-4 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.price} ብር</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Separator />
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>ጠቅላላ:</span>
            <span>{total} ብር</span>
          </div>
          <div className="space-y-2">
            <Button className="w-full" size="lg">
              ክፍያ ፈጽም
            </Button>
            <Button variant="outline" className="w-full bg-transparent" onClick={clearCart}>
              ጋሪ አጽዳ
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
