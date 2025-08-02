"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, AlertTriangle, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { inventoryService } from "@/lib/inventory-management"
import { autoReorderService } from "@/lib/auto-reorder-service"
import type { InventoryItem, InventoryCategory, LowStockAlert } from "@/types/inventory"
import Link from "next/link"

export function InventoryManagement() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [categories, setCategories] = useState<InventoryCategory[]>([])
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([])
  const [reorderAlerts, setReorderAlerts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [isStockUpdateOpen, setIsStockUpdateOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setInventoryItems(inventoryService.getAllInventoryItems())
    setCategories(inventoryService.getAllCategories())
    setLowStockAlerts(inventoryService.getLowStockAlerts())
    setReorderAlerts(autoReorderService.getPendingReorderAlerts())
  }

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.nameAmharic.includes(searchTerm)
    const matchesCategory = selectedCategory === "all" || item.category.id === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) return { status: "ከክምችት ውጭ", color: "destructive" }
    if (item.currentStock <= item.minStockLevel * 0.5) return { status: "በጣም ዝቅተኛ", color: "destructive" }
    if (item.currentStock <= item.minStockLevel) return { status: "ዝቅተኛ", color: "secondary" }
    return { status: "በቂ", color: "default" }
  }

  const handleStockUpdate = (item: InventoryItem, type: "in" | "out", quantity: number, reason: string) => {
    inventoryService.updateStock(item.id, quantity, type, reason, "Current User")
    loadData()
    setIsStockUpdateOpen(false)
    setSelectedItem(null)
  }

  const handleRunReorderCheck = () => {
    const newAlerts = autoReorderService.checkInventoryLevels()
    loadData()

    if (newAlerts.length > 0) {
      alert(`${newAlerts.length} አዲስ የመሙላት ማሳሰቢያዎች ተፈጥረዋል!`)
    } else {
      alert("ምንም አዲስ የመሙላት ማሳሰቢያ አልተገኘም።")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">የእቃ ክምችት አስተዳደር</h1>
          <p className="text-muted-foreground">የምግብ ቤት እቃዎች እና ቁሳቁሶች ክትትል</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRunReorderCheck} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            መሙላት ፈትሽ
          </Button>
          <Link href="/auto-reorder">
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              አውቶ መሙላት
            </Button>
          </Link>
          <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                አዲስ እቃ ጨምር
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>አዲስ እቃ ጨምር</DialogTitle>
                <DialogDescription>አዲስ የክምችት እቃ ወደ ስርዓቱ ጨምር</DialogDescription>
              </DialogHeader>
              <AddItemForm
                onSuccess={() => {
                  loadData()
                  setIsAddItemOpen(false)
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Alerts */}
      {(lowStockAlerts.length > 0 || reorderAlerts.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lowStockAlerts.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  የክምችት ማሳሰቢያዎች ({lowStockAlerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockAlerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div>
                        <span className="font-medium">{alert.itemName}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ወቅታዊ: {alert.currentStock} | ዝቅተኛ: {alert.minStockLevel}
                        </span>
                      </div>
                      <Badge variant={alert.severity === "out_of_stock" ? "destructive" : "secondary"}>
                        {alert.severity === "out_of_stock"
                          ? "ከክምችት ውጭ"
                          : alert.severity === "critical"
                            ? "በጣም ዝቅተኛ"
                            : "ዝቅተኛ"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {reorderAlerts.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <RefreshCw className="mr-2 h-5 w-5" />
                  የመሙላት ማሳሰቢያዎች ({reorderAlerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {reorderAlerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div>
                        <span className="font-medium">{alert.itemNameAmharic}</span>
                        <span className="text-sm text-muted-foreground ml-2">መሙላት: {alert.reorderQuantity}</span>
                      </div>
                      <Badge variant={alert.priority === "critical" ? "destructive" : "secondary"}>
                        {alert.priority === "critical" ? "አስቸኳይ" : alert.priority === "high" ? "ከፍተኛ" : "መካከለኛ"}
                      </Badge>
                    </div>
                  ))}
                  <Link href="/auto-reorder">
                    <Button size="sm" className="w-full mt-2">
                      ሁሉንም ይመልከቱ
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="እቃ ፈልግ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="ምድብ ምረጥ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ሁሉም ምድቦች</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.nameAmharic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>የክምችት እቃዎች ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>እቃ</TableHead>
                <TableHead>ምድብ</TableHead>
                <TableHead>ወቅታዊ ክምችት</TableHead>
                <TableHead>ዝቅተኛ ደረጃ</TableHead>
                <TableHead>ሁኔታ</TableHead>
                <TableHead>ዋጋ</TableHead>
                <TableHead>ድርጊቶች</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const stockStatus = getStockStatus(item)
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.nameAmharic}</div>
                        <div className="text-sm text-muted-foreground">{item.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" style={{ borderColor: item.category.color }}>
                        {item.category.nameAmharic}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{item.currentStock}</span>
                      <span className="text-sm text-muted-foreground ml-1">{item.unit}</span>
                    </TableCell>
                    <TableCell>
                      {item.minStockLevel} {item.unit}
                    </TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.color as any}>{stockStatus.status}</Badge>
                    </TableCell>
                    <TableCell>{item.unitPrice.toFixed(2)} ብር</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedItem(item)
                            setIsStockUpdateOpen(true)
                          }}
                        >
                          ክምችት ዘምን
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stock Update Dialog */}
      <Dialog open={isStockUpdateOpen} onOpenChange={setIsStockUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ክምችት ዘምን</DialogTitle>
            <DialogDescription>{selectedItem?.nameAmharic} ክምችት ዘምን</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <StockUpdateForm
              item={selectedItem}
              onUpdate={handleStockUpdate}
              onCancel={() => {
                setIsStockUpdateOpen(false)
                setSelectedItem(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AddItemForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    nameAmharic: "",
    categoryId: "",
    currentStock: 0,
    minStockLevel: 0,
    maxStockLevel: 0,
    unit: "",
    unitPrice: 0,
    supplierId: "",
    location: "",
    description: "",
  })

  const categories = inventoryService.getAllCategories()
  const suppliers = inventoryService.getAllSuppliers()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const category = categories.find((c) => c.id === formData.categoryId)
    const supplier = suppliers.find((s) => s.id === formData.supplierId)

    if (!category || !supplier) return

    const newItem = inventoryService.addInventoryItem({
      name: formData.name,
      nameAmharic: formData.nameAmharic,
      category,
      currentStock: formData.currentStock,
      minStockLevel: formData.minStockLevel,
      maxStockLevel: formData.maxStockLevel,
      unit: formData.unit,
      unitPrice: formData.unitPrice,
      supplierId: formData.supplierId,
      supplierName: supplier.name,
      lastRestocked: new Date(),
      location: formData.location,
      description: formData.description,
      isActive: true,
    })

    // Create automatic reorder rule for new item
    autoReorderService.createReorderRule({
      inventoryItemId: newItem.id,
      itemName: newItem.name,
      itemNameAmharic: newItem.nameAmharic,
      reorderPoint: Math.max(formData.minStockLevel, Math.floor(formData.currentStock * 0.3)),
      reorderQuantity: Math.floor((formData.maxStockLevel - formData.minStockLevel) * 0.8),
      maxStockLevel: formData.maxStockLevel,
      preferredSupplierId: formData.supplierId,
      preferredSupplierName: supplier.name,
      isActive: true,
      autoOrder: false, // Default to manual approval
      leadTimeDays: 7, // Default lead time
    })

    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">እቃ ስም (English)</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="nameAmharic">እቃ ስም (አማርኛ)</Label>
          <Input
            id="nameAmharic"
            value={formData.nameAmharic}
            onChange={(e) => setFormData((prev) => ({ ...prev, nameAmharic: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">ምድብ</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="ምድብ ምረጥ" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.nameAmharic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="supplier">አቅራቢ</Label>
          <Select
            value={formData.supplierId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, supplierId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="አቅራቢ ምረጥ" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.nameAmharic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="currentStock">ወቅታዊ ክምችት</Label>
          <Input
            id="currentStock"
            type="number"
            value={formData.currentStock}
            onChange={(e) => setFormData((prev) => ({ ...prev, currentStock: Number(e.target.value) }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="minStock">ዝቅተኛ ደረጃ</Label>
          <Input
            id="minStock"
            type="number"
            value={formData.minStockLevel}
            onChange={(e) => setFormData((prev) => ({ ...prev, minStockLevel: Number(e.target.value) }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="maxStock">ከፍተኛ ደረጃ</Label>
          <Input
            id="maxStock"
            type="number"
            value={formData.maxStockLevel}
            onChange={(e) => setFormData((prev) => ({ ...prev, maxStockLevel: Number(e.target.value) }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="unit">መለኪያ ክፍል</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
            placeholder="ኪ.ግ, ሊትር, ቁጥር..."
            required
          />
        </div>
        <div>
          <Label htmlFor="unitPrice">የአንድ ክፍል ዋጋ</Label>
          <Input
            id="unitPrice"
            type="number"
            step="0.01"
            value={formData.unitPrice}
            onChange={(e) => setFormData((prev) => ({ ...prev, unitPrice: Number(e.target.value) }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="location">የማከማቻ ቦታ</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">መግለጫ</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => onSuccess()}>
          ሰርዝ
        </Button>
        <Button type="submit">እቃ ጨምር</Button>
      </div>
    </form>
  )
}

function StockUpdateForm({
  item,
  onUpdate,
  onCancel,
}: {
  item: InventoryItem
  onUpdate: (item: InventoryItem, type: "in" | "out", quantity: number, reason: string) => void
  onCancel: () => void
}) {
  const [type, setType] = useState<"in" | "out">("in")
  const [quantity, setQuantity] = useState(0)
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (quantity > 0 && reason.trim()) {
      onUpdate(item, type, quantity, reason)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium">{item.nameAmharic}</h3>
        <p className="text-sm text-muted-foreground">
          ወቅታዊ ክምችት: {item.currentStock} {item.unit}
        </p>
      </div>

      <div>
        <Label>ድርጊት አይነት</Label>
        <Select value={type} onValueChange={(value: "in" | "out") => setType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in">
              <div className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
                ክምችት ጨምር
              </div>
            </SelectItem>
            <SelectItem value="out">
              <div className="flex items-center">
                <TrendingDown className="mr-2 h-4 w-4 text-red-600" />
                ክምችት ቀንስ
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="quantity">መጠን</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
      </div>

      <div>
        <Label htmlFor="reason">ምክንያት</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="የክምችት ለውጥ ምክንያት ግለጽ..."
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          ሰርዝ
        </Button>
        <Button type="submit">ክምችት ዘምን</Button>
      </div>
    </form>
  )
}
