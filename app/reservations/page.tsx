import { ProtectedRoute } from "../../components/protected-route"
import { SidebarNav } from "../../components/sidebar-nav"
import { Header } from "../../components/header"
import { ReservationManagement } from "../../components/reservation-management"

export default function ReservationsPage() {
  return (
    <ProtectedRoute requiredPermission="reservation_management">
      <div className="flex h-screen bg-gray-100">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">ቦታ ማስያዝ አስተዳደር</h1>
              <p className="text-gray-600">የደንበኞች ቦታ ማስያዝ ይመልከቱ እና ያስተዳድሩ</p>
            </div>
            <ReservationManagement />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
