"use client"

import { useState } from "react"
import { FoodManagementPanel } from "../../components/food-management-panel"
import { AddFoodForm } from "../../components/add-food-form"
import { SidebarNav } from "../../components/sidebar-nav"

export default function AdminPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleFoodAdded = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        {showAddForm ? (
          <div className="p-6">
            <AddFoodForm onClose={() => setShowAddForm(false)} onFoodAdded={handleFoodAdded} />
          </div>
        ) : (
          <FoodManagementPanel key={refreshKey} />
        )}
      </div>
    </div>
  )
}
