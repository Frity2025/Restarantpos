"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Clock, Phone, UserCheck, UserX, Plus, Bell, Calendar, TrendingUp } from "lucide-react"
import { waitlistService } from "@/lib/waitlist-management"
import type { WaitlistEntry, WaitlistPriority, WaitlistStats } from "@/types/waitlist"

export function WaitlistManagement() {
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([])
  const [stats, setStats] = useState<WaitlistStats>({
    totalWaiting: 0,
    averageWaitTime: 0,
    totalSeatedToday: 0,
    noShowRate: 0,
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newEntry, setNewEntry] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    partySize: 2,
    priority: "normal" as WaitlistPriority,
    specialRequests: "",
  })

  useEffect(() => {
    loadWaitlistData()
  }, [])

  const loadWaitlistData = () => {
    const entries = waitlistService.getAllWaitlistEntries()
    const statistics = waitlistService.getWaitlistStats()
    setWaitlistEntries(entries)
    setStats(statistics)
  }

  const handleAddToWaitlist = () => {
    if (!newEntry.customerName || !newEntry.customerPhone) {
      alert("እባክዎ የደንበኛ ስም እና ስልክ ቁጥር ያስገቡ")
      return
    }

    waitlistService.addToWaitlist(newEntry)
    setIsAddDialogOpen(false)
    setNewEntry({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      partySize: 2,
      priority: "normal",
      specialRequests: "",
    })
    loadWaitlistData()
  }

  const handleStatusUpdate = (id: string, status: "seated" | "cancelled" | "no-show") => {
    waitlistService.updateWaitlistStatus(id, status)
    loadWaitlistData()
  }

  const handleNotifyCustomer = (id: string) => {
    waitlistService.notifyCustomer(id)
    loadWaitlistData()
  }

  const getPriorityColor = (priority: WaitlistPriority) => {
    switch (priority) {
      case "vip":
        return "bg-purple-100 text-purple-800"
      case "high":
        return "bg-red-100 text-red-800"
      case "elderly":
      case "disabled":
        return "bg-blue-100 text-blue-800"
      case "normal":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      case "notified":
        return "bg-blue-100 text-blue-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "seated":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no-show":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">በጥበቃ ላይ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalWaiting}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">አማካይ የጥበቃ ጊዜ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageWaitTime} ደቂቃ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ዛሬ የተቀመጡ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSeatedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">የአለመምጣት መጠን</p>
                <p className="text-2xl font-bold text-gray-900">{stats.noShowRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              የደንበኞች ጥበቃ ዝርዝር
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  አዲስ ደንበኛ ጨምር
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>አዲስ ደንበኛ ወደ ጥበቃ ዝርዝር ጨምር</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">የደንበኛ ስም</Label>
                    <Input
                      id="customerName"
                      value={newEntry.customerName}
                      onChange={(e) => setNewEntry({ ...newEntry, customerName: e.target.value })}
                      placeholder="ሙሉ ስም ያስገቡ"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">ስልክ ቁጥር</Label>
                    <Input
                      id="customerPhone"
                      value={newEntry.customerPhone}
                      onChange={(e) => setNewEntry({ ...newEntry, customerPhone: e.target.value })}
                      placeholder="+251911123456"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">ኢሜይል (አማራጭ)</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={newEntry.customerEmail}
                      onChange={(e) => setNewEntry({ ...newEntry, customerEmail: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partySize">የቡድን መጠን</Label>
                    <Select
                      value={newEntry.partySize.toString()}
                      onValueChange={(value) => setNewEntry({ ...newEntry, partySize: Number.parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size} ሰዎች
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">ቅድሚያ</Label>
                    <Select
                      value={newEntry.priority}
                      onValueChange={(value) => setNewEntry({ ...newEntry, priority: value as WaitlistPriority })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">መደበኛ</SelectItem>
                        <SelectItem value="high">ከፍተኛ</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                        <SelectItem value="elderly">አረጋውያን</SelectItem>
                        <SelectItem value="disabled">የአካል ጉዳተኞች</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="specialRequests">ልዩ ጥያቄዎች</Label>
                    <Textarea
                      id="specialRequests"
                      value={newEntry.specialRequests}
                      onChange={(e) => setNewEntry({ ...newEntry, specialRequests: e.target.value })}
                      placeholder="ማንኛውም ልዩ ጥያቄ..."
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleAddToWaitlist} className="w-full">
                    ወደ ጥበቃ ዝርዝር ጨምር
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {waitlistEntries.length === 0 ? (
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>በጥበቃ ዝርዝር ውስጥ ምንም ደንበኛ የለም።</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {waitlistEntries.map((entry) => (
                <Card key={entry.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-lg font-semibold">{entry.customerName}</h3>
                          <Badge className={getPriorityColor(entry.priority)}>{entry.priority}</Badge>
                          <Badge className={getStatusColor(entry.status)}>{entry.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {entry.customerPhone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {entry.partySize} ሰዎች
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {entry.estimatedWaitTime} ደቂቃ
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(entry.joinedAt).toLocaleTimeString("am-ET")}
                          </div>
                        </div>
                        {entry.specialRequests && (
                          <div className="mt-2 text-sm text-gray-600">
                            <strong>ልዩ ጥያቄዎች:</strong> {entry.specialRequests}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {entry.status === "waiting" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleNotifyCustomer(entry.id)}>
                              <Bell className="h-4 w-4 mr-1" />
                              አሳውቅ
                            </Button>
                            <Button size="sm" onClick={() => handleStatusUpdate(entry.id, "seated")}>
                              <UserCheck className="h-4 w-4 mr-1" />
                              አቅመጥ
                            </Button>
                          </>
                        )}
                        {(entry.status === "waiting" || entry.status === "notified") && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate(entry.id, "cancelled")}
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            ሰርዝ
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
