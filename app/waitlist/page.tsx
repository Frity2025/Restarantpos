"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WaitlistManagement } from "@/components/waitlist-management"

export default function WaitlistPage() {
  return (
    <ProtectedRoute requiredPermission="waitlist_view">
      <div className="flex h-screen bg-gray-50">
        <SidebarNav />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">የደንበኞች ጥበቃ ዝርዝር</h1>
                <p className="text-gray-600 mt-2">የደንበኞች ጥበቃ ዝርዝር አስተዳደር እና ክትትል</p>
              </div>
              <WaitlistManagement />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  )
}
