"use client"

import { useState } from "react"
import { EmployeeManagement } from "@/components/employee-management"
import { AddEmployeeForm } from "@/components/add-employee-form"
import { SidebarNav } from "@/components/sidebar-nav"
import { useLanguage } from "@/contexts/language-context"

export default function EmployeesPage() {
  const { t } = useLanguage()
  const [showAddForm, setShowAddForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleEmployeeAdded = () => {
    setRefreshKey((prev) => prev + 1)
    setShowAddForm(false)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{t("employeeManagement")}</h1>
            <p className="text-muted-foreground">Manage restaurant staff and permissions</p>
          </div>

          {showAddForm ? (
            <AddEmployeeForm onClose={() => setShowAddForm(false)} onEmployeeAdded={handleEmployeeAdded} />
          ) : (
            <EmployeeManagement key={refreshKey} onAddEmployee={() => setShowAddForm(true)} />
          )}
        </div>
      </div>
    </div>
  )
}
