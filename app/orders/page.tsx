import { ProtectedRoute } from "../../components/protected-route"
import { SidebarNav } from "../../components/sidebar-nav"
import { OrderHistory } from "../../components/order-history"

export default function OrdersPage() {
  return (
    <ProtectedRoute requiredPermission="pos_view">
      <div className="flex h-screen bg-gray-100">
        <SidebarNav />
        <div className="flex-1 overflow-auto">
          <OrderHistory />
        </div>
      </div>
    </ProtectedRoute>
  )
}
