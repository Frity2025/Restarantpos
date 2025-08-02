"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

interface CartProps {
  diningMode: string
}

export function Cart({ diningMode }: CartProps) {
  const { items, updateQuantity, removeItem, clearCart, getTotal, getItemCount } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    setIsProcessing(true)
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    clearCart()
    setIsProcessing(false)
    alert("ትዕዛዝ ተሳክቷል!")
  }

  const getDiningModeText = (mode: string) => {
    switch (mode) {
      case "dine-in":
        return "በሬስቶራንት ውስጥ"
      case "takeaway":
        return "ይዘው ይሂዱ"
      case "delivery":
        return "ማድረስ"
      default:
        return mode
    }
  }

  const taxRate = 0.15
  const serviceCharge = diningMode === "dine-in" ? 0.1 : 0
  const subtotal = getTotal()
  const tax = subtotal * taxRate
  const service = subtotal * serviceCharge
  const total = subtotal + tax + service

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            ትዕዛዝ ({getItemCount()})
          </CardTitle>
          <Badge variant="outline">{getDiningModeText(diningMode)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">ጋሪዎ ባዶ ነው</p>
              <p className="text-sm text-gray-400">ምግብ ለመጨመር ከላይ ይምረጡ</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-lg">🍽️</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.price} ብር</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4">
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>ንዑስ ድምር:</span>
                  <span>{subtotal.toFixed(2)} ብር</span>
                </div>
                <div className="flex justify-between">
                  <span>ታክስ (15%):</span>
                  <span>{tax.toFixed(2)} ብር</span>
                </div>
                {serviceCharge > 0 && (
                  <div className="flex justify-between">
                    <span>የአገልግሎት ክፍያ (10%):</span>
                    <span>{service.toFixed(2)} ብር</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>ጠቅላላ:</span>
                  <span>{total.toFixed(2)} ብር</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button onClick={handleCheckout} disabled={isProcessing} className="w-full" size="lg">
                  {isProcessing ? "እየተሰራ..." : "ትዕዛዝ ላክ"}
                </Button>
                <Button onClick={clearCart} variant="outline" className="w-full bg-transparent" size="sm">
                  ጋሪ አጽዳ
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
