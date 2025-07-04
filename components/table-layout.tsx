"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, Eye } from "lucide-react"
import { tableManager } from "@/lib/table-management"
import type { Table, TableStatus } from "@/types/table"

const statusColors: Record<TableStatus, string> = {
  available: "bg-green-100 border-green-500 text-green-800",
  occupied: "bg-red-100 border-red-500 text-red-800",
  reserved: "bg-blue-100 border-blue-500 text-blue-800",
  cleaning: "bg-yellow-100 border-yellow-500 text-yellow-800",
  maintenance: "bg-gray-100 border-gray-500 text-gray-800",
}

const statusNames: Record<TableStatus, string> = {
  available: "ክፍት",
  occupied: "የተያዘ",
  reserved: "የተያዘ ቦታ",
  cleaning: "እየተጸዳ",
  maintenance: "በጥገና ላይ",
}

const typeNames = {
  regular: "መደበኛ",
  vip: "ቪአይፒ",
  outdoor: "ውጪ",
  bar: "ባር",
  private: "ግላዊ",
}

export function TableLayout() {
  const [tables, setTables] = useState<Table[]>([])
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [showTableDetails, setShowTableDetails] = useState(false)

  useEffect(() => {
    loadTables()
    const interval = setInterval(loadTables, 30000) // እያንዳንዱ 30 ሰከንድ አድስ
    return () => clearInterval(interval)
  }, [])

  const loadTables = () => {
    const allTables = tableManager.getAllTables()
    setTables(allTables)
  }

  const handleTableClick = (table: Table) => {
    setSelectedTable(table)
    setShowTableDetails(true)
  }

  const handleStatusChange = (tableId: string, newStatus: TableStatus) => {
    tableManager.updateTableStatus(tableId, newStatus)
    loadTables()
    setShowTableDetails(false)
  }

  const formatOccupiedTime = (occupiedAt: Date): string => {
    const elapsed = Math.floor((Date.now() - occupiedAt.getTime()) / (1000 * 60))
    return `${elapsed} ደቂቃ`
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">የጠረጴዛ አቀማመጥ</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm">ክፍት ({tables.filter((t) => t.status === "available").length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm">የተያዘ ({tables.filter((t) => t.status === "occupied").length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm">የተያዘ ቦታ ({tables.filter((t) => t.status === "reserved").length})</span>
          </div>
        </div>
      </div>

      {/* የጠረጴዛ አቀማመጥ */}
      <Card>
        <CardHeader>
          <CardTitle>የምግብ ቤት አቀማመጥ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-50 rounded-lg p-4" style={{ height: "600px", width: "100%" }}>
            {/* የጠረጴዛ ማሳያ */}
            {tables.map((table) => (
              <div
                key={table.id}
                className={`absolute border-2 rounded-lg cursor-pointer transition-all hover:shadow-lg ${statusColors[table.status]}`}
                style={{
                  left: `${table.location.x}px`,
                  top: `${table.location.y}px`,
                  width: `${table.location.width}px`,
                  height: `${table.location.height}px`,
                }}
                onClick={() => handleTableClick(table)}
              >
                <div className="h-full flex flex-col items-center justify-center p-2">
                  <div className="font-bold text-lg">{table.number}</div>
                  <div className="flex items-center gap-1 text-xs">
                    <Users className="h-3 w-3" />
                    <span>{table.capacity}</span>
                  </div>
                  {table.status === "occupied" && table.occupiedAt && (
                    <div className="flex items-center gap-1 text-xs mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatOccupiedTime(table.occupiedAt)}</span>
                    </div>
                  )}
                  {table.currentCustomer && (
                    <div className="text-xs text-center mt-1 truncate w-full">{table.currentCustomer}</div>
                  )}
                </div>
              </div>
            ))}

            {/* የክፍል መለያዎች */}
            <div className="absolute top-4 left-4 space-y-2">
              <div className="bg-white p-2 rounded shadow">
                <h4 className="font-semibold text-sm">ዋና አዳራሽ</h4>
              </div>
            </div>
            <div className="absolute top-4 right-4 space-y-2">
              <div className="bg-white p-2 rounded shadow">
                <h4 className="font-semibold text-sm">ባር ክፍል</h4>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* የጠረጴዛ ዝርዝር */}
      <Card>
        <CardHeader>
          <CardTitle>የጠረጴዛዎች ዝርዝር</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map((table) => (
              <Card key={table.id} className={`border-2 ${statusColors[table.status]}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">ጠረጴዛ {table.number}</h3>
                      <p className="text-sm text-gray-600">{typeNames[table.type]}</p>
                    </div>
                    <Badge className={statusColors[table.status]}>{statusNames[table.status]}</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{table.capacity} ሰዎች</span>
                    </div>

                    {table.status === "occupied" && (
                      <>
                        <p>
                          <strong>ደንበኛ:</strong> {table.currentCustomer}
                        </p>
                        {table.occupiedAt && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{formatOccupiedTime(table.occupiedAt)}</span>
                          </div>
                        )}
                      </>
                    )}

                    {table.features.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {table.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature === "window_view"
                              ? "የመስኮት እይታ"
                              : feature === "quiet"
                                ? "ጸጥ ያለ"
                                : feature === "accessible"
                                  ? "ተደራሽ"
                                  : feature === "vip"
                                    ? "ቪአይፒ"
                                    : feature === "outdoor"
                                      ? "ውጪ"
                                      : feature === "bar"
                                        ? "ባር"
                                        : feature === "private"
                                          ? "ግላዊ"
                                          : feature === "large_group"
                                            ? "ትልቅ ቡድን"
                                            : feature === "garden_view"
                                              ? "የአትክልት እይታ"
                                              : feature === "standing"
                                                ? "ቆሞ"
                                                : feature}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-3 bg-transparent"
                    onClick={() => handleTableClick(table)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    ዝርዝር
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* የጠረጴዛ ዝርዝር ሞዳል */}
      {showTableDetails && selectedTable && (
        <TableDetailsModal
          table={selectedTable}
          onClose={() => setShowTableDetails(false)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}

// የጠረጴዛ ዝርዝር ሞዳል
function TableDetailsModal({
  table,
  onClose,
  onStatusChange,
}: {
  table: Table
  onClose: () => void
  onStatusChange: (tableId: string, status: TableStatus) => void
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>ጠረጴዛ {table.number} ዝርዝር</CardTitle>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">አይነት</p>
              <p className="font-medium">{typeNames[table.type]}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">አቅም</p>
              <p className="font-medium">{table.capacity} ሰዎች</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">ሁኔታ</p>
            <Badge className={statusColors[table.status]}>{statusNames[table.status]}</Badge>
          </div>

          {table.currentCustomer && (
            <div>
              <p className="text-sm text-gray-600">አሁን ያለ ደንበኛ</p>
              <p className="font-medium">{table.currentCustomer}</p>
            </div>
          )}

          {table.occupiedAt && (
            <div>
              <p className="text-sm text-gray-600">የተያዘበት ጊዜ</p>
              <p className="font-medium">{table.occupiedAt.toLocaleString("am-ET")}</p>
            </div>
          )}

          {table.features.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">ባህሪያት</p>
              <div className="flex flex-wrap gap-1">
                {table.features.map((feature, index) => (
                  <Badge key={index} variant="outline">
                    {feature === "window_view"
                      ? "የመስኮት እይታ"
                      : feature === "quiet"
                        ? "ጸጥ ያለ"
                        : feature === "accessible"
                          ? "ተደራሽ"
                          : feature === "vip"
                            ? "ቪአይፒ"
                            : feature === "outdoor"
                              ? "ውጪ"
                              : feature === "bar"
                                ? "ባር"
                                : feature === "private"
                                  ? "ግላዊ"
                                  : feature === "large_group"
                                    ? "ትልቅ ቡድን"
                                    : feature === "garden_view"
                                      ? "የአትክልት እይታ"
                                      : feature === "standing"
                                        ? "ቆሞ"
                                        : feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm text-gray-600">ሁኔታ ቀይር</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                className="bg-green-50 hover:bg-green-100"
                onClick={() => onStatusChange(table.id, "available")}
              >
                ክፍት
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-red-50 hover:bg-red-100"
                onClick={() => onStatusChange(table.id, "occupied")}
              >
                የተያዘ
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-yellow-50 hover:bg-yellow-100"
                onClick={() => onStatusChange(table.id, "cleaning")}
              >
                እየተጸዳ
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-gray-50 hover:bg-gray-100"
                onClick={() => onStatusChange(table.id, "maintenance")}
              >
                በጥገና ላይ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
