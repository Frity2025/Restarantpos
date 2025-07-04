"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Eye, RefreshCw, Filter, RotateCcw } from "lucide-react"
import { paymentService } from "@/lib/payment-processing"
import type { Payment, PaymentFilter, PaymentMethod, PaymentStatus } from "@/types/payment"

const statusNames = {
  pending: "በመጠባበቅ ላይ",
  processing: "በሂደት ላይ",
  completed: "ተጠናቋል",
  failed: "አልተሳካም",
  refunded: "ተመልሷል",
  cancelled: "ተሰርዟል",
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-purple-100 text-purple-800",
  cancelled: "bg-gray-100 text-gray-800",
}

const methodNames = {
  cash: "ጥሬ ገንዘብ",
  card: "ካርድ",
  mobile_money: "የሞባይል ገንዘብ",
  bank_transfer: "የባንክ ዝውውር",
  credit: "ክሬዲት",
  voucher: "ቫውቸር",
}

export function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [filter, setFilter] = useState<PaymentFilter>({})
  const [showFilters, setShowFilters] = useState(false)
  const [isRefunding, setIsRefunding] = useState(false)

  useEffect(() => {
    loadPayments()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [payments, searchTerm, filter])

  const loadPayments = () => {
    const allPayments = paymentService.getAllPayments()
    setPayments(allPayments)
  }

  const applyFilters = () => {
    let filtered = paymentService.getFilteredPayments(filter)

    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredPayments(filtered)
  }

  const handleRefund = async (payment: Payment) => {
    if (!payment || payment.status !== "completed") return

    const reason = prompt("የመመለሻ ምክንያት ያስገቡ:")
    if (!reason) return

    setIsRefunding(true)
    try {
      const response = await paymentService.processRefund({
        paymentId: payment.id,
        amount: payment.amount,
        reason,
        employeeId: "current-employee", // Should come from auth context
        employeeName: "Current Employee",
      })

      if (response.success) {
        alert("መመለሻ በተሳካ ሁኔታ ተጠናቋል")
        loadPayments()
      } else {
        alert(`መመለሻ አልተሳካም: ${response.message}`)
      }
    } catch (error) {
      alert("የመመለሻ ሂደት ስህተት ተፈጥሯል")
    } finally {
      setIsRefunding(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ብር`
  }

  const formatTime = (date: Date) => {
    return date.toLocaleString("am-ET", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">የክፍያ ታሪክ</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            ማጣሪያ
          </Button>
          <Button onClick={loadPayments}>
            <RefreshCw className="mr-2 h-4 w-4" />
            አድስ
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="ክፍያ ፈልግ (ደረሰኝ ቁጥር፣ ደንበኛ፣ ግብይት ቁጥር)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">ሁኔታ</label>
                  <Select
                    value={filter.status?.[0] || "all"}
                    onValueChange={(value) =>
                      setFilter({ ...filter, status: value === "all" ? [] : [value as PaymentStatus] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="ሁሉም ሁኔታዎች" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ሁሉም ሁኔታዎች</SelectItem>
                      {Object.entries(statusNames).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">የክፍያ ዘዴ</label>
                  <Select
                    value={filter.method?.[0] || "all"}
                    onValueChange={(value) =>
                      setFilter({ ...filter, method: value === "all" ? [] : [value as PaymentMethod] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="ሁሉም ዘዴዎች" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ሁሉም ዘዴዎች</SelectItem>
                      {Object.entries(methodNames).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">ከቀን</label>
                  <Input
                    type="date"
                    value={filter.dateFrom?.toISOString().split("T")[0] || ""}
                    onChange={(e) =>
                      setFilter({ ...filter, dateFrom: e.target.value ? new Date(e.target.value) : undefined })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">እስከ ቀን</label>
                  <Input
                    type="date"
                    value={filter.dateTo?.toISOString().split("T")[0] || ""}
                    onChange={(e) =>
                      setFilter({ ...filter, dateTo: e.target.value ? new Date(e.target.value) : undefined })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>ክፍያዎች ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ደረሰኝ ቁጥር</TableHead>
                <TableHead>ደንበኛ</TableHead>
                <TableHead>መጠን</TableHead>
                <TableHead>ዘዴ</TableHead>
                <TableHead>ሁኔታ</TableHead>
                <TableHead>ጊዜ</TableHead>
                <TableHead>ተግባሮች</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.receiptNumber}</TableCell>
                  <TableCell>{payment.customerName || "ያልተሰየመ"}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{methodNames[payment.method]}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[payment.status]}>{statusNames[payment.status]}</Badge>
                  </TableCell>
                  <TableCell>{formatTime(payment.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedPayment(payment)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>የክፍያ ዝርዝር - {payment.receiptNumber}</DialogTitle>
                          </DialogHeader>
                          {selectedPayment && <PaymentDetails payment={selectedPayment} />}
                        </DialogContent>
                      </Dialog>

                      {payment.status === "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRefund(payment)}
                          disabled={isRefunding}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">ምንም ክፍያ አልተገኘም</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Payment Details Component
function PaymentDetails({ payment }: { payment: Payment }) {
  return (
    <div className="space-y-6">
      {/* Payment Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">የክፍያ መረጃ</h4>
          <div className="space-y-2 text-sm">
            <p>ደረሰኝ ቁጥር: {payment.receiptNumber}</p>
            <p>ትዕዛዝ ቁጥር: {payment.orderId}</p>
            <p>መጠን: {payment.amount.toFixed(2)} ብር</p>
            <p>ዘዴ: {methodNames[payment.method]}</p>
            {payment.provider && <p>አቅራቢ: {payment.provider}</p>}
            <p>
              ሁኔታ: <Badge className={statusColors[payment.status]}>{statusNames[payment.status]}</Badge>
            </p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">ተጨማሪ መረጃ</h4>
          <div className="space-y-2 text-sm">
            <p>ደንበኛ: {payment.customerName || "ያልተሰየመ"}</p>
            <p>ሰራተኛ: {payment.employeeName}</p>
            <p>የተፈጠረበት ጊዜ: {payment.createdAt.toLocaleString("am-ET")}</p>
            {payment.completedAt && <p>የተጠናቀቀበት ጊዜ: {payment.completedAt.toLocaleString("am-ET")}</p>}
            {payment.transactionId && <p>ግብይት ቁጥር: {payment.transactionId}</p>}
            {payment.reference && <p>ማጣቀሻ: {payment.reference}</p>}
          </div>
        </div>
      </div>

      {/* Notes */}
      {payment.notes && (
        <div>
          <h4 className="font-semibold mb-2">ማስታወሻዎች</h4>
          <p className="text-sm bg-gray-50 p-2 rounded">{payment.notes}</p>
        </div>
      )}

      {/* Metadata */}
      {payment.metadata && Object.keys(payment.metadata).length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">ተጨማሪ ዝርዝሮች</h4>
          <div className="text-sm bg-gray-50 p-2 rounded">
            {Object.entries(payment.metadata).map(([key, value]) => (
              <p key={key}>
                {key}: {String(value)}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
