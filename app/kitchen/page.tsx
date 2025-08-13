"use client"

import { KitchenDisplay } from "@/components/kitchen-display"
import { SidebarNav } from "@/components/sidebar-nav"
import { useLanguage } from "@/contexts/language-context"

export default function KitchenPage() {
  const { t } = useLanguage()

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{t("kitchen")}</h1>
            <p className="text-muted-foreground">Kitchen order management and preparation tracking</p>
          </div>
          <KitchenDisplay />
        </div>
      </div>
    </div>
  )
}
