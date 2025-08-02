"use client"

import { NotificationManagement } from "@/components/notification-management"
import { ProtectedRoute } from "@/components/protected-route"

export default function NotificationsPage() {
  return (
    <ProtectedRoute requiredPermissions={["admin_access", "manage_notifications"]}>
      <div className="container mx-auto py-6">
        <NotificationManagement />
      </div>
    </ProtectedRoute>
  )
}
