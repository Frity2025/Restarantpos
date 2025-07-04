import { ProtectedRoute } from "../../components/protected-route"
import { SidebarNav } from "../../components/sidebar-nav"
import { ReservationBooking } from "../../components/reservation-booking"

export default function BookTablePage() {
  return (
    <ProtectedRoute requiredPermission="tables_manage">
      <div className="flex h-screen bg-gray-100">
        <SidebarNav />
        <div className="flex-1 overflow-auto">
          <ReservationBooking />
        </div>
      </div>
    </ProtectedRoute>
  )
}
