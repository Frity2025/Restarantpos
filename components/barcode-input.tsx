"use client"

import { useState } from "react"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarcodeScannerModal } from "./barcode-scanner-modal"

interface BarcodeInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function BarcodeInput({
  value,
  onChange,
  label = "Barcode",
  placeholder = "Enter or scan barcode",
  disabled = false,
  className = "",
}: BarcodeInputProps) {
  const [isScannerOpen, setIsScannerOpen] = useState(false)

  const handleScan = (barcode: string) => {
    onChange(barcode)
    setIsScannerOpen(false)
  }

  return (
    <div className={className}>
      {label && <Label htmlFor="barcode-input">{label}</Label>}
      <div className="flex gap-2">
        <Input
          id="barcode-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="font-mono"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setIsScannerOpen(true)}
          disabled={disabled}
          className="bg-transparent"
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScan}
        title="Scan Barcode"
      />
    </div>
  )
}
