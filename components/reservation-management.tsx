"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Calendar, Phone, Users, Clock, Filter } from "lucide-react"
import { tableManager } from "@/lib/table-management"
import type { Reservation } from "@/types/table"
import { format } from "date-fns"

export function ReservationManagement() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [todayReservations, setTodayReservations] = useState<Reservation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  useEffect(() => {
    setReservations(tableManager.getAllReservations())
    setTodayReservations(tableManager.getTodayReservations())
  }, [])

  const getStatusColor = (status: Reservation["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "seated":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no_show":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: Reservation["status"]) => {
    switch (status) {
      case "confirmed":
        return "ተረጋግጧል"
      case "pending":
        return "በመጠባበቅ ላይ"
      case "seated":
        return "ተቀምጧል"
      case "completed":
        return "ተጠናቋል"
      case "cancelled":
        return "ተሰርዟል"
      case "no_show":
        return "አልመጣም"
      default:
        return "ያልታወቀ"
    }
  }

  const getPriorityColor = (priority: Reservation["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-orange-100 text-orange-800"
      case "vip":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityText = (priority: Reservation["priority"]) => {
    switch (priority) {
      case "high":
        return "ከፍተኛ"
      case "vip":
        return "ቪአይፒ"
      default:
        return "መደበኛ"
    }
  }

  const handleStatusChange = (reservationId: string, newStatus: Reservation["status"]) => {
    if (tableManager.updateReservationStatus(reservationId, newStatus)) {
      setReservations(tableManager.getAllReservations())
      setTodayReservations(tableManager.getTodayReservations())
      if (selectedReservation?.id === reservationId) {
        setSelectedReservation(tableManager.getReservationById(reservationId) || null)
      }
    }
  }

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.customerPhone.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="በስም ወይም ስልክ ቁጥር ፈልግ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="ሁኔታ ምረጥ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ሁሉም ሁኔታዎች</SelectItem>
                <SelectItem value="confirmed">ተረጋግጧል</SelectItem>
                <SelectItem value="pending">በመጠባበቅ ላይ</SelectItem>
                <SelectItem value="seated">ተቀምጧል</SelectItem>
                <SelectItem value="completed">ተጠናቋል</SelectItem>
                <SelectItem value="cancelled">ተሰርዟል</SelectItem>
                <SelectItem value="no_show">አልመጣም</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">የዛሬ ቦታ ማስያዞች ({todayReservations.length})</TabsTrigger>
          <TabsTrigger value="all">ሁሉም ቦታ ማስያዞች ({filteredReservations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {todayReservations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">ዛሬ ምንም ቦታ ማስያዝ የለም</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {todayReservations.map((reservation) => (
                <Card key={reservation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold">{reservation.customerName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {reservation.customerPhone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {reservation.partySize} ሰዎች
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {reservation.reservationTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {reservation.priority !== "normal" && (
                          <Badge className={getPriorityColor(reservation.priority)}>
                            {getPriorityText(reservation.priority)}
                          </Badge>
                        )}
                        <Badge className={getStatusColor(reservation.status)}>
                          {getStatusText(reservation.status)}
                        </Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedReservation(reservation)}>
                              ዝርዝር
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>የቦታ ማስያዝ ዝርዝር</DialogTitle>
                            </DialogHeader>
                            {selectedReservation && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="font-medium">ደንበኛ</p>
                                    <p>{selectedReservation.customerName}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">ስልክ</p>
                                    <p>{selectedReservation.customerPhone}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">የሰዎች ቁጥር</p>
                                    <p>{selectedReservation.partySize}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">ጠረጴዛ</p>
                                    <p>{tableManager.getTableById(selectedReservation.tableId)?.number}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">ቀን</p>
                                    <p>{format(selectedReservation.reservationDate, "PPP")}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">ሰዓት</p>
                                    <p>{selectedReservation.reservationTime}</p>
                                  </div>
                                </div>

                                {selectedReservation.specialRequests && (
                                  <div>
                                    <p className="font-medium">ልዩ ጥያቄዎች</p>
                                    <p className="text-sm text-gray-600">{selectedReservation.specialRequests}</p>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <p className="font-medium">ሁኔታ ቀይር</p>
                                  <div className="grid grid-cols-2 gap-2">
                                    <Button
                                      size="sm"
                                      variant={selectedReservation.status === "confirmed" ? "default" : "outline"}
                                      onClick={() => handleStatusChange(selectedReservation.id, "confirmed")}
                                    >
                                      ተረጋግጧል
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant={selectedReservation.status === "seated" ? "default" : "outline"}
                                      onClick={() => handleStatusChange(selectedReservation.id, "seated")}
                                    >
                                      ተቀምጧል
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant={selectedReservation.status === "completed" ? "default" : "outline"}
                                      onClick={() => handleStatusChange(selectedReservation.id, "completed")}
                                    >
                                      ተጠናቋል
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant={selectedReservation.status === "cancelled" ? "default" : "outline"}
                                      onClick={() => handleStatusChange(selectedReservation.id, "cancelled")}
                                    >
                                      ተሰርዟል
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {filteredReservations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">ምንም ቦታ ማስያዝ አልተገኘም</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredReservations.map((reservation) => (
                <Card key={reservation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold">{reservation.customerName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(reservation.reservationDate, "MMM dd")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {reservation.reservationTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {reservation.partySize} ሰዎች
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {reservation.priority !== "normal" && (
                          <Badge className={getPriorityColor(reservation.priority)}>
                            {getPriorityText(reservation.priority)}
                          </Badge>
                        )}
                        <Badge className={getStatusColor(reservation.status)}>
                          {getStatusText(reservation.status)}
                        </Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedReservation(reservation)}>
                              ዝርዝር
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>የቦታ ማስያዝ ዝርዝር</DialogTitle>
                            </DialogHeader>
                            {selectedReservation && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="font-medium">ደንበኛ</p>
                                    <p>{selectedReservation.customerName}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">ስልክ</p>
                                    <p>{selectedReservation.customerPhone}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">የሰዎች ቁጥር</p>
                                    <p>{selectedReservation.partySize}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">ጠረጴዛ</p>
                                    <p>{tableManager.getTableById(selectedReservation.tableId)?.number}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">ቀን</p>
                                    <p>{format(selectedReservation.reservationDate, "PPP")}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">ሰዓት</p>
                                    <p>{selectedReservation.reservationTime}</p>
                                  </div>
                                </div>

                                {selectedReservation.specialRequests && (
                                  <div>
                                    <p className="font-medium">ልዩ ጥያቄዎች</p>
                                    <p className="text-sm text-gray-600">{selectedReservation.specialRequests}</p>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <p className="font-medium">ሁኔታ ቀይር</p>
                                  <div className="grid grid-cols-2 gap-2">
                                    <Button
                                      size="sm"
                                      variant={selectedReservation.status === "confirmed" ? "default" : "outline"}
                                      onClick={() => handleStatusChange(selectedReservation.id, "confirmed")}
                                    >
                                      ተረጋግጧል
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant={selectedReservation.status === "seated" ? "default" : "outline"}
                                      onClick={() => handleStatusChange(selectedReservation.id, "seated")}
                                    >
                                      ተቀምጧል
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant={selectedReservation.status === "completed" ? "default" : "outline"}
                                      onClick={() => handleStatusChange(selectedReservation.id, "completed")}
                                    >
                                      ተጠናቋል
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant={selectedReservation.status === "cancelled" ? "default" : "outline"}
                                      onClick={() => handleStatusChange(selectedReservation.id, "cancelled")}
                                    >
                                      ተሰርዟል
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
