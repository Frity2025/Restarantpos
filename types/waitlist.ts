export interface WaitlistEntry {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  partySize: number
  priority: WaitlistPriority
  status: WaitlistStatus
  estimatedWaitTime: number
  actualWaitTime?: number
  specialRequests?: string
  createdAt: Date
  updatedAt: Date
  notifiedAt?: Date
  seatedAt?: Date
  tableAssigned?: string
  createdBy: string
}

export type WaitlistPriority = "normal" | "high" | "vip" | "elderly" | "disabled"

export type WaitlistStatus = "waiting" | "notified" | "ready" | "seated" | "cancelled" | "no-show"

export interface WaitlistStats {
  totalWaiting: number
  totalNotified: number
  totalSeatedToday: number
  totalCancelledToday: number
  totalNoShowToday: number
  averageWaitTime: number
  longestWaitTime: number
  noShowRate: number
  priorityBreakdown: {
    normal: number
    high: number
    vip: number
    elderly: number
    disabled: number
  }
}

export interface WaitlistNotification {
  id: string
  entryId: string
  type: "sms" | "call" | "email"
  message: string
  sentAt: Date
  status: "pending" | "sent" | "failed"
}
