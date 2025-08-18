"use client"

import { SystemTestRunner } from "@/components/system-test-runner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ArrowLeft, TestTube } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TestAllPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to POS
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <TestTube className="h-6 w-6" />
                System Test Suite
              </h1>
              <Badge variant="secondary">v2.0</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Test Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">11</div>
                <div className="text-sm text-blue-600">Total Tests</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">4</div>
                <div className="text-sm text-green-600">Food Management</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">2</div>
                <div className="text-sm text-purple-600">Language System</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">5</div>
                <div className="text-sm text-orange-600">Other Systems</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Food Management Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Add Food Item</li>
                <li>• Search Food Items</li>
                <li>• Update Food Item</li>
                <li>• Delete Food Item</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Language System Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Switch Language (EN ↔ AM)</li>
                <li>• Currency Formatting</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Other System Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Inventory Stock Levels</li>
                <li>• Low Stock Alerts</li>
                <li>• Create Order</li>
                <li>• Update Order Status</li>
                <li>• Barcode Generation</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Test Runner */}
        <SystemTestRunner />
      </div>
    </div>
  )
}
