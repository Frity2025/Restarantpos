"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Star, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { inventoryService } from "@/lib/inventory-management"
import type { Supplier } from "@/types/inventory"
import { ProtectedRoute } from "@/components/protected-route"

export default function SuppliersPage() {
  return (
    <ProtectedRoute requiredPermissions={["manage_suppliers"]}>
      <div className="container mx-auto py-6">
        <SuppliersManagement />
      </div>
    </ProtectedRoute>
  )
}

function SuppliersManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false)

  useEffect(() => {
    setSuppliers(inventoryService.getAllSuppliers())
  }, [])

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.nameAmharic.includes(searchTerm) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSupplier = (supplierData: any) => {
    inventoryService.addSupplier(supplierData)
    setSuppliers(inventoryService.getAllSuppliers())
    setIsAddSupplierOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">አቅራቢዎች አስተዳደር</h1>
          <p className="text-muted-foreground">የምግብ ቤት አቅራቢዎች እና አጋሮች ክትትል</p>
        </div>
        <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              አዲስ አቅራቢ ጨምር
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>አዲስ አቅራቢ ጨምር</DialogTitle>
              <DialogDescription>አዲስ አቅራቢ ወደ ስርዓቱ ጨምር</DialogDescription>
            </DialogHeader>
            <AddSupplierForm onSuccess={handleAddSupplier} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="አቅራቢ ፈልግ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{supplier.nameAmharic}</CardTitle>
                  <CardDescription>{supplier.name}</CardDescription>
                </div>
                <Badge variant={supplier.isActive ? "default" : "secondary"}>{supplier.isActive ? "ንቁ" : "ቦዝ"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{supplier.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">ደረጃ</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.phone}</span>
                </div>
                {supplier.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{supplier.email}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.address}</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">የመክፈያ ጊዜ:</span>
                  <span className="font-medium">{supplier.paymentTerms}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ተገናኝ:</span>
                  <span className="font-medium">{supplier.contactPerson}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  ዝርዝር
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  ትዕዛዝ ፍጠር
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">ምንም አቅራቢ አልተገኘም</p>
        </div>
      )}
    </div>
  )
}

function AddSupplierForm({ onSuccess }: { onSuccess: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    nameAmharic: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    paymentTerms: "30 days",
    rating: 5,
    isActive: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSuccess(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">ኩባንያ ስም (English)</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="nameAmharic">ኩባንያ ስም (አማርኛ)</Label>
          <Input
            id="nameAmharic"
            value={formData.nameAmharic}
            onChange={(e) => setFormData((prev) => ({ ...prev, nameAmharic: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="contactPerson">የመገናኛ ሰው</Label>
        <Input
          id="contactPerson"
          value={formData.contactPerson}
          onChange={(e) => setFormData((prev) => ({ ...prev, contactPerson: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">ስልክ ቁጥር</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">ኢሜይል</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">አድራሻ</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="paymentTerms">የመክፈያ ጊዜ</Label>
        <Select
          value={formData.paymentTerms}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentTerms: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15 days">15 ቀናት</SelectItem>
            <SelectItem value="30 days">30 ቀናት</SelectItem>
            <SelectItem value="45 days">45 ቀናት</SelectItem>
            <SelectItem value="60 days">60 ቀናት</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => onSuccess(formData)}>
          ሰርዝ
        </Button>
        <Button type="submit">አቅራቢ ጨምር</Button>
      </div>
    </form>
  )
}
