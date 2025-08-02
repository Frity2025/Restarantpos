"use client"

import { BarcodeTestSuite } from "@/components/barcode-test-suite"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TestTube, Info } from "lucide-react"

export default function TestBarcodePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Barcode Testing Suite</h1>
          <p className="text-muted-foreground">Test and validate barcode scanning functionality</p>
        </div>
        <TestTube className="h-8 w-8 text-blue-600" />
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This comprehensive testing suite allows you to validate barcode generation, parsing, and scanning
          functionality. Use the sample products provided or test with custom barcodes.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Automated Tests</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>
                  • <strong>Validation Tests:</strong> Check if generated barcodes are valid
                </li>
                <li>
                  • <strong>Parsing Tests:</strong> Verify barcode type detection
                </li>
                <li>
                  • <strong>Generation Tests:</strong> Test barcode creation for different categories
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Manual Tests</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>
                  • <strong>Live Scan:</strong> Use camera to scan physical barcodes
                </li>
                <li>
                  • <strong>Custom Test:</strong> Enter any barcode for validation
                </li>
                <li>
                  • <strong>Sample Data:</strong> Test with provided sample products
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <BarcodeTestSuite />
    </div>
  )
}
