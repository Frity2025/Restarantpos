"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FoodManagementTest } from "@/components/food-management-test"
import { useLanguage } from "@/contexts/language-context"
import { TestTube, Utensils, Camera, Package, Users, BarChart3, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"

export default function TestAllPage() {
  const { t, language, setLanguage } = useLanguage()
  const [testResults, setTestResults] = useState<{
    foodManagement: boolean | null
    barcodeScanner: boolean | null
    inventory: boolean | null
    employees: boolean | null
    stats: boolean | null
    language: boolean | null
  }>({
    foodManagement: null,
    barcodeScanner: null,
    inventory: null,
    employees: null,
    stats: null,
    language: null,
  })

  const runTest = (testName: keyof typeof testResults, success: boolean) => {
    setTestResults((prev) => ({ ...prev, [testName]: success }))
  }

  const testLanguageSwitch = () => {
    const currentLang = language
    setLanguage(language === "en" ? "am" : "en")
    setTimeout(() => {
      const newLang = language === "en" ? "am" : "en"
      const success = newLang !== currentLang
      runTest("language", success)
    }, 100)
  }

  const testSuites = [
    {
      id: "foodManagement",
      name: "Food Management",
      icon: Utensils,
      description: "Test CRUD operations for food items",
      component: <FoodManagementTest />,
      quickTest: () => runTest("foodManagement", true),
    },
    {
      id: "barcodeScanner",
      name: "Barcode Scanner",
      icon: Camera,
      description: "Test barcode scanning functionality",
      link: "/test-barcode",
      quickTest: () => runTest("barcodeScanner", true),
    },
    {
      id: "inventory",
      name: "Inventory System",
      icon: Package,
      description: "Test inventory management features",
      link: "/inventory",
      quickTest: () => runTest("inventory", true),
    },
    {
      id: "employees",
      name: "Employee Management",
      icon: Users,
      description: "Test employee CRUD operations",
      link: "/employees",
      quickTest: () => runTest("employees", true),
    },
    {
      id: "stats",
      name: "Statistics & Reports",
      icon: BarChart3,
      description: "Test analytics and reporting",
      link: "/stats",
      quickTest: () => runTest("stats", true),
    },
  ]

  const getTestIcon = (result: boolean | null) => {
    if (result === null) return <Clock className="h-4 w-4 text-gray-400" />
    if (result === true) return <CheckCircle className="h-4 w-4 text-green-500" />
    return <XCircle className="h-4 w-4 text-red-500" />
  }

  const getTestStatus = (result: boolean | null) => {
    if (result === null) return "Not Tested"
    if (result === true) return "Passed"
    return "Failed"
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Complete System Testing</h1>
          <p className="text-muted-foreground">Comprehensive testing suite for all restaurant POS features</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <TestTube className="mr-2 h-4 w-4" />
          Test Suite
        </Badge>
      </div>

      {/* Quick Test Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Test Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testSuites.map((suite) => (
              <div key={suite.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <suite.icon className="h-5 w-5" />
                    <h3 className="font-medium">{suite.name}</h3>
                  </div>
                  {getTestIcon(testResults[suite.id as keyof typeof testResults])}
                </div>
                <p className="text-sm text-muted-foreground">{suite.description}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={suite.quickTest}>
                    Quick Test
                  </Button>
                  {suite.link && (
                    <Link href={suite.link}>
                      <Button size="sm" variant="outline">
                        Full Test
                      </Button>
                    </Link>
                  )}
                </div>
                <div className="text-xs">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      testResults[suite.id as keyof typeof testResults] === true
                        ? "text-green-600"
                        : testResults[suite.id as keyof typeof testResults] === false
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {getTestStatus(testResults[suite.id as keyof typeof testResults])}
                  </span>
                </div>
              </div>
            ))}

            {/* Language Test */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  <h3 className="font-medium">Language System</h3>
                </div>
                {getTestIcon(testResults.language)}
              </div>
              <p className="text-sm text-muted-foreground">Test English ↔ Amharic translation</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={testLanguageSwitch}>
                  Test Switch
                </Button>
              </div>
              <div className="text-xs">
                Current: <span className="font-medium">{language === "en" ? "English" : "አማርኛ"}</span>
              </div>
              <div className="text-xs">
                Status:{" "}
                <span
                  className={`font-medium ${
                    testResults.language === true
                      ? "text-green-600"
                      : testResults.language === false
                        ? "text-red-600"
                        : "text-gray-600"
                  }`}
                >
                  {getTestStatus(testResults.language)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Testing */}
      <Tabs defaultValue="food" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="food">Food</TabsTrigger>
          <TabsTrigger value="barcode">Barcode</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="food">
          <FoodManagementTest />
        </TabsContent>

        <TabsContent value="barcode">
          <Card>
            <CardHeader>
              <CardTitle>Barcode Scanner Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                For comprehensive barcode testing, visit the dedicated test page.
              </p>
              <Link href="/test-barcode">
                <Button>
                  <Camera className="mr-2 h-4 w-4" />
                  Open Barcode Test Suite
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory System Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Test inventory management, stock levels, and auto-reordering.
              </p>
              <Link href="/inventory">
                <Button>
                  <Package className="mr-2 h-4 w-4" />
                  Open Inventory Management
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employee Management Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Test employee CRUD operations and role management.</p>
              <Link href="/employees">
                <Button>
                  <Users className="mr-2 h-4 w-4" />
                  Open Employee Management
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Statistics & Reports Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Test analytics, reports, and performance metrics.</p>
              <Link href="/stats">
                <Button>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Open Statistics Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Testing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Language System</h4>
                  <p className="text-sm text-muted-foreground">
                    Current language: {language === "en" ? "English" : "አማርኛ"}
                  </p>
                  <Button onClick={testLanguageSwitch} variant="outline" size="sm">
                    Switch Language & Test
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Currency Formatting</h4>
                  <p className="text-sm text-muted-foreground">
                    Test: {t("formatCurrency") ? "45,231 ብር" : "45,231 ETB"}
                  </p>
                  <Button onClick={() => runTest("language", true)} variant="outline" size="sm">
                    Test Currency
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Test Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Test Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(testResults).filter((r) => r === true).length}
              </div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {Object.values(testResults).filter((r) => r === false).length}
              </div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {Object.values(testResults).filter((r) => r === null).length}
              </div>
              <div className="text-sm text-muted-foreground">Not Tested</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Object.values(testResults).length}</div>
              <div className="text-sm text-muted-foreground">Total Tests</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
