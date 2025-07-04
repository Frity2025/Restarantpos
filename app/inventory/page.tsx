"use client"

import { InventoryManagement } from "@/components/inventory-management"
import { ProtectedRoute } from "@/components/protected-route"

export default function InventoryPage() {
  return (
    <ProtectedRoute requiredPermissions={["manage_inventory", "view_inventory"]}>
      <div className="container mx-auto py-6">
        <InventoryManagement />
      </div>
    </ProtectedRoute>
  )
}
