import { restaurantInfo } from "@/config/restaurant-config"

export function Footer() {
  const orders = [
    { table: "T1", items: 6, kitchen: "ኩሽና", status: "በሂደት ላይ" },
    { table: "T2", items: 4, kitchen: "ኩሽና" },
    { table: "T3", items: 3, kitchen: "ኩሽና" },
  ]

  return (
    <div className="bg-white border-t p-4 flex gap-4 flex-wrap">
      {orders.map((order, index) => (
        <div
          key={index}
          className={`flex items-center gap-3 bg-${restaurantInfo.secondaryColor}-50 rounded-lg p-3 flex-1 min-w-[200px]`}
        >
          <div
            className={`w-8 h-8 bg-${restaurantInfo.secondaryColor}-400 rounded-full flex items-center justify-center text-white font-medium`}
          >
            {order.table}
          </div>
          <div>
            <div className="text-sm font-medium">
              {order.items} ምግቦች → {order.kitchen}
            </div>
            {order.status && <div className={`text-xs text-${restaurantInfo.secondaryColor}-600`}>{order.status}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
