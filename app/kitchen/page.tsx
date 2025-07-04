import { ProtectedRoute } from "../../components/protected-route"
import { SidebarNav } from "../../components/sidebar-nav"
import { KitchenDisplay } from "../../components/kitchen-display"

export default function KitchenPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        <SidebarNav />
        <div className="flex-1 overflow-auto">
          <KitchenDisplay />
        </div>
      </div>
    </ProtectedRoute>
  )
}
