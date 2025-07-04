"use client"

import { WaitlistManagement } from "@/components/waitlist-management"
import { ProtectedRoute } from "@/components/protected-route"

export default function WaitlistPage() {
  return (
    <ProtectedRoute requiredPermissions={["manage_waitlist", "view_waitlist"]}>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">የደንበኞች ጥበቃ ዝርዝር</h1>
          <p className="text-gray-600 mt-2">ደንበኞችን ወደ ጥበቃ ዝርዝር ማከል እና አስተዳደር</p>
        </div>
        <WaitlistManagement />
      </div>
    </ProtectedRoute>
  )
}
