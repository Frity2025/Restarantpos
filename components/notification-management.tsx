"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
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
import { Mail, MessageSquare, Bell, Settings, Plus, Send, CheckCircle, XCircle, Clock } from "lucide-react"
import { notificationService } from "@/lib/notification-service"
import type { NotificationTemplate, NotificationLog, NotificationConfig } from "@/lib/notification-service"

export function NotificationManagement() {
  const [config, setConfig] = useState<NotificationConfig>(notificationService.getConfig())
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [logs, setLogs] = useState<NotificationLog[]>([])
  const [stats, setStats] = useState<any>({})
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [isTemplateFormOpen, setIsTemplateFormOpen] = useState(false)
  const [isSendNotificationOpen, setIsSendNotificationOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setTemplates(notificationService.getTemplates())
    setLogs(notificationService.getNotificationLogs())
    setStats(notificationService.getNotificationStats())
  }

  const handleConfigUpdate = (updates: Partial<NotificationConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    notificationService.updateConfig(updates)
  }

  const handleSendTestNotification = async (type: "email" | "sms" | "push", recipient: string) => {
    try {
      await notificationService.sendNotification(type, recipient, "order-confirmation", {
        orderNumber: "TEST-001",
        total: "250.00",
        estimatedTime: "15",
      })
      loadData()
      alert("የሙከራ ማሳወቂያ ተልኳል!")
    } catch (error) {
      alert("የሙከራ ማሳወቂያ መላክ አልተሳካም")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ማሳወቂያ አስተዳደር</h1>
          <p className="text-muted-foreground">የደንበኛ እና ሰራተኛ ማሳወቂያዎች አስተዳደር</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                ቅንብሮች
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>የማሳወቂያ ቅንብሮች</DialogTitle>
                <DialogDescription>የኢሜይል፣ SMS እና Push ማሳወቂያዎች ቅንብሮች</DialogDescription>
              </DialogHeader>
              <NotificationConfigForm config={config} onUpdate={handleConfigUpdate} />
            </DialogContent>
          </Dialog>
          <Dialog open={isSendNotificationOpen} onOpenChange={setIsSendNotificationOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Send className="mr-2 h-4 w-4" />
                ማሳወቂያ ላክ
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ማሳወቂያ ላክ</DialogTitle>
                <DialogDescription>ለደንበኞች ወይም ሰራተኞች ማሳወቂያ ላክ</DialogDescription>
              </DialogHeader>
              <SendNotificationForm
                onSuccess={() => {
                  loadData()
                  setIsSendNotificationOpen(false)
                }}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={isTemplateFormOpen} onOpenChange={setIsTemplateFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                አዲስ ቴምፕሌት
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>አዲስ ማሳወቂያ ቴምፕሌት</DialogTitle>
                <DialogDescription>አዲስ የማሳወቂያ ቴምፕሌት ይፍጠሩ</DialogDescription>
              </DialogHeader>
              <TemplateForm
                onSuccess={() => {
                  loadData()
                  setIsTemplateFormOpen(false)
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ጠቅላላ ማሳወቂያዎች</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total || 0}</div>
            <p className="text-xs text-muted-foreground">{stats.sent || 0} ተልኳል</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">የስኬት መጠን</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.successRate || 0).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{stats.delivered || 0} ደርሷል</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ኢሜይሎች</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byType?.email || 0}</div>
            <p className="text-xs text-muted-foreground">የኢሜይል ማሳወቂያዎች</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS መልዕክቶች</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byType?.sms || 0}</div>
            <p className="text-xs text-muted-foreground">የSMS ማሳወቂያዎች</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">ቴምፕሌቶች ({templates.length})</TabsTrigger>
          <TabsTrigger value="logs">ታሪክ ({logs.length})</TabsTrigger>
          <TabsTrigger value="test">ሙከራ</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>የማሳወቂያ ቴምፕሌቶች</CardTitle>
              <CardDescription>የተለያዩ ዓይነት ማሳወቂያዎች ቴምፕሌቶች</CardDescription>
            </CardHeader>
            <CardContent>
              <TemplatesTable templates={templates} onUpdate={loadData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>የማሳወቂያ ታሪክ</CardTitle>
              <CardDescription>የተላኩ ማሳወቂያዎች ዝርዝር እና ሁኔታ</CardDescription>
            </CardHeader>
            <CardContent>
              <LogsTable logs={logs} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>የማሳወቂያ ሙከራ</CardTitle>
              <CardDescription>የማሳወቂያ ስርዓቶች ሙከራ እና ማረጋገጫ</CardDescription>
            </CardHeader>
            <CardContent>
              <TestNotificationPanel onSendTest={handleSendTestNotification} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NotificationConfigForm({
  config,
  onUpdate,
}: {
  config: NotificationConfig
  onUpdate: (updates: Partial<NotificationConfig>) => void
}) {
  const [formData, setFormData] = useState(config)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Configuration */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.email.enabled}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                email: { ...prev.email, enabled: checked },
              }))
            }
          />
          <Label className="text-lg font-medium">ኢሜይል ማሳወቂያዎች</Label>
        </div>

        {formData.email.enabled && (
          <div className="grid grid-cols-2 gap-4 pl-6">
            <div>
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                value={formData.email.smtpHost}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: { ...prev.email, smtpHost: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                type="number"
                value={formData.email.smtpPort}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: { ...prev.email, smtpPort: Number(e.target.value) },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="emailUsername">የተጠቃሚ ስም</Label>
              <Input
                id="emailUsername"
                value={formData.email.username}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: { ...prev.email, username: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="fromEmail">ከ ኢሜይል</Label>
              <Input
                id="fromEmail"
                type="email"
                value={formData.email.fromEmail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: { ...prev.email, fromEmail: e.target.value },
                  }))
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* SMS Configuration */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.sms.enabled}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                sms: { ...prev.sms, enabled: checked },
              }))
            }
          />
          <Label className="text-lg font-medium">SMS ማሳወቂያዎች</Label>
        </div>

        {formData.sms.enabled && (
          <div className="grid grid-cols-2 gap-4 pl-6">
            <div>
              <Label htmlFor="smsProvider">አቅራቢ</Label>
              <Select
                value={formData.sms.provider}
                onValueChange={(value: "twilio" | "aws" | "local") =>
                  setFormData((prev) => ({
                    ...prev,
                    sms: { ...prev.sms, provider: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">ሎካል አቅራቢ</SelectItem>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="aws">AWS SNS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fromNumber">ከ ቁጥር</Label>
              <Input
                id="fromNumber"
                value={formData.sms.fromNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sms: { ...prev.sms, fromNumber: e.target.value },
                  }))
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Push Configuration */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.push.enabled}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                push: { ...prev.push, enabled: checked },
              }))
            }
          />
          <Label className="text-lg font-medium">Push ማሳወቂያዎች</Label>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">ቅንብሮች አስቀምጥ</Button>
      </div>
    </form>
  )
}

function TemplateForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    nameAmharic: "",
    type: "sms" as "email" | "sms" | "push",
    subject: "",
    subjectAmharic: "",
    template: "",
    templateAmharic: "",
    variables: [] as string[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    notificationService.createTemplate({
      ...formData,
      isActive: true,
    })

    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">ስም (English)</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="nameAmharic">ስም (አማርኛ)</Label>
          <Input
            id="nameAmharic"
            value={formData.nameAmharic}
            onChange={(e) => setFormData((prev) => ({ ...prev, nameAmharic: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="type">ዓይነት</Label>
        <Select
          value={formData.type}
          onValueChange={(value: "email" | "sms" | "push") => setFormData((prev) => ({ ...prev, type: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">ኢሜይል</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="push">Push</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.type === "email" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="subject">ርዕስ (English)</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="subjectAmharic">ርዕስ (አማርኛ)</Label>
            <Input
              id="subjectAmharic"
              value={formData.subjectAmharic}
              onChange={(e) => setFormData((prev) => ({ ...prev, subjectAmharic: e.target.value }))}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="template">መልዕክት (English)</Label>
          <Textarea
            id="template"
            value={formData.template}
            onChange={(e) => setFormData((prev) => ({ ...prev, template: e.target.value }))}
            rows={4}
            required
          />
        </div>
        <div>
          <Label htmlFor="templateAmharic">መልዕክት (አማርኛ)</Label>
          <Textarea
            id="templateAmharic"
            value={formData.templateAmharic}
            onChange={(e) => setFormData((prev) => ({ ...prev, templateAmharic: e.target.value }))}
            rows={4}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          ሰርዝ
        </Button>
        <Button type="submit">ቴምፕሌት ፍጠር</Button>
      </div>
    </form>
  )
}

function SendNotificationForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    type: "sms" as "email" | "sms" | "push",
    recipient: "",
    templateId: "",
    variables: {} as Record<string, string>,
  })

  const templates = notificationService.getTemplates()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await notificationService.sendNotification(
        formData.type,
        formData.recipient,
        formData.templateId,
        formData.variables,
      )
      onSuccess()
    } catch (error) {
      alert("ማሳወቂያ መላክ አልተሳካም")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="type">ዓይነት</Label>
        <Select
          value={formData.type}
          onValueChange={(value: "email" | "sms" | "push") => setFormData((prev) => ({ ...prev, type: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">ኢሜይል</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="push">Push</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="recipient">ተቀባይ</Label>
        <Input
          id="recipient"
          value={formData.recipient}
          onChange={(e) => setFormData((prev) => ({ ...prev, recipient: e.target.value }))}
          placeholder={formData.type === "email" ? "email@example.com" : "+251911123456"}
          required
        />
      </div>

      <div>
        <Label htmlFor="template">ቴምፕሌት</Label>
        <Select
          value={formData.templateId}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, templateId: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="ቴምፕሌት ምረጥ" />
          </SelectTrigger>
          <SelectContent>
            {templates
              .filter((t) => t.type === formData.type)
              .map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.nameAmharic}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          ሰርዝ
        </Button>
        <Button type="submit">ማሳወቂያ ላክ</Button>
      </div>
    </form>
  )
}

function TemplatesTable({ templates, onUpdate }: { templates: NotificationTemplate[]; onUpdate: () => void }) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "sms":
        return <MessageSquare className="h-4 w-4" />
      case "push":
        return <Bell className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case "email":
        return "ኢሜይል"
      case "sms":
        return "SMS"
      case "push":
        return "Push"
      default:
        return type
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ስም</TableHead>
          <TableHead>ዓይነት</TableHead>
          <TableHead>መልዕክት</TableHead>
          <TableHead>ሁኔታ</TableHead>
          <TableHead>ድርጊቶች</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {templates.map((template) => (
          <TableRow key={template.id}>
            <TableCell>
              <div>
                <div className="font-medium">{template.nameAmharic}</div>
                <div className="text-sm text-muted-foreground">{template.name}</div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {getTypeIcon(template.type)}
                <span>{getTypeName(template.type)}</span>
              </div>
            </TableCell>
            <TableCell className="max-w-xs">
              <div className="truncate">{template.templateAmharic}</div>
            </TableCell>
            <TableCell>
              <Badge variant={template.isActive ? "default" : "secondary"}>{template.isActive ? "ንቁ" : "ቦዝ"}</Badge>
            </TableCell>
            <TableCell>
              <Button size="sm" variant="outline">
                አርትዕ
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function LogsTable({ logs }: { logs: NotificationLog[] }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusName = (status: string) => {
    switch (status) {
      case "sent":
        return "ተልኳል"
      case "delivered":
        return "ደርሷል"
      case "failed":
        return "አልተሳካም"
      case "pending":
        return "በመጠባበቅ"
      default:
        return status
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "sms":
        return <MessageSquare className="h-4 w-4" />
      case "push":
        return <Bell className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ዓይነት</TableHead>
          <TableHead>ተቀባይ</TableHead>
          <TableHead>መልዕክት</TableHead>
          <TableHead>ሁኔታ</TableHead>
          <TableHead>ተልኳል</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.slice(0, 50).map((log) => (
          <TableRow key={log.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                {getTypeIcon(log.type)}
                <span className="capitalize">{log.type}</span>
              </div>
            </TableCell>
            <TableCell>{log.recipient}</TableCell>
            <TableCell className="max-w-xs">
              <div className="truncate">{log.message}</div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {getStatusIcon(log.status)}
                <span>{getStatusName(log.status)}</span>
              </div>
            </TableCell>
            <TableCell>{log.sentAt ? log.sentAt.toLocaleString("am-ET") : "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function TestNotificationPanel({
  onSendTest,
}: { onSendTest: (type: "email" | "sms" | "push", recipient: string) => void }) {
  const [testData, setTestData] = useState({
    email: "",
    phone: "",
    pushToken: "",
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              ኢሜይል ሙከራ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="test@example.com"
              value={testData.email}
              onChange={(e) => setTestData((prev) => ({ ...prev, email: e.target.value }))}
            />
            <Button
              className="w-full"
              onClick={() => testData.email && onSendTest("email", testData.email)}
              disabled={!testData.email}
            >
              ኢሜይል ላክ
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              SMS ሙከራ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="+251911123456"
              value={testData.phone}
              onChange={(e) => setTestData((prev) => ({ ...prev, phone: e.target.value }))}
            />
            <Button
              className="w-full"
              onClick={() => testData.phone && onSendTest("sms", testData.phone)}
              disabled={!testData.phone}
            >
              SMS ላክ
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Push ሙከራ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="push-token"
              value={testData.pushToken}
              onChange={(e) => setTestData((prev) => ({ ...prev, pushToken: e.target.value }))}
            />
            <Button
              className="w-full"
              onClick={() => testData.pushToken && onSendTest("push", testData.pushToken)}
              disabled={!testData.pushToken}
            >
              Push ላክ
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
