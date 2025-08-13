"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Scan } from "lucide-react"

interface BarcodeInputProps {
  onScan: (barcode: string) => void
  placeholder?: string
  label?: string
}

export function BarcodeInput({ onScan, placeholder = "Enter or scan barcode", label = "Barcode" }: BarcodeInputProps) {
  const [barcode, setBarcode] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (barcode.trim()) {
      onScan(barcode.trim())
      setBarcode("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Label htmlFor="barcode-input">{label}</Label>
      <div className="flex gap-2">
        <Input
          id="barcode-input"
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!barcode.trim()}>
          <Scan className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
