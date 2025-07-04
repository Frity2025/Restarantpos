"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Clock, Users, Phone, AlertCircle, CheckCircle, XCircle, UserPlus, Filter } from "lucide-react"
import { waitlistManager } from "@/lib/waitlist-management"
import { tableManager } from "@/lib/table-management"
import type { WaitlistEntry, WaitlistStats } from "@/types/waitlist"

export function WaitlistManagement() {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([])
  const [waitingEntries, setWaitingEntries] = useState<WaitlistEntry[]>([])
  const [stats, setStats] = useState<WaitlistStats | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)

  useEffect(() => {
    loadWaitlistData()
    // ራስ-ሰር ማዘመን እያንዳንዱ 30 ሰከንድ
    const interval = setInterval(loadWaitlistData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadWaitlistData = () => {
    setWaitlist(waitlistManager.getAllWaitlist())
    setWaitingEntries(waitlistManager.getWaitingEntries())
    setStats(waitlistManager.getWaitlistStats())

    // ክፍት ጠረጴዛዎች ማረጋገጥ
    waitlistManager.checkForAvailableTables()
  }

  const getStatusColor = (status: WaitlistEntry["status"]) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      case "notified":
        return "bg-blue-100 text-blue-800"
      case "seated":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no_show":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: WaitlistEntry["status"]) => {
    switch (status) {
      case "waiting":
        return "በመጠባበቅ ላይ"
      case "notified":
        return "ተነግሮታል"
      case "seated":
        return "ተቀምጧል"
      case "cancelled":
        return "ተሰርዟል"
      case "no_show":
        return "አልመጣም"
      default:
        return "ያልታወቀ"
    }
  }

  const getPriorityColor = (priority: WaitlistEntry["priority"]) => {
    switch (priority) {
      case "vip":
        return "bg-purple-100 text-purple-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "elderly":
        return "bg-blue-100 text-blue-800"
      case "disability":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityText = (priority: WaitlistEntry["priority"]) => {
    switch (priority) {
      case "vip":
        return "ቪአይፒ"
      case "high":
        return "ከፍተኛ"
      case "elderly":
        return "አረጋውያን"
      case "disability":
        return "የአካል ጉዳተኞች"
      default:
        return "መደበኛ"
    }
  }

  const handleStatusChange = (entryId: string, newStatus: WaitlistEntry["status"]) => {
    if (waitlistManager.updateWaitlistStatus(entryId, newStatus)) {
      loadWaitlistData()
      if (selectedEntry?.id === entryId) {
        const updatedEntry = waitlistManager.getAllWaitlist().find((e) => e.id === entryId)
        setSelectedEntry(updatedEntry || null)
      }
    }
  }

  const handleSeatCustomer = (entryId: string) => {
    const entry = waitlist.find((e) => e.id === entryId)
    if (!entry) return

    // ተስማሚ ጠረጴዛ ማግኘት
    const availableTables = tableManager.getTablesByStatus("available")
    const suitableTable = availableTables.find((table) => table.capacity >= entry.partySize)

    if (suitableTable) {
      waitlistManager.updateWaitlistStatus(entryId, "seated", suitableTable.id)
      loadWaitlistData()
    }
  }

  const filteredWaitlist = waitlist.filter((entry) => {
    const matchesSearch =
      entry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || entry.customerPhone.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatWaitTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} ደቂቃ`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours} ሰዓት ${remainingMinutes} ደቂቃ`
  }

  return (
    <div className="space-y-6">
      {/* ስታቲስቲክስ ካርዶች */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">በመጠባበቅ ላይ</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.totalWaiting}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">አማካይ የጥበቃ ጊዜ</p>
                  <p className="text-2xl font-bold">{stats.averageWaitTime} ደቂቃ</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ዛሬ የተቀመጡ</p>
                  <p className="text-2xl font-bold text-green-600">{stats.totalServedToday}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">የአለመምጣት መጠን</p>
                  <p className="text-2xl font-bold text-red-600">{stats.noShowRate.toFixed(1)}%</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ፍለጋ እና ማጣሪያ */}
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
                <SelectItem value="waiting">በመጠባበቅ ላይ</SelectItem>
                <SelectItem value="notified">ተነግሮታል</SelectItem>
                <SelectItem value="seated">ተቀምጧል</SelectItem>
                <SelectItem value="cancelled">ተሰርዟል</SelectItem>
                <SelectItem value="no_show">አልመጣም</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  ወደ ጥበቃ ዝርዝር ጨምር
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>ወደ ጥበቃ ዝርዝር ጨምር</DialogTitle>
                </DialogHeader>
                <AddToWaitlistForm
                  onSuccess={() => {
                    setShowAddDialog(false)
                    loadWaitlistData()
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="waiting" className="space-y-4">
        <TabsList>
          <TabsTrigger value="waiting">በመጠባበቅ ላይ ({waitingEntries.length})</TabsTrigger>
          <TabsTrigger value="all">ሁሉም ({filteredWaitlist.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="waiting" className="space-y-4">
          {waitingEntries.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">በጥበቃ ዝርዝር ውስጥ ምንም ደንበኛ የለም</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {waitingEntries.map((entry, index) => (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold">{entry.customerName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {entry.customerPhone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {entry.partySize} ሰዎች
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatWaitTime(entry.estimatedWaitTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {entry.priority !== "normal" && (
                          <Badge className={getPriorityColor(entry.priority)}>{getPriorityText(entry.priority)}</Badge>
                        )}
                        <Badge className={getStatusColor(entry.status)}>{getStatusText(entry.status)}</Badge>
                        <Button
                          size="sm"
                          onClick={() => handleSeatCustomer(entry.id)}
                          disabled={entry.status !== "waiting"}
                        >
                          አቀምጥ
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedEntry(entry)}>
                              ዝርዝር
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>የጥበቃ ዝርዝር ዝርዝር</DialogTitle>
                            </DialogHeader>
                            {selectedEntry && (
                              <WaitlistEntryDetails entry={selectedEntry} onStatusChange={handleStatusChange} />
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
          {filteredWaitlist.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">ምንም ውጤት አልተገኘም</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredWaitlist.map((entry) => (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold">{entry.customerName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {entry.customerPhone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {entry.partySize} ሰዎች
                            </span>
                            <span>ተቀላቅሏል: {entry.joinedAt.toLocaleString("am-ET")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {entry.priority !== "normal" && (
                          <Badge className={getPriorityColor(entry.priority)}>{getPriorityText(entry.priority)}</Badge>
                        )}
                        <Badge className={getStatusColor(entry.status)}>{getStatusText(entry.status)}</Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedEntry(entry)}>
                              ዝርዝር
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>የጥበቃ ዝርዝር ዝርዝር</DialogTitle>
                            </DialogHeader>
                            {selectedEntry && (
                              <WaitlistEntryDetails entry={selectedEntry} onStatusChange={handleStatusChange} />
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

// ወደ ጥበቃ ዝርዝር ማከል ፎርም
function AddToWaitlistForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    partySize: 2,
    priority: "normal" as const,
    specialRequests: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    waitlistManager.addToWaitlist({
      ...formData,
      createdBy: "current-user", // በእውነተኛ አፕሊኬሽን ውስጥ ከ auth context ይመጣል
    })

    onSuccess()
    setFormData({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      partySize: 2,
      priority: "normal",
      specialRequests: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">የደንበኛ ስም *</label>
        <Input
          required
          value={formData.customerName}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          placeholder="ሙሉ ስም ያስገቡ"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">ስልክ ቁጥር *</label>
        <Input
          required
          type="tel"
          value={formData.customerPhone}
          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
          placeholder="+251911123456"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">ኢሜይል</label>
        <Input
          type="email"
          value={formData.customerEmail}
          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">የሰዎች ቁጥር *</label>
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

      <div>
        <label className="block text-sm font-medium mb-1">ቅድሚያ</label>
        <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">መደበኛ</SelectItem>
            <SelectItem value="high">ከፍተኛ</SelectItem>
            <SelectItem value="vip">ቪአይፒ</SelectItem>
            <SelectItem value="elderly">አረጋውያን</SelectItem>
            <SelectItem value="disability">የአካል ጉዳተኞች</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">ልዩ ጥያቄዎች</label>
        <Input
          value={formData.specialRequests}
          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
          placeholder="ማንኛውም ልዩ ጥያቄ..."
        />
      </div>

      <Button type="submit" className="w-full">
        ወደ ጥበቃ ዝርዝር ጨምር
      </Button>
    </form>
  )
}

// የጥበቃ ዝርዝር ግቤት ዝርዝሮች
function WaitlistEntryDetails({
  entry,
  onStatusChange,
}: {
  entry: WaitlistEntry
  onStatusChange: (entryId: string, status: WaitlistEntry["status"]) => void
}) {
  const position = waitlistManager.getWaitlistPosition(entry.id)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-medium">ደንበኛ</p>
          <p>{entry.customerName}</p>
        </div>
        <div>
          <p className="font-medium">ስልክ</p>
          <p>{entry.customerPhone}</p>
        </div>
        <div>
          <p className="font-medium">የሰዎች ቁጥር</p>
          <p>{entry.partySize}</p>
        </div>
        <div>
          <p className="font-medium">ቅድሚያ</p>
          <Badge
            className={`inline-block ${entry.priority === "vip" ? "bg-purple-100 text-purple-800" : entry.priority === "high" ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-800"}`}
          >
            {entry.priority === "vip"
              ? "ቪአይፒ"
              : entry.priority === "high"
                ? "ከፍተኛ"
                : entry.priority === "elderly"
                  ? "አረጋውያን"
                  : entry.priority === "disability"
                    ? "የአካል ጉዳተኞች"
                    : "መደበኛ"}
          </Badge>
        </div>
        <div>
          <p className="font-medium">ተቀላቅሏል</p>
          <p>{entry.joinedAt.toLocaleString("am-ET")}</p>
        </div>
        <div>
          <p className="font-medium">የጥበቃ ጊዜ</p>
          <p>{entry.estimatedWaitTime} ደቂቃ</p>
        </div>
      </div>

      {position > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>በጥበቃ ዝርዝር ውስጥ ቦታ #{position}</AlertDescription>
        </Alert>
      )}

      {entry.specialRequests && (
        <div>
          <p className="font-medium">ልዩ ጥያቄዎች</p>
          <p className="text-sm text-gray-600">{entry.specialRequests}</p>
        </div>
      )}

      {entry.tableAssigned && (
        <div>
          <p className="font-medium">የተመደበ ጠረጴዛ</p>
          <p className="text-sm text-gray-600">ጠረጴዛ {tableManager.getTableById(entry.tableAssigned)?.number}</p>
        </div>
      )}

      <div className="space-y-2">
        <p className="font-medium">ሁኔታ ቀይር</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant={entry.status === "notified" ? "default" : "outline"}
            onClick={() => onStatusChange(entry.id, "notified")}
          >
            ተነግሮታል
          </Button>
          <Button
            size="sm"
            variant={entry.status === "seated" ? "default" : "outline"}
            onClick={() => onStatusChange(entry.id, "seated")}
          >
            ተቀምጧል
          </Button>
          <Button
            size="sm"
            variant={entry.status === "cancelled" ? "default" : "outline"}
            onClick={() => onStatusChange(entry.id, "cancelled")}
          >
            ተሰርዟል
          </Button>
          <Button
            size="sm"
            variant={entry.status === "no_show" ? "default" : "outline"}
            onClick={() => onStatusChange(entry.id, "no_show")}
          >
            አልመጣም
          </Button>
        </div>
      </div>
    </div>
  )
}
