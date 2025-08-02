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
}

export function BarcodeInput({
  value,
  onChange,
  label = "Barcode",
  placeholder = "Enter or scan barcode",
  disabled = false,
}: BarcodeInputProps) {
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [inputMode, setInputMode] = useState<"manual" | "scan">("manual")

  const handleScan = (barcode: string) => {
    onChange(barcode)
    setIsScannerOpen(false)
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="font-mono"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setIsScannerOpen(true)}
          disabled={disabled}
          title="Scan barcode with camera"
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      {value && <div className="text-xs text-muted-foreground font-mono">Barcode: {value}</div>}

      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScan}
        title="Scan Product Barcode"
      />
    </div>
  )
}
