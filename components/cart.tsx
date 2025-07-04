"use client"

import { useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart, Plus, Minus, Trash2, CreditCard } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { restaurantInfo } from "@/config/restaurant-config"

export function Cart() {
  const { items, addItem, removeItem, clearCart, getTotalPrice, getTotalItems } = useCart()
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const subtotal = getTotalPrice()
  const tax = subtotal * restaurantInfo.taxRate
  const serviceCharge = subtotal * restaurantInfo.serviceCharge
  const total = subtotal + tax + serviceCharge

  const handleCheckout = async () => {
    setIsProcessingPayment(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessingPayment(false)
    clearCart()
    alert("ክፍያ በተሳካ ሁኔታ ተጠናቋል!")
  }

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>የትዕዛዝ ዝርዝር</span>
          </div>
          <Badge variant="secondary">{getTotalItems()} ዕቃዎች</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>የትዕዛዝ ዝርዝርዎ ባዶ ነው</p>
              <p className="text-sm">ምግብ ለመጨመር ይምረጡ</p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.price} ብር</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => removeItem(item.id)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-medium w-8 text-center">{item.quantity}</span>
                      <Button size="sm" variant="outline" onClick={() => addItem(item)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>ንዑስ ድምር:</span>
                  <span>{subtotal.toFixed(2)} ብር</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>ታክስ ({(restaurantInfo.taxRate * 100).toFixed(0)}%):</span>
                  <span>{tax.toFixed(2)} ብር</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>የአገልግሎት ክፍያ ({(restaurantInfo.serviceCharge * 100).toFixed(0)}%):</span>
                  <span>{serviceCharge.toFixed(2)} ብር</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>ጠቅላላ:</span>
                  <span>{total.toFixed(2)} ብር</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full" onClick={handleCheckout} disabled={isProcessingPayment}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {isProcessingPayment ? "እየተከፈለ..." : "ክፈል"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={clearCart}
                  disabled={isProcessingPayment}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  ዝርዝር አጽዳ
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </div>
  )
}
