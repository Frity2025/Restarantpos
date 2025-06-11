import { restaurantInfo } from "@/config/restaurant-config"

interface OrderFooterProps {
  tableNumber: string
  items: number
  kitchen: string
  process?: boolean
}

export function OrderFooter({ tableNumber, items, kitchen, process }: OrderFooterProps) {
  return (
    <div className={`flex items-center gap-2 p-3 bg-${restaurantInfo.secondaryColor}-50 rounded-lg`}>
      <div
        className={`w-8 h-8 bg-${restaurantInfo.secondaryColor}-400 rounded-full flex items-center justify-center text-white font-medium`}
      >
        {tableNumber}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">
          {items} ምግቦች → {kitchen}
        </div>
        {process && <div className={`text-xs text-${restaurantInfo.secondaryColor}-600`}>በሂደት ላይ</div>}
      </div>
    </div>
  )
}
