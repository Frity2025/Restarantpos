"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, DollarSign, Package, Download, CalendarIcon, Clock, Star } from "lucide-react"
import { reportingService } from "@/lib/reporting-service"
import type { SalesReport, InventoryReport, FinancialReport, OperationalReport } from "@/lib/reporting-service"
import { format } from "date-fns"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function ReportingDashboard() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null)
  const [inventoryReport, setInventoryReport] = useState<InventoryReport | null>(null)
  const [financialReport, setFinancialReport] = useState<FinancialReport | null>(null)
  const [operationalReport, setOperationalReport] = useState<OperationalReport | null>(null)
  const [reportSummary, setReportSummary] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadReports()
  }, [dateRange])

  const loadReports = async () => {
    setIsLoading(true)
    try {
      const sales = reportingService.generateSalesReport(dateRange.from, dateRange.to)
      const inventory = reportingService.generateInventoryReport()
      const financial = reportingService.generateFinancialReport(dateRange.from, dateRange.to)
      const operational = reportingService.generateOperationalReport()
      const summary = reportingService.getReportSummary()

      setSalesReport(sales)
      setInventoryReport(inventory)
      setFinancialReport(financial)
      setOperationalReport(operational)
      setReportSummary(summary)
    } catch (error) {
      console.error("Failed to load reports:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportReport = (reportType: string, data: any) => {
    const filename = reportingService.exportReport(reportType, data)
    alert(`ሪፖርት ወደ ${filename} ተላክቷል`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">ሪፖርቶች በመጫን ላይ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ሪፖርቶች እና ትንታኔዎች</h1>
          <p className="text-muted-foreground">የንግድ አፈጻጸም እና ትንታኔ ዳሽቦርድ</p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to })
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Summary Cards */}
      {reportSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">የሳምንት ሽያጭ</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportSummary.weeklySales.total.toLocaleString()} ብር</div>
              <p className="text-xs text-muted-foreground">{reportSummary.weeklySales.orders} ትዕዛዞች</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">የወር ሽያጭ</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportSummary.monthlySales.total.toLocaleString()} ብር</div>
              <p className="text-xs text-muted-foreground">አማካይ: {Math.round(reportSummary.monthlySales.average)} ብር</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">የክምችት ዋጋ</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportSummary.inventory.totalValue.toLocaleString()} ብር</div>
              <p className="text-xs text-muted-foreground">{reportSummary.inventory.lowStock} ዝቅተኛ ክምችት</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">የኩሽና ቅልጥፍና</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportSummary.operational.efficiency}%</div>
              <p className="text-xs text-muted-foreground">ደንበኛ ዕርካታ: {reportSummary.operational.satisfaction}/5</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Reports */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">ሽያጭ ሪፖርት</TabsTrigger>
          <TabsTrigger value="inventory">ክምችት ሪፖርት</TabsTrigger>
          <TabsTrigger value="financial">የገንዘብ ሪፖርት</TabsTrigger>
          <TabsTrigger value="operational">የስራ ሪፖርት</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          {salesReport && <SalesReportView report={salesReport} onExport={handleExportReport} />}
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          {inventoryReport && <InventoryReportView report={inventoryReport} onExport={handleExportReport} />}
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          {financialReport && <FinancialReportView report={financialReport} onExport={handleExportReport} />}
        </TabsContent>

        <TabsContent value="operational" className="space-y-4">
          {operationalReport && <OperationalReportView report={operationalReport} onExport={handleExportReport} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SalesReportView({ report, onExport }: { report: SalesReport; onExport: (type: string, data: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">የሽያጭ ሪፖርት</h2>
        <Button onClick={() => onExport("sales", report)}>
          <Download className="mr-2 h-4 w-4" />
          ሪፖርት አውርድ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>ጠቅላላ ሽያጭ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{report.totalSales.toLocaleString()} ብር</div>
            <p className="text-muted-foreground">{report.totalOrders} ትዕዛዞች</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>አማካይ ትዕዛዝ ዋጋ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round(report.averageOrderValue)} ብር</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ከፍተኛ ሽያጭ ሰዓት</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {report.salesByHour.reduce((max, hour) => (hour.sales > max.sales ? hour : max)).hour}:00
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>የቀን ሽያጭ አዝማሚያ</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={report.salesByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>የሰዓት ሽያጭ ስርጭት</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={report.salesByHour}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>ከፍተኛ ሽያጭ ያላቸው ምግቦች</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.topSellingItems.slice(0, 5).map((item, index) => (
                <div key={item.itemId} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    <div>
                      <p className="font-medium">{item.itemNameAmharic}</p>
                      <p className="text-sm text-muted-foreground">{item.quantitySold} ተሽጧል</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.revenue.toLocaleString()} ብር</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>በምድብ ሽያጭ</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={report.salesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ categoryNameAmharic, percentage }) => `${categoryNameAmharic} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="totalSales"
                >
                  {report.salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InventoryReportView({
  report,
  onExport,
}: { report: InventoryReport; onExport: (type: string, data: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">የክምችት ሪፖርት</h2>
        <Button onClick={() => onExport("inventory", report)}>
          <Download className="mr-2 h-4 w-4" />
          ሪፖርት አውርድ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>ጠቅላላ እቃዎች</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{report.totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ጠቅላላ ዋጋ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{report.totalValue.toLocaleString()} ብር</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ዝቅተኛ ክምችት</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{report.lowStockItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ከክምችት ውጭ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{report.outOfStockItems}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>ከፍተኛ ዋጋ ያላቸው እቃዎች</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.topValueItems.slice(0, 8).map((item, index) => (
                <div key={item.itemId} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    <div>
                      <p className="font-medium">{item.itemNameAmharic}</p>
                      <p className="text-sm text-muted-foreground">ክምችት: {item.currentStock}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.value.toLocaleString()} ብር</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>በምድብ ክምችት ስርጭት</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={report.categoryBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoryNameAmharic" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalValue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>የክምችት እንቅስቃሴ (ባለፉት 7 ቀናት)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={report.stockMovements}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="stockIn" stroke="#00C49F" name="ክምችት ገባ" />
              <Line type="monotone" dataKey="stockOut" stroke="#FF8042" name="ክምችት ወጣ" />
              <Line type="monotone" dataKey="netChange" stroke="#8884d8" name="ጠቅላላ ለውጥ" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

function FinancialReportView({
  report,
  onExport,
}: { report: FinancialReport; onExport: (type: string, data: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">የገንዘብ ሪፖርት</h2>
        <Button onClick={() => onExport("financial", report)}>
          <Download className="mr-2 h-4 w-4" />
          ሪፖርት አውርድ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>ጠቅላላ ገቢ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{report.totalRevenue.toLocaleString()} ብር</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ጠቅላላ ወጪ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{report.totalCosts.toLocaleString()} ብር</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ጠቅላላ ትርፍ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{report.grossProfit.toLocaleString()} ብር</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>የትርፍ ህዳግ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{report.profitMargin.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>በክፍያ ዘዴ ገቢ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.revenueByPaymentMethod.map((method, index) => (
                <div key={method.method} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{method.method}</span>
                    <span>
                      {method.amount.toLocaleString()} ብር ({method.percentage}%)
                    </span>
                  </div>
                  <Progress value={method.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>የወር ትርፍ አዝማሚያ</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={report.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#00C49F" name="ገቢ" />
                <Line type="monotone" dataKey="costs" stroke="#FF8042" name="ወጪ" />
                <Line type="monotone" dataKey="profit" stroke="#8884d8" name="ትርፍ" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function OperationalReportView({
  report,
  onExport,
}: { report: OperationalReport; onExport: (type: string, data: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">የስራ ሪፖርት</h2>
        <Button onClick={() => onExport("operational", report)}>
          <Download className="mr-2 h-4 w-4" />
          ሪፖርት አውርድ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>ጠቅላላ ሰራተኞች</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{report.totalEmployees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>አማካይ ትዕዛዝ ጊዜ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{report.averageOrderTime} ደቂቃ</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>የኩሽና ቅልጥፍና</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{report.kitchenEfficiency}%</div>
            <Progress value={report.kitchenEfficiency} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ደንበኛ ዕርካታ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center">
              {report.customerSatisfaction}
              <Star className="ml-1 h-6 w-6 text-yellow-500 fill-current" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>የጠረጴዛ አጠቃቀም</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>አጠቃቀም መጠን</span>
                <span className="font-bold">{report.tableUtilization}%</span>
              </div>
              <Progress value={report.tableUtilization} className="h-4" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">ንቁ ትዕዛዞች</p>
                  <p className="font-bold text-lg">{report.activeOrders}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">የተጠናቀቁ ትዕዛዞች</p>
                  <p className="font-bold text-lg">{report.completedOrders}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>የከፍተኛ ሰዓት አፈጻጸም</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={report.peakHours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orderCount" fill="#8884d8" name="ትዕዛዞች" />
                <Bar dataKey="efficiency" fill="#00C49F" name="ቅልጥፍና %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
