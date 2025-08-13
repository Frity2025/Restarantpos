"use client"

import { InventoryManagement } from "@/components/inventory-management"
import { ProtectedRoute } from "@/components/protected-route"
import { useLanguage } from "@/contexts/language-context"

export default function InventoryPage() {
  const { t } = useLanguage()

  return (
    <ProtectedRoute requiredPermissions={["manage_inventory", "view_inventory"]}>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{t("inventoryManagement")}</h1>
          <p className="text-muted-foreground">Manage restaurant inventory and stock levels</p>
        </div>
        <InventoryManagement />
      </div>
    </ProtectedRoute>
  )
}
