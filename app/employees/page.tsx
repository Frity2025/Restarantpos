"use client"

import { useState } from "react"
import { ProtectedRoute } from "../../components/protected-route"
import { SidebarNav } from "../../components/sidebar-nav"
import { EmployeeManagement } from "../../components/employee-management"
import { AddEmployeeForm } from "../../components/add-employee-form"

export default function EmployeesPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleEmployeeAdded = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <ProtectedRoute requiredPermission="employees_view">
      <div className="flex h-screen bg-gray-100">
        <SidebarNav />
        <div className="flex-1 overflow-auto">
          {showAddForm ? (
            <div className="p-6">
              <AddEmployeeForm onClose={() => setShowAddForm(false)} onEmployeeAdded={handleEmployeeAdded} />
            </div>
          ) : (
            <EmployeeManagement key={refreshKey} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
