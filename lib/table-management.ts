import type { Table, Reservation, TableStatus, TimeSlot, TableStats, ReservationStatus } from "@/types/table"

class TableManager {
  private tables: Table[] = [
    {
      id: "table-001",
      number: "1",
      capacity: 2,
      status: "available",
      location: "main_hall",
      shape: "round",
    },
    {
      id: "table-002",
      number: "2",
      capacity: 4,
      status: "occupied",
      location: "main_hall",
      shape: "square",
      currentOrder: "order-001",
    },
    {
      id: "table-003",
      number: "3",
      capacity: 6,
      status: "reserved",
      location: "main_hall",
      shape: "rectangular",
      reservedBy: "reservation-001",
      reservedUntil: new Date(Date.now() + 2 * 60 * 60 * 1000),
    },
    {
      id: "table-004",
      number: "4",
      capacity: 4,
      status: "available",
      location: "main_hall",
      shape: "round",
    },
    {
      id: "table-005",
      number: "5",
      capacity: 8,
      status: "cleaning",
      location: "private_room",
      shape: "rectangular",
    },
  ]

  private reservations: Reservation[] = [
    {
      id: "reservation-001",
      tableId: "table-003",
      customerName: "አበበ ከበደ",
      customerPhone: "+251911123456",
      customerEmail: "abebe@email.com",
      partySize: 4,
      reservationDate: new Date(),
      reservationTime: "19:00",
      duration: 120,
      status: "confirmed",
      specialRequests: "የልደት በዓል",
      createdAt: new Date(),
      createdBy: "emp-001",
      priority: "normal",
    },
    {
      id: "reservation-002",
      tableId: "table-001",
      customerName: "ፋጢማ አህመድ",
      customerPhone: "+251922234567",
      partySize: 2,
      reservationDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      reservationTime: "18:30",
      duration: 90,
      status: "pending",
      createdAt: new Date(),
      createdBy: "emp-002",
      priority: "high",
    },
  ]

  // Table Management
  getAllTables(): Table[] {
    return this.tables
  }

  getTableById(id: string): Table | undefined {
    return this.tables.find((table) => table.id === id)
  }

  getTablesByStatus(status: TableStatus): Table[] {
    return this.tables.filter((table) => table.status === status)
  }

  updateTableStatus(tableId: string, status: TableStatus): boolean {
    const table = this.getTableById(tableId)
    if (table) {
      table.status = status
      if (status === "cleaning") {
        table.lastCleaned = new Date()
      }
      return true
    }
    return false
  }

  assignTableToOrder(tableId: string, orderId: string): boolean {
    const table = this.getTableById(tableId)
    if (table && table.status === "available") {
      table.status = "occupied"
      table.currentOrder = orderId
      return true
    }
    return false
  }

  // Reservation Management
  getAllReservations(): Reservation[] {
    return this.reservations.sort(
      (a, b) => new Date(a.reservationDate).getTime() - new Date(b.reservationDate).getTime(),
    )
  }

  getReservationById(id: string): Reservation | undefined {
    return this.reservations.find((reservation) => reservation.id === id)
  }

  getTodayReservations(): Reservation[] {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return this.reservations.filter((reservation) => {
      const reservationDate = new Date(reservation.reservationDate)
      return reservationDate >= today && reservationDate < tomorrow
    })
  }

  createReservation(reservationData: Omit<Reservation, "id" | "createdAt">): Reservation {
    const newReservation: Reservation = {
      ...reservationData,
      id: `reservation-${Date.now()}`,
      createdAt: new Date(),
    }

    this.reservations.push(newReservation)

    // Reserve the table if confirmed
    if (newReservation.status === "confirmed") {
      this.reserveTable(newReservation.tableId, newReservation.id)
    }

    return newReservation
  }

  updateReservationStatus(reservationId: string, status: ReservationStatus): boolean {
    const reservation = this.getReservationById(reservationId)
    if (reservation) {
      const oldStatus = reservation.status
      reservation.status = status

      // Handle table status changes
      if (oldStatus === "confirmed" && status === "cancelled") {
        this.unreserveTable(reservation.tableId)
      } else if (status === "seated") {
        this.updateTableStatus(reservation.tableId, "occupied")
      } else if (status === "completed") {
        this.updateTableStatus(reservation.tableId, "cleaning")
      }

      return true
    }
    return false
  }

  private reserveTable(tableId: string, reservationId: string): boolean {
    const table = this.getTableById(tableId)
    if (table) {
      table.status = "reserved"
      table.reservedBy = reservationId
      return true
    }
    return false
  }

  private unreserveTable(tableId: string): boolean {
    const table = this.getTableById(tableId)
    if (table && table.status === "reserved") {
      table.status = "available"
      table.reservedBy = undefined
      table.reservedUntil = undefined
      return true
    }
    return false
  }

  // Availability Checking
  getAvailableTimeSlots(date: Date, partySize: number): TimeSlot[] {
    const timeSlots: TimeSlot[] = []
    const startHour = 17 // 5 PM
    const endHour = 22 // 10 PM

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        const availableTables = this.getAvailableTablesForTime(date, time, partySize)

        timeSlots.push({
          time,
          available: availableTables.length > 0,
          tableIds: availableTables.map((table) => table.id),
        })
      }
    }

    return timeSlots
  }

  private getAvailableTablesForTime(date: Date, time: string, partySize: number): Table[] {
    return this.tables.filter((table) => {
      // Check capacity
      if (table.capacity < partySize) return false

      // Check if table has conflicting reservation
      const hasConflict = this.reservations.some((reservation) => {
        if (reservation.tableId !== table.id) return false
        if (reservation.status === "cancelled") return false

        const reservationDate = new Date(reservation.reservationDate)
        const isSameDate = reservationDate.toDateString() === date.toDateString()

        if (!isSameDate) return false

        // Check time overlap
        const reservationStart = this.timeToMinutes(reservation.reservationTime)
        const reservationEnd = reservationStart + reservation.duration
        const requestedTime = this.timeToMinutes(time)
        const requestedEnd = requestedTime + 120 // Default 2 hours

        return requestedTime < reservationEnd && requestedEnd > reservationStart
      })

      return !hasConflict
    })
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  // Statistics
  getTableStats(): TableStats {
    const totalTables = this.tables.length
    const availableTables = this.getTablesByStatus("available").length
    const occupiedTables = this.getTablesByStatus("occupied").length
    const reservedTables = this.getTablesByStatus("reserved").length
    const cleaningTables = this.getTablesByStatus("cleaning").length

    const occupancyRate = ((occupiedTables + reservedTables) / totalTables) * 100

    return {
      totalTables,
      availableTables,
      occupiedTables,
      reservedTables,
      cleaningTables,
      occupancyRate,
      averageTurnoverTime: 90, // minutes - this would be calculated from historical data
    }
  }

  // Smart table suggestions
  suggestBestTable(partySize: number, preferences?: string[]): Table | null {
    const availableTables = this.getTablesByStatus("available")
      .filter((table) => table.capacity >= partySize)
      .sort((a, b) => {
        // Prefer tables that match party size closely
        const aDiff = a.capacity - partySize
        const bDiff = b.capacity - partySize
        return aDiff - bDiff
      })

    return availableTables[0] || null
  }
}

export const tableManager = new TableManager()
