"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export function Cart() {
  const { items, updateQuantity, removeItem, total, itemCount, clearCart } = useCart()

  return (
    <Card className="w-80 h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            የትዕዛዝ ዝርዝር
          </span>
          {itemCount > 0 && <Badge variant="secondary">{itemCount}</Badge>}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>ምንም ትዕዛዝ የለም</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-green-600 font-semibold">{item.price} ብር</p>
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

            <div className="space-y-4 pt-4">
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>ጠቅላላ:</span>
                  <span className="text-green-600">{total} ብር</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full" size="lg">
                  ክፍያ ፈጽም
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={clearCart}>
                  ሁሉንም አጽዳ
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
