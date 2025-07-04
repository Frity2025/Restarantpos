"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, RefreshCw, Filter, Calendar, Phone, Users, Mail, Clock } from "lucide-react"
import { tableManager } from "@/lib/table-management"
import type { Reservation, ReservationStatus, ReservationFilter } from "@/types/table"

const statusNames: Record<ReservationStatus, string> = {
  pending: "በመጠባበቅ ላይ",
  confirmed: "ተረጋግጧል",
  seated: "ተቀምጧል",
  completed: "ተጠናቋል",
  cancelled: "ተሰርዟል",
  no_show: "አልመጣም",
}

const statusColors: Record<ReservationStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  seated: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-orange-100 text-orange-800",
}

export function ReservationManagement() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [filter, setFilter] = useState<ReservationFilter>({
    status: [],
    date: new Date(),
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadReservations()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [reservations, searchTerm, filter])

  const loadReservations = () => {
    const allReservations = tableManager.getAllReservations()
    setReservations(allReservations)
  }

  const applyFilters = () => {
    let filtered = tableManager.getFilteredReservations(filter)

    if (searchTerm) {
      filtered = filtered.filter(
        (reservation) =>
          reservation.reservationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.customerPhone.includes(searchTerm),
      )
    }

    setFilteredReservations(filtered)
  }

  const handleStatusChange = (reservationId: string, newStatus: ReservationStatus) => {
    tableManager.updateReservationStatus(reservationId, newStatus)
    loadReservations()
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

  const getTodayReservations = () => {
    const today = new Date().toDateString()
    return reservations.filter((res) => res.reservationDate.toDateString() === today)
  }

  const getUpcomingReservations = () => {
    const now = new Date()
    const today = now.toDateString()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    return reservations
      .filter((res) => {
        if (res.reservationDate.toDateString() === today) {
          const [hours, minutes] = res.reservationTime.split(":")
          const resTime = Number.parseInt(hours) * 60 + Number.parseInt(minutes)
          return resTime > currentTime && (res.status === "confirmed" || res.status === "pending")
        }
        return res.reservationDate > now && (res.status === "confirmed" || res.status === "pending")
      })
      .slice(0, 5)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">የቦታ ማስያዝ አስተዳደር</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            ማጣሪያ
          </Button>
          <Button onClick={loadReservations}>
            <RefreshCw className="mr-2 h-4 w-4" />
            አድስ
          </Button>
        </div>
      </div>

      {/* ዛሬ እና ቀጣይ ቦታ ማስያዞች */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              ዛሬ ቦታ ማስያዞች ({getTodayReservations().length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getTodayReservations()
                .slice(0, 5)
                .map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{reservation.customerName}</p>
                      <p className="text-sm text-gray-600">
                        {reservation.reservationTime} - {reservation.partySize} ሰዎች
                      </p>
                    </div>
                    <Badge className={statusColors[reservation.status]}>{statusNames[reservation.status]}</Badge>
                  </div>
                ))}
              {getTodayReservations().length === 0 && <p className="text-gray-500 text-center py-4">ዛሬ ቦታ ማስያዝ የለም</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ቀጣይ ቦታ ማስያዞች</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getUpcomingReservations().map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{reservation.customerName}</p>
                    <p className="text-sm text-gray-600">
                      {reservation.reservationDate.toLocaleDateString("am-ET")} {reservation.reservationTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{reservation.partySize} ሰዎች</p>
                    <Badge className={statusColors[reservation.status]} className="text-xs">
                      {statusNames[reservation.status]}
                    </Badge>
                  </div>
                </div>
              ))}
              {getUpcomingReservations().length === 0 && (
                <p className="text-gray-500 text-center py-4">ቀጣይ ቦታ ማስያዝ የለም</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ፍለጋ እና ማጣሪያ */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="ቦታ ማስያዝ ፈልግ (ቁጥር፣ ደንበኛ፣ ስልክ)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">ሁኔታ</label>
                  <Select
                    value={filter.status?.[0] || "all"}
                    onValueChange={(value) =>
                      setFilter({ ...filter, status: value === "all" ? [] : [value as ReservationStatus] })
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
                  <label className="text-sm font-medium mb-2 block">ቀን</label>
                  <Input
                    type="date"
                    value={filter.date?.toISOString().split("T")[0] || ""}
                    onChange={(e) =>
                      setFilter({ ...filter, date: e.target.value ? new Date(e.target.value) : undefined })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">የሰዎች ብዛት</label>
                  <Select
                    value={filter.partySize?.toString() || "all"}
                    onValueChange={(value) =>
                      setFilter({ ...filter, partySize: value === "all" ? undefined : Number.parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="ሁሉም" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ሁሉም</SelectItem>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} {size === 1 ? "ሰው" : "ሰዎች"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* የቦታ ማስያዝ ዝርዝር */}
      <Card>
        <CardHeader>
          <CardTitle>ቦታ ማስያዞች ({filteredReservations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ቁጥር</TableHead>
                <TableHead>ደንበኛ</TableHead>
                <TableHead>ስልክ</TableHead>
                <TableHead>ቀን</TableHead>
                <TableHead>ጊዜ</TableHead>
                <TableHead>ሰዎች</TableHead>
                <TableHead>ጠረጴዛ</TableHead>
                <TableHead>ሁኔታ</TableHead>
                <TableHead>ተግባሮች</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">{reservation.reservationNumber}</TableCell>
                  <TableCell>{reservation.customerName}</TableCell>
                  <TableCell>{reservation.customerPhone}</TableCell>
                  <TableCell>{reservation.reservationDate.toLocaleDateString("am-ET")}</TableCell>
                  <TableCell>{reservation.reservationTime}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {reservation.partySize}
                    </div>
                  </TableCell>
                  <TableCell>{reservation.tableNumber || "-"}</TableCell>
                  <TableCell>
                    <Select
                      value={reservation.status}
                      onValueChange={(value) => handleStatusChange(reservation.id, value as ReservationStatus)}
                    >
                      <SelectTrigger className="w-32">
                        <Badge className={statusColors[reservation.status]}>{statusNames[reservation.status]}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusNames).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => setSelectedReservation(reservation)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredReservations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">ምንም ቦታ ማስያዝ አልተገኘም</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* የቦታ ማስያዝ ዝርዝር ሞዳል */}
      {selectedReservation && (
        <ReservationDetailsModal
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}

// የቦታ ማስያዝ ዝርዝር ሞዳል
function ReservationDetailsModal({
  reservation,
  onClose,
  onStatusChange,
}: {
  reservation: Reservation
  onClose: () => void
  onStatusChange: (id: string, status: ReservationStatus) => void
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>ቦታ ማስያዝ ዝርዝር - {reservation.reservationNumber}</CardTitle>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* የደንበኛ መረጃ */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">የደንበኛ መረጃ</h4>
              <div className="space-y-2">
                <p>
                  <strong>ስም:</strong> {reservation.customerName}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {reservation.customerPhone}
                </p>
                {reservation.customerEmail && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {reservation.customerEmail}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">የቦታ ማስያዝ መረጃ</h4>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {reservation.reservationDate.toLocaleDateString("am-ET")}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {reservation.reservationTime}
                </p>
                <p className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {reservation.partySize} ሰዎች
                </p>
                <p>
                  <strong>ቆይታ:</strong> {reservation.duration} ደቂቃ
                </p>
              </div>
            </div>
          </div>

          {/* ሁኔታ እና ጠረጴዛ */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">ሁኔታ</h4>
              <Badge className={statusColors[reservation.status]}>{statusNames[reservation.status]}</Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-2">ጠረጴዛ</h4>
              <p>{reservation.tableNumber ? `ጠረጴዛ ${reservation.tableNumber}` : "አልተመደበም"}</p>
            </div>
          </div>

          {/* ልዩ ጥያቄዎች እና ማስታወሻዎች */}
          {(reservation.specialRequests || reservation.notes) && (
            <div>
              <h4 className="font-semibold mb-2">ማስታወሻዎች</h4>
              {reservation.specialRequests && (
                <p className="text-sm bg-blue-50 p-2 rounded mb-2">
                  <strong>ልዩ ጥያቄዎች:</strong> {reservation.specialRequests}
                </p>
              )}
              {reservation.notes && (
                <p className="text-sm bg-gray-50 p-2 rounded">
                  <strong>ማስታወሻ:</strong> {reservation.notes}
                </p>
              )}
            </div>
          )}

          {/* የጊዜ መረጃ */}
          <div>
            <h4 className="font-semibold mb-2">የጊዜ መረጃ</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                <strong>ተፈጠረ:</strong> {reservation.createdAt.toLocaleString("am-ET")}
              </p>
              <p>
                <strong>ተዘመነ:</strong> {reservation.updatedAt.toLocaleString("am-ET")}
              </p>
              {reservation.seatedAt && (
                <p>
                  <strong>ተቀመጠ:</strong> {reservation.seatedAt.toLocaleString("am-ET")}
                </p>
              )}
              {reservation.completedAt && (
                <p>
                  <strong>ተጠናቀቀ:</strong> {reservation.completedAt.toLocaleString("am-ET")}
                </p>
              )}
            </div>
          </div>

          {/* ሰራተኛ መረጃ */}
          <div>
            <h4 className="font-semibold mb-2">ሰራተኛ</h4>
            <p>{reservation.employeeName}</p>
          </div>

          {/* ሁኔታ ቀይር */}
          <div>
            <h4 className="font-semibold mb-2">ሁኔታ ቀይር</h4>
            <div className="grid grid-cols-3 gap-2">
              <Button
                size="sm"
                variant="outline"
                className="bg-blue-50 hover:bg-blue-100"
                onClick={() => {
                  onStatusChange(reservation.id, "confirmed")
                  onClose()
                }}
              >
                አረጋግጥ
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-green-50 hover:bg-green-100"
                onClick={() => {
                  onStatusChange(reservation.id, "seated")
                  onClose()
                }}
              >
                ተቀመጠ
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-gray-50 hover:bg-gray-100"
                onClick={() => {
                  onStatusChange(reservation.id, "completed")
                  onClose()
                }}
              >
                ተጠናቀቀ
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-red-50 hover:bg-red-100"
                onClick={() => {
                  onStatusChange(reservation.id, "cancelled")
                  onClose()
                }}
              >
                ሰርዝ
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-orange-50 hover:bg-orange-100"
                onClick={() => {
                  onStatusChange(reservation.id, "no_show")
                  onClose()
                }}
              >
                አልመጣም
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
