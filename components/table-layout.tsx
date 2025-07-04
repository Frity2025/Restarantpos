"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { tableManager } from "@/lib/table-management"
import type { Table, TableStats } from "@/types/table"
import { Users, Clock, CheckCircle, AlertCircle } from "lucide-react"

export function TableLayout() {
  const [tables, setTables] = useState<Table[]>([])
  const [stats, setStats] = useState<TableStats | null>(null)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)

  useEffect(() => {
    setTables(tableManager.getAllTables())
    setStats(tableManager.getTableStats())
  }, [])

  const getStatusColor = (status: Table["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "occupied":
        return "bg-red-500"
      case "reserved":
        return "bg-yellow-500"
      case "cleaning":
        return "bg-blue-500"
      case "maintenance":
        return "bg-gray-500"
      default:
        return "bg-gray-300"
    }
  }

  const getStatusText = (status: Table["status"]) => {
    switch (status) {
      case "available":
        return "ክፍት"
      case "occupied":
        return "የተያዘ"
      case "reserved":
        return "የተያዘ ቦታ"
      case "cleaning":
        return "እየተጸዳ"
      case "maintenance":
        return "በጥገና ላይ"
      default:
        return "ያልታወቀ"
    }
  }

  const handleTableClick = (table: Table) => {
    setSelectedTable(table)
  }

  const handleStatusChange = (tableId: string, newStatus: Table["status"]) => {
    if (tableManager.updateTableStatus(tableId, newStatus)) {
      setTables(tableManager.getAllTables())
      setStats(tableManager.getTableStats())
      if (selectedTable?.id === tableId) {
        setSelectedTable(tableManager.getTableById(tableId) || null)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ጠቅላላ ጠረጴዛዎች</p>
                  <p className="text-2xl font-bold">{stats.totalTables}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ክፍት ጠረጴዛዎች</p>
                  <p className="text-2xl font-bold text-green-600">{stats.availableTables}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">የተያዙ ጠረጴዛዎች</p>
                  <p className="text-2xl font-bold text-red-600">{stats.occupiedTables}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">የመሙላት መጠን</p>
                  <p className="text-2xl font-bold">{stats.occupancyRate.toFixed(1)}%</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Layout */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>የጠረጴዛ አቀማመጥ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg min-h-[400px]">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className={`
                      relative cursor-pointer transition-all duration-200 hover:scale-105
                      ${table.shape === "round" ? "rounded-full" : "rounded-lg"}
                      ${selectedTable?.id === table.id ? "ring-2 ring-blue-500" : ""}
                    `}
                    onClick={() => handleTableClick(table)}
                  >
                    <div
                      className={`
                      w-full h-20 flex flex-col items-center justify-center
                      border-2 border-gray-300 bg-white shadow-sm
                      ${table.shape === "round" ? "rounded-full" : "rounded-lg"}
                    `}
                    >
                      <div
                        className={`
                        absolute -top-1 -right-1 w-4 h-4 rounded-full
                        ${getStatusColor(table.status)}
                      `}
                      />
                      <span className="font-bold text-lg">{table.number}</span>
                      <span className="text-xs text-gray-500">{table.capacity} ሰዎች</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm">ክፍት</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm">የተያዘ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">የተያዘ ቦታ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">እየተጸዳ</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>የጠረጴዛ ዝርዝር</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTable ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">ጠረጴዛ {selectedTable.number}</h3>
                    <Badge variant="secondary" className="mt-1">
                      {getStatusText(selectedTable.status)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">አቅም:</span>
                      <span>{selectedTable.capacity} ሰዎች</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ቅርጽ:</span>
                      <span>
                        {selectedTable.shape === "round" ? "ክብ" : selectedTable.shape === "square" ? "ካሬ" : "አራት ማዕዘን"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">አካባቢ:</span>
                      <span>
                        {selectedTable.location === "main_hall"
                          ? "ዋና አዳራሽ"
                          : selectedTable.location === "private_room"
                            ? "የግል ክፍል"
                            : selectedTable.location === "outdoor"
                              ? "ውጪ"
                              : "የባር አካባቢ"}
                      </span>
                    </div>
                  </div>

                  {selectedTable.currentOrder && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">የአሁኑ ትዕዛዝ: {selectedTable.currentOrder}</p>
                    </div>
                  )}

                  {selectedTable.reservedBy && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800">የተያዘ ቦታ: {selectedTable.reservedBy}</p>
                      {selectedTable.reservedUntil && (
                        <p className="text-xs text-yellow-600">
                          እስከ: {selectedTable.reservedUntil.toLocaleTimeString("am-ET")}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-sm font-medium">ሁኔታ ቀይር:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant={selectedTable.status === "available" ? "default" : "outline"}
                        onClick={() => handleStatusChange(selectedTable.id, "available")}
                        disabled={selectedTable.status === "available"}
                      >
                        ክፍት
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedTable.status === "occupied" ? "default" : "outline"}
                        onClick={() => handleStatusChange(selectedTable.id, "occupied")}
                        disabled={selectedTable.status === "occupied"}
                      >
                        የተያዘ
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedTable.status === "cleaning" ? "default" : "outline"}
                        onClick={() => handleStatusChange(selectedTable.id, "cleaning")}
                        disabled={selectedTable.status === "cleaning"}
                      >
                        እየተጸዳ
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedTable.status === "maintenance" ? "default" : "outline"}
                        onClick={() => handleStatusChange(selectedTable.id, "maintenance")}
                        disabled={selectedTable.status === "maintenance"}
                      >
                        በጥገና ላይ
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">ዝርዝር ለማየት ጠረጴዛ ይምረጡ</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
