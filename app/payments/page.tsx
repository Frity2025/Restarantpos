import { ProtectedRoute } from "../../components/protected-route"
import { SidebarNav } from "../../components/sidebar-nav"
import { PaymentHistory } from "../../components/payment-history"

export default function PaymentsPage() {
  return (
    <ProtectedRoute requiredPermission="process_payments">
      <div className="flex h-screen bg-gray-100">
        <SidebarNav />
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <PaymentHistory />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
