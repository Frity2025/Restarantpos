// የጥበቃ ዝርዝር ሁኔታዎች
export type WaitlistStatus =
  | "waiting" // በመጠባበቅ ላይ
  | "notified" // ተነግሮታል
  | "seated" // ተቀምጧል
  | "cancelled" // ተሰርዟል
  | "no_show" // አልመጣም

// የጥበቃ ዝርዝር ቅድሚያ
export type WaitlistPriority =
  | "normal" // መደበኛ
  | "high" // ከፍተኛ
  | "vip" // ቪአይፒ
  | "elderly" // አረጋውያን
  | "disability" // የአካል ጉዳተኞች

// የጥበቃ ዝርዝር ግቤት
export interface WaitlistEntry {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  partySize: number
  preferredTableType?: string[]
  specialRequests?: string
  priority: WaitlistPriority
  status: WaitlistStatus
  estimatedWaitTime: number // በደቂቃ
  joinedAt: Date
  notifiedAt?: Date
  seatedAt?: Date
  tableAssigned?: string
  notes?: string
  createdBy: string
  updatedAt: Date
}

// የጥበቃ ዝርዝር ስታቲስቲክስ
export interface WaitlistStats {
  totalWaiting: number
  averageWaitTime: number
  longestWaitTime: number
  totalServedToday: number
  noShowRate: number
  priorityBreakdown: Record<WaitlistPriority, number>
}

// የጥበቃ ዝርዝር ማጣሪያ
export interface WaitlistFilter {
  status?: WaitlistStatus[]
  priority?: WaitlistPriority[]
  partySize?: number
  dateFrom?: Date
  dateTo?: Date
}

// የጥበቃ ዝርዝር ማሳወቂያ
export interface WaitlistNotification {
  id: string
  waitlistEntryId: string
  type: "table_ready" | "position_update" | "reminder"
  message: string
  sentAt: Date
  method: "sms" | "call" | "app"
  status: "sent" | "delivered" | "failed"
}
