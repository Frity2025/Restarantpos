export type WaitlistPriority = "normal" | "high" | "vip" | "elderly" | "disabled"

export type WaitlistStatus = "waiting" | "notified" | "ready" | "seated" | "cancelled" | "no-show"

export interface WaitlistEntry {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  partySize: number
  priority: WaitlistPriority
  estimatedWaitTime: number
  actualWaitTime: number
  status: WaitlistStatus
  tablePreference?: "indoor" | "outdoor" | "any"
  specialRequests?: string
  notificationPreferences: {
    sms: boolean
    call: boolean
  }
  location?: {
    latitude: number
    longitude: number
    address: string
  }
  joinedAt: Date
  seatedAt: Date | null
  createdBy: string
  updatedAt: Date
  createdAt: Date
  assignedTable?: string
  cancelReason?: string
  notificationHistory?: Array<{
    type: "sms" | "call"
    message: string
    sentAt: Date
    status: "sent" | "failed"
  }>
}

export interface WaitlistStats {
  totalWaiting: number
  averageWaitTime: number
  totalSeatedToday: number
  noShowRate: number
}

export interface WaitlistFilters {
  status?: WaitlistStatus
  priority?: WaitlistPriority
  partySize?: number
  dateRange?: {
    start: Date
    end: Date
  }
}
