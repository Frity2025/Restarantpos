import type {
  Table,
  Reservation,
  TableStatus,
  ReservationStatus,
  TableStats,
  ReservationFilter,
  TimeSlot,
} from "@/types/table"

// ናሙና ጠረጴዛዎች
const tables: Table[] = [
  // ዋና አዳራሽ ጠረጴዛዎች
  {
    id: "table-001",
    number: "1",
    capacity: 2,
    type: "regular",
    status: "available",
    location: { x: 50, y: 50, width: 80, height: 80 },
    features: ["window_view"],
    isActive: true,
  },
  {
    id: "table-002",
    number: "2",
    capacity: 4,
    type: "regular",
    status: "occupied",
    location: { x: 150, y: 50, width: 100, height: 80 },
    currentOrderId: "order-001",
    currentCustomer: "ፍሎይድ ማይልስ",
    occupiedAt: new Date(Date.now() - 30 * 60 * 1000),
    estimatedDuration: 60,
    features: [],
    isActive: true,
  },
  {
    id: "table-003",
    number: "3",
    capacity: 6,
    type: "regular",
    status: "reserved",
    location: { x: 270, y: 50, width: 120, height: 100 },
    features: ["large_group"],
    isActive: true,
  },
  {
    id: "table-004",
    number: "4",
    capacity: 2,
    type: "regular",
    status: "cleaning",
    location: { x: 50, y: 170, width: 80, height: 80 },
    features: [],
    isActive: true,
  },
  {
    id: "table-005",
    number: "5",
    capacity: 8,
    type: "vip",
    status: "available",
    location: { x: 150, y: 170, width: 140, height: 120 },
    features: ["vip", "private", "quiet"],
    isActive: true,
  },
  {
    id: "table-006",
    number: "6",
    capacity: 4,
    type: "outdoor",
    status: "available",
    location: { x: 310, y: 170, width: 100, height: 80 },
    features: ["outdoor", "garden_view"],
    isActive: true,
  },
  // ባር ጠረጴዛዎች
  {
    id: "bar-001",
    number: "B1",
    capacity: 3,
    type: "bar",
    status: "available",
    location: { x: 450, y: 50, width: 60, height: 120 },
    features: ["bar", "standing"],
    isActive: true,
  },
  {
    id: "bar-002",
    number: "B2",
    capacity: 3,
    type: "bar",
    status: "occupied",
    location: { x: 520, y: 50, width: 60, height: 120 },
    currentCustomer: "አህመድ አሊ",
    occupiedAt: new Date(Date.now() - 45 * 60 * 1000),
    features: ["bar", "standing"],
    isActive: true,
  },
]

// ናሙና ቦታ ማስያዞች
const reservations: Reservation[] = [
  {
    id: "res-001",
    reservationNumber: "RES-001",
    customerName: "ሳራ ተስፋዬ",
    customerPhone: "+251911123456",
    customerEmail: "sara@email.com",
    partySize: 4,
    reservationDate: new Date(),
    reservationTime: "19:00",
    duration: 90,
    status: "confirmed",
    tableId: "table-003",
    tableNumber: "3",
    specialRequests: "የልደት በዓል",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    employeeId: "emp-002",
    employeeName: "ፋጢማ አህመድ",
  },
  {
    id: "res-002",
    reservationNumber: "RES-002",
    customerName: "ዳዊት መንግስቱ",
    customerPhone: "+251911234567",
    partySize: 2,
    reservationDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // ነገ
    reservationTime: "18:30",
    duration: 60,
    status: "pending",
    specialRequests: "የመስኮት ጎን",
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    employeeId: "emp-004",
    employeeName: "ሄለን ገብረ",
  },
  {
    id: "res-003",
    reservationNumber: "RES-003",
    customerName: "ሚካኤል አበበ",
    customerPhone: "+251911345678",
    partySize: 6,
    reservationDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // ትናንት
    reservationTime: "20:00",
    duration: 120,
    status: "completed",
    tableId: "table-005",
    tableNumber: "5",
    seatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
    completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 125 * 60 * 1000),
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
    employeeId: "emp-002",
    employeeName: "ፋጢማ አህመድ",
  },
]

// የጠረጴዛ አስተዳደር ክላስ
export class TableManager {
  private static instance: TableManager
  private tables: Table[] = [...tables]
  private reservations: Reservation[] = [...reservations]
  private reservationCounter = 4

  static getInstance(): TableManager {
    if (!TableManager.instance) {
      TableManager.instance = new TableManager()
    }
    return TableManager.instance
  }

  // ሁሉንም ጠረጴዛዎች ማግኘት
  getAllTables(): Table[] {
    return this.tables.filter((table) => table.isActive)
  }

  // በአይዲ ጠረጴዛ ማግኘት
  getTableById(tableId: string): Table | null {
    return this.tables.find((table) => table.id === tableId) || null
  }

  // የጠረጴዛ ሁኔታ ማዘመን
  updateTableStatus(
    tableId: string,
    status: TableStatus,
    customInfo?: {
      orderId?: string
      customerName?: string
      estimatedDuration?: number
    },
  ): boolean {
    const table = this.tables.find((t) => t.id === tableId)
    if (!table) return false

    table.status = status

    if (status === "occupied" && customInfo) {
      table.currentOrderId = customInfo.orderId
      table.currentCustomer = customInfo.customerName
      table.occupiedAt = new Date()
      table.estimatedDuration = customInfo.estimatedDuration
    } else if (status === "available") {
      table.currentOrderId = undefined
      table.currentCustomer = undefined
      table.occupiedAt = undefined
      table.estimatedDuration = undefined
    }

    return true
  }

  // አዲስ ቦታ ማስያዝ መፍጠር
  createReservation(reservationData: {
    customerName: string
    customerPhone: string
    customerEmail?: string
    partySize: number
    reservationDate: Date
    reservationTime: string
    duration: number
    tableId?: string
    specialRequests?: string
    notes?: string
    employeeId: string
    employeeName: string
  }): Reservation {
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      reservationNumber: `RES-${String(this.reservationCounter++).padStart(3, "0")}`,
      ...reservationData,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // ጠረጴዛ ተመድቧል ከሆነ ሁኔታውን ማዘመን
    if (reservationData.tableId) {
      const table = this.tables.find((t) => t.id === reservationData.tableId)
      if (table) {
        newReservation.tableNumber = table.number
        // የቦታ ማስያዝ ጊዜ ከሆነ ጠረጴዛውን reserved ማድረግ
        const reservationDateTime = new Date(reservationData.reservationDate)
        const [hours, minutes] = reservationData.reservationTime.split(":")
        reservationDateTime.setHours(Number.parseInt(hours), Number.parseInt(minutes))

        const now = new Date()
        const timeDiff = reservationDateTime.getTime() - now.getTime()

        // ቦታ ማስያዝ በ30 ደቂቃ ውስጥ ከሆነ ጠረጴዛውን reserved ማድረግ
        if (timeDiff <= 30 * 60 * 1000 && timeDiff > 0) {
          table.status = "reserved"
        }
      }
    }

    this.reservations.unshift(newReservation)
    return newReservation
  }

  // የቦታ ማስያዝ ሁኔታ ማዘመን
  updateReservationStatus(reservationId: string, status: ReservationStatus): boolean {
    const reservation = this.reservations.find((r) => r.id === reservationId)
    if (!reservation) return false

    reservation.status = status
    reservation.updatedAt = new Date()

    if (status === "seated") {
      reservation.seatedAt = new Date()
      // ጠረጴዛውን occupied ማድረግ
      if (reservation.tableId) {
        this.updateTableStatus(reservation.tableId, "occupied", {
          customerName: reservation.customerName,
          estimatedDuration: reservation.duration,
        })
      }
    } else if (status === "completed") {
      reservation.completedAt = new Date()
      // ጠረጴዛውን available ማድረግ
      if (reservation.tableId) {
        this.updateTableStatus(reservation.tableId, "available")
      }
    } else if (status === "cancelled" || status === "no_show") {
      // ጠረጴዛውን available ማድረግ
      if (reservation.tableId) {
        this.updateTableStatus(reservation.tableId, "available")
      }
    }

    return true
  }

  // ጠረጴዛ ለቦታ ማስያዝ መመደብ
  assignTableToReservation(reservationId: string, tableId: string): boolean {
    const reservation = this.reservations.find((r) => r.id === reservationId)
    const table = this.tables.find((t) => t.id === tableId)

    if (!reservation || !table) return false

    reservation.tableId = tableId
    reservation.tableNumber = table.number
    reservation.updatedAt = new Date()

    return true
  }

  // ሁሉንም ቦታ ማስያዞች ማግኘት
  getAllReservations(): Reservation[] {
    return this.reservations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // በማጣሪያ ቦታ ማስያዞች ማግኘት
  getFilteredReservations(filter: ReservationFilter): Reservation[] {
    let filtered = this.reservations

    if (filter.status && filter.status.length > 0) {
      filtered = filtered.filter((res) => filter.status!.includes(res.status))
    }

    if (filter.date) {
      const filterDate = filter.date.toDateString()
      filtered = filtered.filter((res) => res.reservationDate.toDateString() === filterDate)
    }

    if (filter.timeSlot) {
      filtered = filtered.filter((res) => res.reservationTime === filter.timeSlot)
    }

    if (filter.partySize) {
      filtered = filtered.filter((res) => res.partySize === filter.partySize)
    }

    if (filter.customerName) {
      filtered = filtered.filter((res) => res.customerName.toLowerCase().includes(filter.customerName!.toLowerCase()))
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // በቀን ቦታ ማስያዞች ማግኘት
  getReservationsByDate(date: Date): Reservation[] {
    const targetDate = date.toDateString()
    return this.reservations
      .filter((res) => res.reservationDate.toDateString() === targetDate)
      .sort((a, b) => a.reservationTime.localeCompare(b.reservationTime))
  }

  // ክፍት ጠረጴዛዎች ማግኘት
  getAvailableTables(partySize: number, date?: Date, time?: string): Table[] {
    let availableTables = this.tables.filter(
      (table) => table.isActive && table.status === "available" && table.capacity >= partySize,
    )

    // በቀን እና ጊዜ ማጣራት
    if (date && time) {
      const reservedTableIds = this.reservations
        .filter(
          (res) =>
            res.reservationDate.toDateString() === date.toDateString() &&
            res.reservationTime === time &&
            (res.status === "confirmed" || res.status === "seated"),
        )
        .map((res) => res.tableId)
        .filter(Boolean)

      availableTables = availableTables.filter((table) => !reservedTableIds.includes(table.id))
    }

    return availableTables.sort((a, b) => a.capacity - b.capacity)
  }

  // የጊዜ ክፍሎች ማግኘት
  getTimeSlots(date: Date, partySize: number): TimeSlot[] {
    const timeSlots = [
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
      "21:00",
    ]

    return timeSlots.map((time) => {
      const availableTables = this.getAvailableTables(partySize, date, time)
      const reservationsAtTime = this.reservations.filter(
        (res) =>
          res.reservationDate.toDateString() === date.toDateString() &&
          res.reservationTime === time &&
          (res.status === "confirmed" || res.status === "seated"),
      )

      return {
        time,
        available: availableTables.length > 0,
        tablesAvailable: availableTables.length,
        reservations: reservationsAtTime.length,
      }
    })
  }

  // የጠረጴዛ ስታቲስቲክስ
  getTableStats(dateFrom?: Date, dateTo?: Date): TableStats {
    const totalTables = this.tables.filter((t) => t.isActive).length
    const availableTables = this.tables.filter((t) => t.isActive && t.status === "available").length
    const occupiedTables = this.tables.filter((t) => t.isActive && t.status === "occupied").length
    const reservedTables = this.tables.filter((t) => t.isActive && t.status === "reserved").length

    let filteredReservations = this.reservations
    if (dateFrom) {
      filteredReservations = filteredReservations.filter((res) => res.createdAt >= dateFrom)
    }
    if (dateTo) {
      filteredReservations = filteredReservations.filter((res) => res.createdAt <= dateTo)
    }

    const totalReservations = filteredReservations.length
    const confirmedReservations = filteredReservations.filter(
      (r) => r.status === "confirmed" || r.status === "seated" || r.status === "completed",
    ).length
    const cancelledReservations = filteredReservations.filter((r) => r.status === "cancelled").length
    const noShowReservations = filteredReservations.filter((r) => r.status === "no_show").length

    const averageOccupancyRate = totalTables > 0 ? ((occupiedTables + reservedTables) / totalTables) * 100 : 0

    // አማካይ የመቀመጫ ጊዜ ስሌት
    const completedReservations = filteredReservations.filter(
      (r) => r.status === "completed" && r.seatedAt && r.completedAt,
    )
    const averageTurnoverTime =
      completedReservations.length > 0
        ? completedReservations.reduce((sum, res) => {
            const duration = (res.completedAt!.getTime() - res.seatedAt!.getTime()) / (1000 * 60)
            return sum + duration
          }, 0) / completedReservations.length
        : 0

    // በጠረጴዛ ገቢ (ይህ በእውነተኛ አፕሊኬሽን ውስጥ ከትዕዛዝ ስርዓት ይመጣል)
    const revenueByTable = this.tables
      .filter((t) => t.isActive)
      .map((table) => ({
        tableId: table.id,
        tableNumber: table.number,
        revenue: Math.random() * 5000, // ናሙና ዳታ
        orders: Math.floor(Math.random() * 20),
      }))
      .sort((a, b) => b.revenue - a.revenue)

    return {
      totalTables,
      availableTables,
      occupiedTables,
      reservedTables,
      averageOccupancyRate,
      averageTurnoverTime,
      totalReservations,
      confirmedReservations,
      cancelledReservations,
      noShowReservations,
      revenueByTable,
    }
  }

  // ቦታ ማስያዝ መሰረዝ
  cancelReservation(reservationId: string, reason?: string): boolean {
    const reservation = this.reservations.find((r) => r.id === reservationId)
    if (!reservation) return false

    reservation.status = "cancelled"
    reservation.updatedAt = new Date()
    if (reason) {
      reservation.notes = (reservation.notes || "") + ` | የመሰረዝ ምክንያት: ${reason}`
    }

    // ጠረጴዛውን available ማድረግ
    if (reservation.tableId) {
      this.updateTableStatus(reservation.tableId, "available")
    }

    return true
  }

  // ጠረጴዛ ማስተካከል
  updateTable(tableId: string, updates: Partial<Table>): boolean {
    const table = this.tables.find((t) => t.id === tableId)
    if (!table) return false

    Object.assign(table, updates)
    return true
  }
}

export const tableManager = TableManager.getInstance()
