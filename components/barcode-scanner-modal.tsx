"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { barcodeScanner, type BarcodeResult } from "@/lib/barcode-scanner"

interface BarcodeScannerModalProps {
  isOpen: boolean
  onClose: () => void
  onScan: (barcode: string) => void
  title?: string
}

export function BarcodeScannerModal({ isOpen, onClose, onScan, title = "Scan Barcode" }: BarcodeScannerModalProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastScanned, setLastScanned] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isOpen && videoRef.current) {
      initializeScanner()
    }

    return () => {
      barcodeScanner.destroy()
    }
  }, [isOpen])

  const initializeScanner = async () => {
    if (!videoRef.current) return

    setError(null)
    const success = await barcodeScanner.initialize(videoRef.current, handleBarcodeResult)

    if (success) {
      setIsScanning(true)
      barcodeScanner.startScanning()
    } else {
      setError("Failed to access camera. Please check permissions.")
    }
  }

  const handleBarcodeResult = (result: BarcodeResult) => {
    setLastScanned(result.text)
    onScan(result.text)

    // Auto-close after successful scan
    setTimeout(() => {
      handleClose()
    }, 1000)
  }

  const handleClose = () => {
    setIsScanning(false)
    barcodeScanner.destroy()
    setError(null)
    setLastScanned(null)
    onClose()
  }

  const toggleScanning = () => {
    if (isScanning) {
      barcodeScanner.stopScanning()
      setIsScanning(false)
    } else {
      barcodeScanner.startScanning()
      setIsScanning(true)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">{error}</div>
              <Button onClick={initializeScanner} variant="outline">
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />

                {/* Scanning overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-32 border-2 border-white rounded-lg relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-500"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-500"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-500"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-500"></div>

                    {isScanning && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-red-500 animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status indicator */}
                <div className="absolute top-4 left-4">
                  <Badge variant={isScanning ? "default" : "secondary"}>{isScanning ? "Scanning..." : "Paused"}</Badge>
                </div>
              </div>

              {lastScanned && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 mb-1">Scanned Successfully!</div>
                  <div className="font-mono text-lg">{lastScanned}</div>
                </div>
              )}

              <div className="text-center text-sm text-muted-foreground">
                Position the barcode within the frame to scan
              </div>

              <div className="flex gap-2 justify-center">
                <Button onClick={toggleScanning} variant="outline">
                  {isScanning ? "Pause" : "Resume"}
                </Button>
                <Button onClick={handleClose} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
