"use client"

import { SystemTestRunner } from "@/components/system-test-runner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TestTube, CheckCircle, AlertTriangle, Info } from "lucide-react"

export default function TestAllPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TestTube className="h-8 w-8" />
            System Test Suite
          </h1>
          <p className="text-muted-foreground">Comprehensive testing for all restaurant POS features</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Test Environment
        </Badge>
      </div>

      {/* Test Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Food Management</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">CRUD operations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Language System</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Translation & currency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory System</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Stock management</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Order & Barcode</CardTitle>
            <Info className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Orders & scanning</p>
          </CardContent>
        </Card>
      </div>

      {/* Test Runner */}
      <SystemTestRunner />

      {/* Test Information */}
      <Card>
        <CardHeader>
          <CardTitle>Test Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">What Gets Tested:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Food item CRUD operations</li>
                <li>• Search and filtering functionality</li>
                <li>• Language switching (English ↔ Amharic)</li>
                <li>• Currency formatting</li>
                <li>• Inventory stock tracking</li>
                <li>• Order creation and status updates</li>
                <li>• Barcode generation and scanning</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Test Environment:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Uses mock data for safety</li>
                <li>• Non-destructive testing</li>
                <li>• Real-time progress tracking</li>
                <li>• Detailed error reporting</li>
                <li>• Performance timing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
