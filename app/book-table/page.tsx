import { ProtectedRoute } from "../../components/protected-route"
import { SidebarNav } from "../../components/sidebar-nav"
import { Header } from "../../components/header"
import { ReservationBooking } from "../../components/reservation-booking"

export default function BookTablePage() {
  return (
    <ProtectedRoute requiredPermission="reservation_create">
      <div className="flex h-screen bg-gray-100">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">አዲስ ቦታ ማስያዝ</h1>
              <p className="text-gray-600">ለደንበኞች አዲስ ቦታ ማስያዝ ይፍጠሩ</p>
            </div>
            <ReservationBooking />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
