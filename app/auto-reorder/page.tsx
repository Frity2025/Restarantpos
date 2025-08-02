"use client"

import { AutoReorderManagement } from "@/components/auto-reorder-management"
import { ProtectedRoute } from "@/components/protected-route"

export default function AutoReorderPage() {
  return (
    <ProtectedRoute requiredPermissions={["manage_inventory", "view_inventory"]}>
      <div className="container mx-auto py-6">
        <AutoReorderManagement />
      </div>
    </ProtectedRoute>
  )
}
