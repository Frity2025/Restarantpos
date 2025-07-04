import { ProtectedRoute } from "../../components/protected-route"
import { SidebarNav } from "../../components/sidebar-nav"
import { ReservationManagement } from "../../components/reservation-management"

export default function ReservationsPage() {
  return (
    <ProtectedRoute requiredPermission="tables_view">
      <div className="flex h-screen bg-gray-100">
        <SidebarNav />
        <div className="flex-1 overflow-auto">
          <ReservationManagement />
        </div>
      </div>
    </ProtectedRoute>
  )
}
