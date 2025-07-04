"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users } from "lucide-react"
import { tableManager } from "@/lib/table-management"
import { useAuth } from "@/contexts/auth-context"
import type { Table, TimeSlot } from "@/types/table"

export function ReservationBooking() {
  const { employee } = useAuth()
  const [step, setStep] = useState(1)
  const [reservationData, setReservationData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    partySize: 2,
    reservationDate: "",
    reservationTime: "",
    duration: 90,
    specialRequests: "",
    notes: "",
  })
  const [availableTables, setAvailableTables] = useState<Table[]>([])
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDateChange = (date: string) => {
    setReservationData({ ...reservationData, reservationDate: date })
    if (date && reservationData.partySize) {
      const selectedDate = new Date(date)
      const slots = tableManager.getTimeSlots(selectedDate, reservationData.partySize)
      setTimeSlots(slots)
    }
  }

  const handleTimeChange = (time: string) => {
    setReservationData({ ...reservationData, reservationTime: time })
    if (reservationData.reservationDate && time) {
      const selectedDate = new Date(reservationData.reservationDate)
      const tables = tableManager.getAvailableTables(reservationData.partySize, selectedDate, time)
      setAvailableTables(tables)
    }
  }

  const handlePartySizeChange = (size: number) => {
    setReservationData({ ...reservationData, partySize: size })
    if (reservationData.reservationDate) {
      const selectedDate = new Date(reservationData.reservationDate)
      const slots = tableManager.getTimeSlots(selectedDate, size)
      setTimeSlots(slots)

      if (reservationData.reservationTime) {
        const tables = tableManager.getAvailableTables(size, selectedDate, reservationData.reservationTime)
        setAvailableTables(tables)
      }
    }
  }

  const handleSubmit = async () => {
    if (!employee) return

    setIsSubmitting(true)
    try {
      const newReservation = tableManager.createReservation({
        ...reservationData,
        reservationDate: new Date(reservationData.reservationDate),
        tableId: selectedTable || undefined,
        employeeId: employee.id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
      })

      alert(`ቦታ ማስያዝ ${newReservation.reservationNumber} በተሳካ ሁኔታ ተፈጠረ!`)

      // ፎርም ማጽዳት
      setReservationData({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        partySize: 2,
        reservationDate: "",
        reservationTime: "",
        duration: 90,
        specialRequests: "",
        notes: "",
      })
      setSelectedTable("")
      setStep(1)
    } catch (error) {
      alert("ቦታ ማስያዝ መፍጠር አልተሳካም")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceedToStep2 =
    reservationData.customerName && reservationData.customerPhone && reservationData.partySize > 0

  const canProceedToStep3 = reservationData.reservationDate && reservationData.reservationTime

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            አዲስ ቦታ ማስያዝ
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-green-600" : "text-gray-400"}`}>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                1
              </div>
              <span>የደንበኛ መረጃ</span>
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-green-600" : "text-gray-400"}`}>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                2
              </div>
              <span>ቀን እና ጊዜ</span>
            </div>
            <div className={`flex items-center gap-2 ${step >= 3 ? "text-green-600" : "text-gray-400"}`}>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                3
              </div>
              <span>ጠረጴዛ ምርጫ</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">የደንበኛ መረጃ</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">የደንበኛ ስም *</Label>
                  <Input
                    id="customerName"
                    value={reservationData.customerName}
                    onChange={(e) => setReservationData({ ...reservationData, customerName: e.target.value })}
                    placeholder="ሙሉ ስም ያስገቡ"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">ስልክ ቁጥር *</Label>
                  <Input
                    id="customerPhone"
                    value={reservationData.customerPhone}
                    onChange={(e) => setReservationData({ ...reservationData, customerPhone: e.target.value })}
                    placeholder="+251911123456"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="customerEmail">ኢሜይል</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={reservationData.customerEmail}
                  onChange={(e) => setReservationData({ ...reservationData, customerEmail: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="partySize">የሰዎች ብዛት *</Label>
                <Select
                  value={reservationData.partySize.toString()}
                  onValueChange={(value) => handlePartySizeChange(Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size} {size === 1 ? "ሰው" : "ሰዎች"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="specialRequests">ልዩ ጥያቄዎች</Label>
                <Textarea
                  id="specialRequests"
                  value={reservationData.specialRequests}
                  onChange={(e) => setReservationData({ ...reservationData, specialRequests: e.target.value })}
                  placeholder="የልደት በዓል፣ የመስኮት ጎን፣ ወዘተ..."
                  rows={3}
                />
              </div>

              <Button onClick={() => setStep(2)} disabled={!canProceedToStep2} className="w-full">
                ቀጣይ - ቀን እና ጊዜ ምርጫ
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">ቀን እና ጊዜ ምርጫ</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reservationDate">ቀን *</Label>
                  <Input
                    id="reservationDate"
                    type="date"
                    value={reservationData.reservationDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">የቆይታ ጊዜ (ደቂቃ)</Label>
                  <Select
                    value={reservationData.duration.toString()}
                    onValueChange={(value) =>
                      setReservationData({ ...reservationData, duration: Number.parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">1 ሰዓት</SelectItem>
                      <SelectItem value="90">1.5 ሰዓት</SelectItem>
                      <SelectItem value="120">2 ሰዓት</SelectItem>
                      <SelectItem value="150">2.5 ሰዓት</SelectItem>
                      <SelectItem value="180">3 ሰዓት</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {timeSlots.length > 0 && (
                <div>
                  <Label>ክፍት ጊዜዎች</Label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={reservationData.reservationTime === slot.time ? "default" : "outline"}
                        disabled={!slot.available}
                        onClick={() => handleTimeChange(slot.time)}
                        className="flex flex-col items-center p-2 h-auto"
                      >
                        <span>{slot.time}</span>
                        <span className="text-xs">{slot.available ? `${slot.tablesAvailable} ጠረጴዛ` : "ተሞልቷል"}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  ተመለስ
                </Button>
                <Button onClick={() => setStep(3)} disabled={!canProceedToStep3} className="flex-1">
                  ቀጣይ - ጠረጴዛ ምርጫ
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">ጠረጴዛ ምርጫ</h3>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">የቦታ ማስያዝ ማጠቃለያ</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>
                    <strong>ደንበኛ:</strong> {reservationData.customerName}
                  </p>
                  <p>
                    <strong>ስልክ:</strong> {reservationData.customerPhone}
                  </p>
                  <p>
                    <strong>ቀን:</strong> {new Date(reservationData.reservationDate).toLocaleDateString("am-ET")}
                  </p>
                  <p>
                    <strong>ጊዜ:</strong> {reservationData.reservationTime}
                  </p>
                  <p>
                    <strong>ሰዎች:</strong> {reservationData.partySize}
                  </p>
                  <p>
                    <strong>ቆይታ:</strong> {reservationData.duration} ደቂቃ
                  </p>
                </div>
              </div>

              {availableTables.length > 0 ? (
                <div>
                  <Label>ክፍት ጠረጴዛዎች</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {availableTables.map((table) => (
                      <Card
                        key={table.id}
                        className={`cursor-pointer transition-all ${selectedTable === table.id ? "border-green-500 bg-green-50" : "hover:border-gray-400"}`}
                        onClick={() => setSelectedTable(table.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">ጠረጴዛ {table.number}</h4>
                            <Badge variant="outline">
                              {table.type === "regular"
                                ? "መደበኛ"
                                : table.type === "vip"
                                  ? "ቪአይፒ"
                                  : table.type === "outdoor"
                                    ? "ውጪ"
                                    : table.type === "bar"
                                      ? "ባር"
                                      : table.type === "private"
                                        ? "ግላዊ"
                                        : table.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>እስከ {table.capacity} ሰዎች</span>
                          </div>
                          {table.features.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {table.features.slice(0, 2).map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature === "window_view"
                                    ? "የመስኮት እይታ"
                                    : feature === "quiet"
                                      ? "ጸጥ ያለ"
                                      : feature === "vip"
                                        ? "ቪአይፒ"
                                        : feature === "outdoor"
                                          ? "ውጪ"
                                          : feature === "garden_view"
                                            ? "የአትክልት እይታ"
                                            : feature}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>ማስታወሻ:</strong> ጠረጴዛ ካልመረጡ ስርዓቱ በራሱ ተስማሚ ጠረጴዛ ይመድባል።
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">በተመረጠው ቀን እና ጊዜ ክፍት ጠረጴዛ የለም</p>
                  <Button variant="outline" onClick={() => setStep(2)} className="mt-2">
                    ሌላ ጊዜ ምረጥ
                  </Button>
                </div>
              )}

              <div>
                <Label htmlFor="notes">ተጨማሪ ማስታወሻ</Label>
                <Textarea
                  id="notes"
                  value={reservationData.notes}
                  onChange={(e) => setReservationData({ ...reservationData, notes: e.target.value })}
                  placeholder="ለሰራተኞች ተጨማሪ መረጃ..."
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  ተመለስ
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "እየተፈጥር ነው..." : "ቦታ ማስያዝ ፍጠር"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
