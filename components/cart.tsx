import { Button } from "@/components/ui/button"
import { CreditCard, QrCode, Banknote, Edit2 } from "lucide-react"
import { foodItems, taxRate, paymentMethods, restaurantInfo } from "@/config/restaurant-config"

// ለምሳሌ ያህል የተመረጡ ምግቦች
const selectedItems = [
  { ...foodItems[1], quantity: 1 },
  { ...foodItems[3], quantity: 1 },
  { ...foodItems[4], quantity: 1 },
  { ...foodItems[2], quantity: 1 },
]

export function Cart() {
  const subtotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const tax = subtotal * taxRate
  const total = subtotal + tax

  return (
    <div className="w-[380px] bg-white border-l flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">ጠረጴዛ 4</h2>
          <p className="text-sm text-gray-500">ፍሎይድ ማይልስ</p>
        </div>
        <Button variant="ghost" size="icon">
          <Edit2 className="h-5 w-5" />
        </Button>
      </div>
      <div className="p-4 border-b">
        <div className="flex gap-2 mb-4">
          <Button variant="secondary" className="flex-1 rounded-full">
            በቦታው መመገብ
          </Button>
          <Button variant="outline" className="flex-1 rounded-full">
            ይዞ መሄድ
          </Button>
          <Button variant="outline" className="flex-1 rounded-full">
            ማድረስ
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {selectedItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3 mb-4">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="text-sm font-medium">{item.title}</h4>
              <div className="flex justify-between items-center mt-1">
                <span className={`text-${restaurantInfo.primaryColor}-600 font-bold`}>${item.price.toFixed(2)}</span>
                <span className="text-sm text-gray-500">{item.quantity}X</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">ንዑስ ድምር</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">ታክስ {taxRate * 100}%</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>ጠቅላላ ዋጋ</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {paymentMethods.map((method, index) => (
            <Button key={index} variant="outline" className="flex flex-col items-center py-2">
              {method.id === "cash" && <Banknote className="h-5 w-5 mb-1" />}
              {method.id === "card" && <CreditCard className="h-5 w-5 mb-1" />}
              {method.id === "qr" && <QrCode className="h-5 w-5 mb-1" />}
              <span className="text-xs">{method.label}</span>
            </Button>
          ))}
        </div>
        <Button
          className={`w-full bg-${restaurantInfo.primaryColor}-600 hover:bg-${restaurantInfo.primaryColor}-700 text-white h-12`}
        >
          ትዕዛዝ አስገባ
        </Button>
      </div>
    </div>
  )
}
