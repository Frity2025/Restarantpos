"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Clock, Users, CheckCircle } from "lucide-react"
import { tableManager } from "@/lib/table-management"
import { useAuth } from "@/contexts/auth-context"
import type { TimeSlot, Table } from "@/types/table"
import { format } from "date-fns"

export function ReservationBooking() {
  const { employee } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    partySize: 2,
    reservationDate: new Date(),
    reservationTime: "",
    duration: 120,
    specialRequests: "",
    priority: "normal" as const,
  })

  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, reservationDate: date })
      // Get available time slots for the selected date
      const slots = tableManager.getAvailableTimeSlots(date, formData.partySize)
      setAvailableSlots(slots)
    }
  }

  const handleTimeSelect = (time: string) => {
    setFormData({ ...formData, reservationTime: time })
    // Suggest best table for this time slot
    const suggestedTable = tableManager.suggestBestTable(formData.partySize)
    setSelectedTable(suggestedTable)
  }

  const handleSubmit = async () => {
    if (!employee || !selectedTable) return

    setIsSubmitting(true)
    try {
      const reservationData = {
        tableId: selectedTable.id,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || undefined,
        partySize: formData.partySize,
        reservationDate: formData.reservationDate,
        reservationTime: formData.reservationTime,
        duration: formData.duration,
        status: "confirmed" as const,
        specialRequests: formData.specialRequests || undefined,
        createdBy: employee.id,
        priority: formData.priority,
      }

      const newReservation = tableManager.createReservation(reservationData)
      alert(`ቦታ ማስያዝ ${newReservation.id} በተሳካ ሁኔታ ተፈጠረ!`)

      // Reset form
      setStep(1)
      setFormData({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        partySize: 2,
        reservationDate: new Date(),
        reservationTime: "",
        duration: 120,
        specialRequests: "",
        priority: "normal",
      })
      setSelectedTable(null)
      setAvailableSlots([])
    } catch (error) {
      alert("ቦታ ማስያዝ መፍጠር አልተሳካም")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            1
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? "bg-blue-500" : "bg-gray-200"}`} />
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            2
          </div>
          <div className={`w-16 h-1 ${step >= 3 ? "bg-blue-500" : "bg-gray-200"}`} />
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            3
          </div>
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              የደንበኛ መረጃ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">የደንበኛ ስም *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="ሙሉ ስም ያስገቡ"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">ስልክ ቁጥር *</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="+251911123456"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">ኢሜይል</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <Label htmlFor="partySize">የሰዎች ቁጥር *</Label>
                <Select
                  value={formData.partySize.toString()}
                  onValueChange={(value) => setFormData({ ...formData, partySize: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} ሰዎች
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="specialRequests">ልዩ ጥያቄዎች</Label>
              <Textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                placeholder="የልደት በዓል፣ የአለርጂ መረጃ፣ ወዘተ..."
                rows={3}
              />
            </div>

            <div>
              <Label>ቅድሚያ</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">መደበኛ</SelectItem>
                  <SelectItem value="high">ከፍተኛ</SelectItem>
                  <SelectItem value="vip">ቪአይፒ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => setStep(2)}
              className="w-full"
              disabled={!formData.customerName || !formData.customerPhone}
            >
              ቀጣይ - ቀን እና ሰዓት ምረጥ
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              ቀን እና ሰዓት ምረጥ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label>ቀን ምረጥ</Label>
                <Calendar
                  mode="single"
                  selected={formData.reservationDate}
                  onSelect={handleDateChange}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>

              <div>
                <Label>ክፍት ሰዓቶች</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-80 overflow-y-auto">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={formData.reservationTime === slot.time ? "default" : "outline"}
                      disabled={!slot.available}
                      onClick={() => handleTimeSelect(slot.time)}
                      className="justify-start"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {slot.time}
                    </Button>
                  ))}
                </div>

                {availableSlots.length === 0 && formData.reservationDate && (
                  <p className="text-gray-500 text-center py-4">ለተመረጠው ቀን ክፍት ሰዓቶች እየተጫኑ ነው...</p>
                )}
              </div>
            </div>

            <div>
              <Label>የቆይታ ጊዜ</Label>
              <Select
                value={formData.duration.toString()}
                onValueChange={(value) => setFormData({ ...formData, duration: Number.parseInt(value) })}
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

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                ተመለስ
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1" disabled={!formData.reservationTime}>
                ቀጣይ - ጠረጴዛ ምረጥ
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              ማረጋገጫ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">የቦታ ማስያዝ ማጠቃለያ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <strong>ደንበኛ:</strong> {formData.customerName}
                  </p>
                  <p>
                    <strong>ስልክ:</strong> {formData.customerPhone}
                  </p>
                  {formData.customerEmail && (
                    <p>
                      <strong>ኢሜይል:</strong> {formData.customerEmail}
                    </p>
                  )}
                  <p>
                    <strong>የሰዎች ቁጥር:</strong> {formData.partySize}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>ቀን:</strong> {format(formData.reservationDate, "PPP")}
                  </p>
                  <p>
                    <strong>ሰዓት:</strong> {formData.reservationTime}
                  </p>
                  <p>
                    <strong>የቆይታ ጊዜ:</strong> {formData.duration} ደቂቃ
                  </p>
                  <p>
                    <strong>ቅድሚያ:</strong>{" "}
                    {formData.priority === "normal" ? "መደበኛ" : formData.priority === "high" ? "ከፍተኛ" : "ቪአይፒ"}
                  </p>
                </div>
              </div>

              {selectedTable && (
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <p className="font-medium text-blue-800">
                    የተመረጠ ጠረጴዛ: ጠረጴዛ {selectedTable.number} ({selectedTable.capacity} ሰዎች)
                  </p>
                </div>
              )}

              {formData.specialRequests && (
                <div className="mt-4">
                  <p>
                    <strong>ልዩ ጥያቄዎች:</strong>
                  </p>
                  <p className="text-gray-600">{formData.specialRequests}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                ተመለስ
              </Button>
              <Button onClick={handleSubmit} className="flex-1" disabled={isSubmitting || !selectedTable}>
                {isSubmitting ? "እየተፈጥር ነው..." : "ቦታ ማስያዝ ፍጠር"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
