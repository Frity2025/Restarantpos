// የጠረጴዛ ሁኔታዎች
export type TableStatus =
  | "available" // ክፍት
  | "occupied" // የተያዘ
  | "reserved" // የተያዘ ቦታ
  | "cleaning" // እየተጸዳ
  | "maintenance" // በጥገና ላይ

// የጠረጴዛ አይነቶች
export type TableType = "regular" | "vip" | "outdoor" | "bar" | "private"

// የጠረጴዛ መረጃ
export interface Table {
  id: string
  number: string
  capacity: number
  type: TableType
  status: TableStatus
  location: {
    x: number // የX መጋጠሚያ
    y: number // የY መጋጠሚያ
    width: number
    height: number
  }
  currentOrderId?: string
  currentCustomer?: string
  occupiedAt?: Date
  estimatedDuration?: number // በደቂቃ
  features: string[] // ["window_view", "quiet", "accessible", etc.]
  isActive: boolean
}

// የቦታ ማስያዝ ሁኔታዎች
export type ReservationStatus =
  | "pending" // በመጠባበቅ ላይ
  | "confirmed" // ተረጋግጧል
  | "seated" // ተቀምጧል
  | "completed" // ተጠናቋል
  | "cancelled" // ተሰርዟል
  | "no_show" // አልመጣም

// የቦታ ማስያዝ መረጃ
export interface Reservation {
  id: string
  reservationNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  partySize: number
  reservationDate: Date
  reservationTime: string
  duration: number // በደቂቃ
  status: ReservationStatus
  tableId?: string
  tableNumber?: string
  specialRequests?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  seatedAt?: Date
  completedAt?: Date
  employeeId: string
  employeeName: string
  reminderSent?: boolean
}

// የጠረጴዛ ስታቲስቲክስ
export interface TableStats {
  totalTables: number
  availableTables: number
  occupiedTables: number
  reservedTables: number
  averageOccupancyRate: number
  averageTurnoverTime: number
  totalReservations: number
  confirmedReservations: number
  cancelledReservations: number
  noShowReservations: number
  revenueByTable: Array<{
    tableId: string
    tableNumber: string
    revenue: number
    orders: number
  }>
}

// የቦታ ማስያዝ ማጣሪያ
export interface ReservationFilter {
  status?: ReservationStatus[]
  date?: Date
  timeSlot?: string
  partySize?: number
  customerName?: string
}

// የጊዜ ክፍል
export interface TimeSlot {
  time: string
  available: boolean
  tablesAvailable: number
  reservations: number
}
