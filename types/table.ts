export interface Table {
  id: string
  number: string
  capacity: number
  status: TableStatus
  location: TableLocation
  shape: TableShape
  currentOrder?: string
  reservedBy?: string
  reservedUntil?: Date
  lastCleaned?: Date
  notes?: string
}

export type TableStatus =
  | "available" // ክፍት
  | "occupied" // የተያዘ
  | "reserved" // የተያዘ ቦታ
  | "cleaning" // እየተጸዳ
  | "maintenance" // በጥገና ላይ

export type TableLocation =
  | "main_hall" // ዋና አዳራሽ
  | "private_room" // የግል ክፍል
  | "outdoor" // ውጪ
  | "bar_area" // የባር አካባቢ

export type TableShape =
  | "round" // ክብ
  | "square" // ካሬ
  | "rectangular" // አራት ማዕዘን

export interface Reservation {
  id: string
  tableId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  partySize: number
  reservationDate: Date
  reservationTime: string
  duration: number // in minutes
  status: ReservationStatus
  specialRequests?: string
  createdAt: Date
  createdBy: string
  notes?: string
  priority: ReservationPriority
}

export type ReservationStatus =
  | "confirmed" // ተረጋግጧል
  | "pending" // በመጠባበቅ ላይ
  | "seated" // ተቀምጧል
  | "completed" // ተጠናቋል
  | "cancelled" // ተሰርዟል
  | "no_show" // አልመጣም

export type ReservationPriority =
  | "normal" // መደበኛ
  | "high" // ከፍተኛ
  | "vip" // ቪአይፒ

export interface TimeSlot {
  time: string
  available: boolean
  tableIds: string[]
}

export interface TableStats {
  totalTables: number
  availableTables: number
  occupiedTables: number
  reservedTables: number
  cleaningTables: number
  occupancyRate: number
  averageTurnoverTime: number
}
