"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { SidebarNav } from "@/components/sidebar-nav"
import { DiningMode } from "@/components/dining-mode"
import { CategoryFilter } from "@/components/category-filter"
import { FoodGrid } from "@/components/food-grid"
import { Cart } from "@/components/cart"
import { Footer } from "@/components/footer"
import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"

export default function HomePage() {
  const { employee } = useAuth()
  const { addItem } = useCart()
  const [selectedDiningMode, setSelectedDiningMode] = useState("dine-in")
  const [selectedCategory, setSelectedCategory] = useState("all")

  if (!employee) {
    return <LoginForm />
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <DiningMode selectedMode={selectedDiningMode} onModeChange={setSelectedDiningMode} />

              <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

              <FoodGrid selectedCategory={selectedCategory} onAddToCart={addItem} />
            </div>
          </div>

          <div className="w-80 p-6">
            <Cart />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
