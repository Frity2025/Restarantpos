"use client"

import { ReportingDashboard } from "@/components/reporting-dashboard"
import { ProtectedRoute } from "@/components/protected-route"

export default function ReportsPage() {
  return (
    <ProtectedRoute requiredPermissions={["view_analytics", "admin_access"]}>
      <div className="container mx-auto py-6">
        <ReportingDashboard />
      </div>
    </ProtectedRoute>
  )
}
