export interface WaitlistEntry {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  partySize: number
  priority: WaitlistPriority
  estimatedWaitTime: number // in minutes
  actualWaitTime?: number
  status: WaitlistStatus
  specialRequests?: string
  createdAt: Date
  notifiedAt?: Date
  seatedAt?: Date
  cancelledAt?: Date
  noShowAt?: Date
}

export type WaitlistPriority = "normal" | "high" | "vip" | "elderly" | "disabled"

export type WaitlistStatus = "waiting" | "notified" | "ready" | "seated" | "cancelled" | "no-show"

export interface WaitlistStats {
  totalWaiting: number
  averageWaitTime: number
  longestWaitTime: number
  totalSeatedToday: number
  noShowRate: number
  priorityBreakdown: Record<WaitlistPriority, number>
}

export interface NotificationPreferences {
  sms: boolean
  call: boolean
  email: boolean
}
