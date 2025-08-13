"use client"

import { OrderStats } from "@/components/order-stats"
import { SidebarNav } from "@/components/sidebar-nav"
import { useLanguage } from "@/contexts/language-context"

export default function StatsPage() {
  const { t } = useLanguage()

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{t("reports")}</h1>
            <p className="text-muted-foreground">Restaurant analytics and performance metrics</p>
          </div>
          <OrderStats />
        </div>
      </div>
    </div>
  )
}
