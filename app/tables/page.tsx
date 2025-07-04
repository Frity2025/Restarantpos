import { ProtectedRoute } from "../../components/protected-route"
import { SidebarNav } from "../../components/sidebar-nav"
import { TableLayout } from "../../components/table-layout"

export default function TablesPage() {
  return (
    <ProtectedRoute requiredPermission="tables_view">
      <div className="flex h-screen bg-gray-100">
        <SidebarNav />
        <div className="flex-1 overflow-auto">
          <TableLayout />
        </div>
      </div>
    </ProtectedRoute>
  )
}
