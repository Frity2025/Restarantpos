import type { WaitlistEntry, WaitlistStats, WaitlistFilters } from "@/types/waitlist"

// Sample waitlist data
const waitlistEntries: WaitlistEntry[] = [
  {
    id: "wait-001",
    customerName: "አህመድ አሊ",
    customerPhone: "+251911123456",
    partySize: 4,
    priority: "normal",
    estimatedWaitTime: 25,
    actualWaitTime: 0,
    status: "waiting",
    tablePreference: "outdoor",
    specialRequests: "የልጆች ወንበር ያስፈልጋል",
    notificationPreferences: {
      sms: true,
      call: false,
    },
    location: {
      latitude: 9.0054,
      longitude: 38.7636,
      address: "አዲስ አበባ፣ ቦሌ",
    },
    joinedAt: new Date("2024-01-07T10:30:00"),
    seatedAt: null,
    createdBy: "host-001",
    updatedAt: new Date("2024-01-07T10:30:00"),
  },
  {
    id: "wait-002",
    customerName: "ፋጢማ ሙሳ",
    customerPhone: "+251922234567",
    partySize: 2,
    priority: "high",
    estimatedWaitTime: 15,
    actualWaitTime: 0,
    status: "waiting",
    tablePreference: "indoor",
    specialRequests: "",
    notificationPreferences: {
      sms: true,
      call: true,
    },
    location: {
      latitude: 9.0054,
      longitude: 38.7636,
      address: "አዲስ አበባ፣ ቦሌ",
    },
    joinedAt: new Date("2024-01-07T11:00:00"),
    seatedAt: null,
    createdBy: "host-001",
    updatedAt: new Date("2024-01-07T11:00:00"),
  },
]

class WaitlistService {
  private notificationQueue: Array<{ entryId: string; type: string }> = []

  // Get all waitlist entries
  async getWaitlistEntries(filters?: WaitlistFilters): Promise<WaitlistEntry[]> {
    let filtered = [...waitlistEntries]

    if (filters?.status) {
      filtered = filtered.filter((entry) => entry.status === filters.status)
    }

    if (filters?.priority) {
      filtered = filtered.filter((entry) => entry.priority === filters.priority)
    }

    if (filters?.partySize) {
      filtered = filtered.filter((entry) => entry.partySize === filters.partySize)
    }

    if (filters?.dateRange) {
      const { start, end } = filters.dateRange
      filtered = filtered.filter((entry) => {
        const joinedDate = new Date(entry.joinedAt)
        return joinedDate >= start && joinedDate <= end
      })
    }

    // Sort by priority and join time
    return filtered.sort((a, b) => {
      // High priority first
      if (a.priority === "high" && b.priority !== "high") return -1
      if (b.priority === "high" && a.priority !== "high") return 1

      // Then by join time
      return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
    })
  }

  // Add customer to waitlist
  async addToWaitlist(
    entry: Omit<WaitlistEntry, "id" | "joinedAt" | "updatedAt" | "actualWaitTime">,
  ): Promise<WaitlistEntry> {
    const newEntry: WaitlistEntry = {
      ...entry,
      id: `wait-${Date.now()}`,
      joinedAt: new Date(),
      updatedAt: new Date(),
      actualWaitTime: 0,
      estimatedWaitTime: this.calculateEstimatedWaitTime(entry.partySize, entry.priority),
    }

    waitlistEntries.push(newEntry)
    this.updateAllEstimatedTimes()
    return newEntry
  }

  // Update waitlist entry
  async updateWaitlistEntry(id: string, updates: Partial<WaitlistEntry>): Promise<WaitlistEntry | null> {
    const index = waitlistEntries.findIndex((entry) => entry.id === id)
    if (index === -1) return null

    waitlistEntries[index] = {
      ...waitlistEntries[index],
      ...updates,
      updatedAt: new Date(),
    }

    this.updateAllEstimatedTimes()
    return waitlistEntries[index]
  }

  // Seat customer (remove from waitlist)
  async seatCustomer(id: string, tableId?: string): Promise<WaitlistEntry | null> {
    const entry = waitlistEntries.find((e) => e.id === id)
    if (!entry) return null

    const seatedAt = new Date()
    const actualWaitTime = Math.round((seatedAt.getTime() - entry.joinedAt.getTime()) / (1000 * 60))

    const updatedEntry = await this.updateWaitlistEntry(id, {
      status: "seated",
      seatedAt,
      actualWaitTime,
      assignedTable: tableId,
    })

    this.updateAllEstimatedTimes()
    return updatedEntry
  }

  // Cancel waitlist entry
  async cancelWaitlistEntry(id: string, reason?: string): Promise<WaitlistEntry | null> {
    return this.updateWaitlistEntry(id, {
      status: "cancelled",
      cancelReason: reason,
    })
  }

  // Get waitlist statistics
  async getWaitlistStats(): Promise<WaitlistStats> {
    const activeEntries = waitlistEntries.filter((entry) => entry.status === "waiting")
    const seatedToday = waitlistEntries.filter((entry) => entry.status === "seated" && this.isToday(entry.seatedAt))
    const cancelledToday = waitlistEntries.filter(
      (entry) => entry.status === "cancelled" && this.isToday(entry.updatedAt),
    )

    const totalWaitTime = seatedToday.reduce((sum, entry) => sum + (entry.actualWaitTime || 0), 0)
    const averageWaitTime = seatedToday.length > 0 ? Math.round(totalWaitTime / seatedToday.length) : 0

    return {
      totalWaiting: activeEntries.length,
      averageWaitTime,
      longestWait: Math.max(...activeEntries.map((entry) => this.getCurrentWaitTime(entry)), 0),
      seatedToday: seatedToday.length,
      cancelledToday: cancelledToday.length,
      peakHours: this.calculatePeakHours(),
    }
  }

  // Calculate estimated wait time
  private calculateEstimatedWaitTime(partySize: number, priority: "low" | "normal" | "high"): number {
    let baseTime = 20 // Base wait time in minutes

    // Adjust for party size
    if (partySize >= 6) baseTime += 15
    else if (partySize >= 4) baseTime += 10
    else if (partySize <= 2) baseTime -= 5

    // Adjust for priority
    if (priority === "high") baseTime -= 10
    else if (priority === "low") baseTime += 10

    // Consider current waitlist length
    const waitingCount = waitlistEntries.filter((entry) => entry.status === "waiting").length
    baseTime += waitingCount * 5

    return Math.max(baseTime, 5) // Minimum 5 minutes
  }

  // Update all estimated wait times
  private updateAllEstimatedTimes(): void {
    const waitingEntries = waitlistEntries.filter((entry) => entry.status === "waiting")

    waitingEntries.forEach((entry, index) => {
      const baseTime = this.calculateEstimatedWaitTime(entry.partySize, entry.priority)
      entry.estimatedWaitTime = baseTime + index * 5 // Add 5 minutes per position
    })
  }

  // Get current wait time for an entry
  private getCurrentWaitTime(entry: WaitlistEntry): number {
    return Math.round((new Date().getTime() - entry.joinedAt.getTime()) / (1000 * 60))
  }

  // Check if date is today
  private isToday(date: Date | null): boolean {
    if (!date) return false
    const today = new Date()
    const checkDate = new Date(date)
    return (
      checkDate.getDate() === today.getDate() &&
      checkDate.getMonth() === today.getMonth() &&
      checkDate.getFullYear() === today.getFullYear()
    )
  }

  // Calculate peak hours
  private calculatePeakHours(): string[] {
    const hourCounts: Record<number, number> = {}

    waitlistEntries
      .filter((entry) => this.isToday(entry.joinedAt))
      .forEach((entry) => {
        const hour = entry.joinedAt.getHours()
        hourCounts[hour] = (hourCounts[hour] || 0) + 1
      })

    const sortedHours = Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => `${hour}:00`)

    return sortedHours
  }

  // Send notification to customer
  async sendNotification(entryId: string, message: string, type: "sms" | "call"): Promise<boolean> {
    const entry = waitlistEntries.find((e) => e.id === entryId)
    if (!entry) return false

    // In a real app, this would integrate with SMS/calling service
    console.log(`Sending ${type} to ${entry.customerPhone}: ${message}`)

    // Update notification history
    if (!entry.notificationHistory) {
      entry.notificationHistory = []
    }

    entry.notificationHistory.push({
      type,
      message,
      sentAt: new Date(),
      status: "sent",
    })

    return true
  }

  // Get entry by ID
  async getWaitlistEntry(id: string): Promise<WaitlistEntry | null> {
    return waitlistEntries.find((entry) => entry.id === id) || null
  }

  // Get next customer to be seated
  async getNextCustomer(): Promise<WaitlistEntry | null> {
    const waiting = waitlistEntries
      .filter((entry) => entry.status === "waiting")
      .sort((a, b) => {
        // High priority first
        if (a.priority === "high" && b.priority !== "high") return -1
        if (b.priority === "high" && a.priority !== "high") return 1

        // Then by join time
        return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
      })

    return waiting[0] || null
  }
}

// Create service instance
export const waitlistService = new WaitlistService()

// Export as waitlistManager for backward compatibility
export const waitlistManager = waitlistService

// Default export
export default waitlistService
