"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit2 } from "lucide-react"
import { orderManager } from "@/lib/order-management"
import { PaymentProcessing } from "./payment-processing"
import { useAuth } from "@/contexts/auth-context"
import type { OrderItem, OrderType, Order } from "@/types/order"
import type { Payment } from "@/types/payment"

const cartItems: OrderItem[] = [
  {
    id: "item-001",
    foodId: "injera-doro",
    foodName: "እንጀራ በዶሮ ወጥ",
    foodImage: "/placeholder.svg?height=200&width=300",
    price: 250.0,
    quantity: 1,
    totalPrice: 250.0,
  },
  {
    id: "item-002",
    foodId: "fresh-juice",
    foodName: "ትኩስ ጭማቂ",
    foodImage: "/placeholder.svg?height=200&width=300",
    price: 60.0,
    quantity: 2,
    totalPrice: 120.0,
  },
]

export function Cart() {
  const { employee } = useAuth()
  const [orderType, setOrderType] = useState<OrderType>("dine_in")
  const [customerInfo, setCustomerInfo] = useState({
    name: "ፍሎይድ ማይልስ",
    phone: "",
    address: "",
    tableNumber: "4",
  })
  const [notes, setNotes] = useState({
    kitchen: "",
    customer: "",
  })
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)

  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0)
  const tax = subtotal * 0.05
  const total = subtotal + tax

  const handlePlaceOrder = async () => {
    if (!employee) return

    setIsPlacingOrder(true)
    try {
      const orderData = {
        tableNumber: orderType === "dine_in" ? customerInfo.tableNumber : undefined,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone || undefined,
        customerAddress: orderType === "delivery" ? customerInfo.address : undefined,
        orderType,
        items: cartItems,
        employeeId: employee.id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        kitchenNotes: notes.kitchen || undefined,
        customerNotes: notes.customer || undefined,
      }

      const newOrder = orderManager.createOrder(orderData)
      setCurrentOrder(newOrder)
      setShowPayment(true)
    } catch (error) {
      alert("ትዕዛዝ መፍጠር አልተሳካም")
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const handlePaymentComplete = (payment: Payment) => {
    alert(`ክፍያ በተሳካ ሁኔታ ተጠናቋል! ደረሰኝ ቁጥር: ${payment.receiptNumber}`)
    setShowPayment(false)
    setCurrentOrder(null)
    // Clear cart in real implementation
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
    // Optionally cancel the order or keep it pending
  }

  return (
    <div className="w-[380px] bg-white border-l flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">ጠረጴዛ {customerInfo.tableNumber}</h2>
          <p className="text-sm text-gray-500">{customerInfo.name}</p>
        </div>
        <Button variant="ghost" size="icon">
          <Edit2 className="h-5 w-5" />
        </Button>
      </div>

      {/* የትዕዛዝ አይነት */}
      <div className="p-4 border-b">
        <div className="flex gap-2 mb-4">
          <Button
            variant={orderType === "dine_in" ? "secondary" : "outline"}
            className="flex-1 rounded-full"
            onClick={() => setOrderType("dine_in")}
          >
            በቦታው መመገብ
          </Button>
          <Button
            variant={orderType === "takeaway" ? "secondary" : "outline"}
            className="flex-1 rounded-full"
            onClick={() => setOrderType("takeaway")}
          >
            ይዞ መሄድ
          </Button>
          <Button
            variant={orderType === "delivery" ? "secondary" : "outline"}
            className="flex-1 rounded-full"
            onClick={() => setOrderType("delivery")}
          >
            ማድረስ
          </Button>
        </div>

        {/* የደንበኛ መረጃ */}
        <div className="space-y-2">
          <Input
            placeholder="የደንበኛ ስም"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
          />
          <Input
            placeholder="ስልክ ቁጥር"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
          />
          {orderType === "dine_in" && (
            <Input
              placeholder="የጠረጴዛ ቁጥር"
              value={customerInfo.tableNumber}
              onChange={(e) => setCustomerInfo({ ...customerInfo, tableNumber: e.target.value })}
            />
          )}
          {orderType === "delivery" && (
            <Input
              placeholder="አድራሻ"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
            />
          )}
        </div>
      </div>

      {/* የትዕዛዝ ንጥሎች */}
      <div className="flex-1 overflow-auto p-4">
        {cartItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3 mb-4">
            <img
              src={item.foodImage || "/placeholder.svg"}
              alt={item.foodName}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="text-sm font-medium">{item.foodName}</h4>
              <div className="flex justify-between items-center mt-1">
                <span className="text-green-600 font-bold">${item.price.toFixed(2)}</span>
                <span className="text-sm text-gray-500">{item.quantity}X</span>
              </div>
            </div>
          </div>
        ))}

        {/* ማስታወሻዎች */}
        <div className="space-y-2 mt-4">
          <Textarea
            placeholder="ለኩሽና ማስታወሻ..."
            value={notes.kitchen}
            onChange={(e) => setNotes({ ...notes, kitchen: e.target.value })}
            rows={2}
          />
          <Textarea
            placeholder="ከደንበኛ ማስታወሻ..."
            value={notes.customer}
            onChange={(e) => setNotes({ ...notes, customer: e.target.value })}
            rows={2}
          />
        </div>
      </div>

      {/* የክፍያ ክፍል */}
      <div className="border-t p-4">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">ንዑስ ድምር</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">ታክስ 5%</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>ጠቅላላ ዋጋ</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
        >
          {isPlacingOrder ? "እየተፈጥር ነው..." : "ትዕዛዝ አስገባ እና ክፍያ አስኬድ"}
        </Button>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>ክፍያ ማስኬጃ</DialogTitle>
          </DialogHeader>
          {currentOrder && (
            <PaymentProcessing
              order={currentOrder}
              onPaymentComplete={handlePaymentComplete}
              onCancel={handlePaymentCancel}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
