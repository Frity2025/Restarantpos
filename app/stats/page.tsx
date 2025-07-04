import { ProtectedRoute } from "../../components/protected-route"
import { SidebarNav } from "../../components/sidebar-nav"
import { OrderStatsComponent } from "../../components/order-stats"

export default function StatsPage() {
  return (
    <ProtectedRoute requiredPermission="reports_view">
      <div className="flex h-screen bg-gray-100">
        <SidebarNav />
        <div className="flex-1 overflow-auto">
          <OrderStatsComponent />
        </div>
      </div>
    </ProtectedRoute>
  )
}
