"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FoodGrid } from "@/components/food-grid"
import { Cart } from "@/components/cart"
import { CategoryFilter } from "@/components/category-filter"
import { DiningMode } from "@/components/dining-mode"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"

export default function HomePage() {
  const { employee } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  if (!employee) {
    return <LoginForm />
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />

        <div className="flex-1 flex">
          {/* Left Panel - Food Selection */}
          <div className="flex-1 flex flex-col">
            {/* Dining Mode Selector */}
            <div className="p-4 bg-white border-b">
              <DiningMode />
            </div>

            {/* Category Filter */}
            <div className="p-4 bg-white border-b">
              <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
            </div>

            {/* Food Grid */}
            <div className="flex-1 overflow-auto">
              <FoodGrid selectedCategory={selectedCategory} />
            </div>
          </div>

          {/* Right Panel - Cart */}
          <Cart />
        </div>

        <Footer />
      </div>
    </div>
  )
}
