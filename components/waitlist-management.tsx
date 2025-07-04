"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Phone, Users, AlertCircle, CheckCircle, XCircle, Bell, Star, UserCheck } from "lucide-react"
import { waitlistService } from "@/lib/waitlist-management"
import type { WaitlistEntry, WaitlistPriority, WaitlistStats } from "@/types/waitlist"
import { useToast } from "@/hooks/use-toast"

export function WaitlistManagement() {
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([])
  const [stats, setStats] = useState<WaitlistStats | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()

  // የአዲስ ግቤት ፎርም ሁኔታ
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
    // ራስ-ሰር ማሳወቂያ ፍተሻ
    const interval = setInterval(() => {
      checkForAvailableTables()
    }, 30000) // እያንዳንዱ 30 ሰከንድ

    return () => clearInterval(interval)
  }, [])

  const loadWaitlistData = () => {
    setWaitlistEntries(waitlistService.getAllWaitlistEntries())
    setStats(waitlistService.getWaitlistStats())
  }

  const checkForAvailableTables = () => {
    const notifiedEntries = waitlistService.checkForAvailableTables()
    if (notifiedEntries.length > 0) {
      toast({
        title: "ደንበኞች ተማሳወቁ",
        description: `${notifiedEntries.length} ደንበኞች ጠረጴዛ ስለተገኘ ተማሳወቁ`,
      })
      loadWaitlistData()
    }
  }

  const handleAddToWaitlist = () => {
    if (!newEntry.customerName || !newEntry.customerPhone) {
      toast({
        title: "ስህተት",
        description: "የደንበኛ ስም እና ስልክ ቁጥር ያስፈልጋል",
        variant: "destructive",
      })
      return
    }

    waitlistService.addToWaitlist(newEntry)
    toast({
      title: "ተሳክቷል",
      description: `${newEntry.customerName} ወደ ጥበቃ ዝርዝር ተጨመረ`,
    })

    // ፎርም ማጽዳት
    setNewEntry({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      partySize: 2,
      priority: "normal",
      specialRequests: "",
    })
    setIsAddDialogOpen(false)
    loadWaitlistData()
  }

  const handleStatusUpdate = (id: string, status: "seated" | "cancelled" | "no-show") => {
    waitlistService.updateWaitlistStatus(id, status)
    toast({
      title: "ተሳክቷል",
      description: "የደንበኛ ሁኔታ ተዘምኗል",
    })
    loadWaitlistData()
  }

  const handleNotifyCustomer = (id: string) => {
    const success = waitlistService.notifyCustomer(id)
    if (success) {
      toast({
        title: "ተሳክቷል",
        description: "ደንበኛ ተማሳወቀ",
      })
      loadWaitlistData()
    }
  }

  const getPriorityIcon = (priority: WaitlistPriority) => {
    switch (priority) {
      case "vip":
        return <Star className="h-4 w-4 text-yellow-500" />
      case "elderly":
      case "disabled":
        return <UserCheck className="h-4 w-4 text-blue-500" />
      case "high":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      default:
        return null
    }
  }

  const getPriorityColor = (priority: WaitlistPriority) => {
    switch (priority) {
      case "vip":
        return "bg-yellow-100 text-yellow-800"
      case "elderly":
      case "disabled":
        return "bg-blue-100 text-blue-800"
      case "high":
        return "bg-orange-100 text-orange-800"
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
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no-show":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "waiting":
        return "እየጠበቀ"
      case "notified":
        return "ተማሳወቀ"
      case "ready":
        return "ዝግጁ"
      case "seated":
        return "ተቀመጠ"
      case "cancelled":
        return "ተሰርዟል"
      case "no-show":
        return "አልመጣም"
      default:
        return status
    }
  }

  const getPriorityText = (priority: WaitlistPriority) => {
    switch (priority) {
      case "vip":
        return "ቪአይፒ"
      case "elderly":
        return "አረጋውያን"
      case "disabled":
        return "የአካል ጉዳተኞች"
      case "high":
        return "ከፍተኛ"
      case "normal":
        return "መደበኛ"
      default:
        return priority
    }
  }

  return (
    <div className="space-y-6">
      {/* ስታቲስቲክስ ካርዶች */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">እየጠበቁ ያሉ</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWaiting}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">አማካይ የጥበቃ ጊዜ</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageWaitTime} ደቂቃ</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ዛሬ የተቀመጡ</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSeatedToday}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">የአለመምጣት መጠን</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.noShowRate}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="active" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="active">ንቁ ጥበቃ ዝርዝር</TabsTrigger>
            <TabsTrigger value="all">ሁሉም ግቤቶች</TabsTrigger>
          </TabsList>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Users className="mr-2 h-4 w-4" />
                ወደ ጥበቃ ዝርዝር መጨመር
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>አዲስ ደንበኛ ወደ ጥበቃ ዝርዝር መጨመር</DialogTitle>
                <DialogDescription>የደንበኛ መረጃ ያስገቡ እና ወደ ጥበቃ ዝርዝር ይጨምሩ</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    ስም *
                  </Label>
                  <Input
                    id="name"
                    value={newEntry.customerName}
                    onChange={(e) => setNewEntry({ ...newEntry, customerName: e.target.value })}
                    className="col-span-3"
                    placeholder="የደንበኛ ስም"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    ስልክ *
                  </Label>
                  <Input
                    id="phone"
                    value={newEntry.customerPhone}
                    onChange={(e) => setNewEntry({ ...newEntry, customerPhone: e.target.value })}
                    className="col-span-3"
                    placeholder="+251911123456"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    ኢሜይል
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEntry.customerEmail}
                    onChange={(e) => setNewEntry({ ...newEntry, customerEmail: e.target.value })}
                    className="col-span-3"
                    placeholder="customer@email.com"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="partySize" className="text-right">
                    የቡድን መጠን
                  </Label>
                  <Input
                    id="partySize"
                    type="number"
                    min="1"
                    max="20"
                    value={newEntry.partySize}
                    onChange={(e) => setNewEntry({ ...newEntry, partySize: Number.parseInt(e.target.value) || 2 })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    ቅድሚያ
                  </Label>
                  <Select
                    value={newEntry.priority}
                    onValueChange={(value: WaitlistPriority) => setNewEntry({ ...newEntry, priority: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">መደበኛ</SelectItem>
                      <SelectItem value="high">ከፍተኛ</SelectItem>
                      <SelectItem value="elderly">አረጋውያን</SelectItem>
                      <SelectItem value="disabled">የአካል ጉዳተኞች</SelectItem>
                      <SelectItem value="vip">ቪአይፒ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="requests" className="text-right">
                    ልዩ ጥያቄዎች
                  </Label>
                  <Textarea
                    id="requests"
                    value={newEntry.specialRequests}
                    onChange={(e) => setNewEntry({ ...newEntry, specialRequests: e.target.value })}
                    className="col-span-3"
                    placeholder="የልጆች ወንበር፣ የተለየ ጠረጴዛ..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddToWaitlist}>
                  ወደ ጥበቃ ዝርዝር መጨመር
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ንቁ ጥበቃ ዝርዝር</CardTitle>
              <CardDescription>እየጠበቁ ያሉ እና ተማሳወቁ የተባሉ ደንበኞች</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {waitlistEntries
                  .filter((entry) => entry.status === "waiting" || entry.status === "notified")
                  .map((entry, index) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-semibold">
                          {index + 1}
                        </div>
                        <div className="flex items-center space-x-2">
                          {getPriorityIcon(entry.priority)}
                          <div>
                            <h3 className="font-semibold">{entry.customerName}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Phone className="h-3 w-3" />
                              <span>{entry.customerPhone}</span>
                              <Users className="h-3 w-3 ml-2" />
                              <span>{entry.partySize} ሰዎች</span>
                              <Clock className="h-3 w-3 ml-2" />
                              <span>{entry.estimatedWaitTime} ደቂቃ</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(entry.priority)}>{getPriorityText(entry.priority)}</Badge>
                        <Badge className={getStatusColor(entry.status)}>{getStatusText(entry.status)}</Badge>
                        <div className="flex space-x-1">
                          {entry.status === "waiting" && (
                            <Button size="sm" variant="outline" onClick={() => handleNotifyCustomer(entry.id)}>
                              <Bell className="h-3 w-3 mr-1" />
                              ማሳወቅ
                            </Button>
                          )}
                          {entry.status === "notified" && (
                            <Button size="sm" onClick={() => handleStatusUpdate(entry.id, "seated")}>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              ተቀመጠ
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(entry.id, "cancelled")}>
                            <XCircle className="h-3 w-3 mr-1" />
                            ሰርዝ
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                {waitlistEntries.filter((entry) => entry.status === "waiting" || entry.status === "notified").length ===
                  0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>በአሁኑ ጊዜ እየጠበቁ ያሉ ደንበኞች የሉም</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ሁሉም ጥበቃ ዝርዝር ግቤቶች</CardTitle>
              <CardDescription>ዛሬ ያሉ ሁሉም የጥበቃ ዝርዝር ግቤቶች</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {waitlistEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getPriorityIcon(entry.priority)}
                        <div>
                          <h3 className="font-semibold">{entry.customerName}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{entry.customerPhone}</span>
                            <Users className="h-3 w-3 ml-2" />
                            <span>{entry.partySize} ሰዎች</span>
                            <Clock className="h-3 w-3 ml-2" />
                            <span>{new Date(entry.createdAt).toLocaleTimeString("am-ET")}</span>
                          </div>
                          {entry.specialRequests && (
                            <p className="text-sm text-gray-500 mt-1">{entry.specialRequests}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(entry.priority)}>{getPriorityText(entry.priority)}</Badge>
                      <Badge className={getStatusColor(entry.status)}>{getStatusText(entry.status)}</Badge>
                      {entry.actualWaitTime && <Badge variant="outline">{entry.actualWaitTime} ደቂቃ ጠበቀ</Badge>}
                    </div>
                  </div>
                ))}
                {waitlistEntries.length === 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>ዛሬ የጥበቃ ዝርዝር ግቤቶች የሉም</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
