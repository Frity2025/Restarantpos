import { ProtectedRoute } from "@/components/protected-route"
import { WaitlistManagement } from "@/components/waitlist-management"

export default function WaitlistPage() {
  return (
    <ProtectedRoute requiredPermission="manage_waitlist">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">የጥበቃ ዝርዝር አስተዳደር</h1>
          <p className="text-gray-600 mt-2">ደንበኞች ጠረጴዛ ሲጠብቁ የጥበቃ ዝርዝር አስተዳደር እና ማሳወቂያ ስርዓት</p>
        </div>
        <WaitlistManagement />
      </div>
    </ProtectedRoute>
  )
}
