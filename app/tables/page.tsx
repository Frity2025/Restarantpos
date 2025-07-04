import { ProtectedRoute } from "../../components/protected-route"
import { SidebarNav } from "../../components/sidebar-nav"
import { Header } from "../../components/header"
import { TableLayout } from "../../components/table-layout"

export default function TablesPage() {
  return (
    <ProtectedRoute requiredPermission="table_management">
      <div className="flex h-screen bg-gray-100">
        <SidebarNav />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">የጠረጴዛ አቀማመጥ</h1>
              <p className="text-gray-600">የምግብ ቤቱን የጠረጴዛ አቀማመጥ እና ሁኔታ ይመልከቱ</p>
            </div>
            <TableLayout />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
