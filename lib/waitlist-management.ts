import type { WaitlistEntry, WaitlistStats, WaitlistFilters, WaitlistPriority } from "@/types/waitlist"

// Sample waitlist data
const waitlistEntries: WaitlistEntry[] = [
  {
    id: "wait-001",
    customerName: "አህመድ አሊ",
    customerPhone: "+251911123456",
    customerEmail: "ahmed@email.com",
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
    createdAt: new Date("2024-01-07T10:30:00"),
  },
  {
    id: "wait-002",
    customerName: "ፋጢማ ሙሳ",
    customerPhone: "+251922234567",
    customerEmail: "fatima@email.com",
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
    createdAt: new Date("2024-01-07T11:00:00"),
  },
]

class WaitlistService {
  private notificationQueue: Array<{ entryId: string; type: string }> = []

  // Get all waitlist entries
  getAllWaitlistEntries(filters?: WaitlistFilters): WaitlistEntry[] {
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
      // VIP first
      if (a.priority === "vip" && b.priority !== "vip") return -1
      if (b.priority === "vip" && a.priority !== "vip") return 1

      // Then elderly/disabled
      if (
        (a.priority === "elderly" || a.priority === "disabled") &&
        b.priority !== "elderly" &&
        b.priority !== "disabled"
      )
        return -1
      if (
        (b.priority === "elderly" || b.priority === "disabled") &&
        a.priority !== "elderly" &&
        a.priority !== "disabled"
      )
        return 1

      // Then high priority
      if (a.priority === "high" && b.priority !== "high") return -1
      if (b.priority === "high" && a.priority !== "high") return 1

      // Then by join time
      return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
    })
  }

  // Add customer to waitlist
  addToWaitlist(entry: {
    customerName: string
    customerPhone: string
    customerEmail?: string
    partySize: number
    priority: WaitlistPriority
    specialRequests?: string
  }): WaitlistEntry {
    const newEntry: WaitlistEntry = {
      id: `wait-${Date.now()}`,
      customerName: entry.customerName,
      customerPhone: entry.customerPhone,
      customerEmail: entry.customerEmail || "",
      partySize: entry.partySize,
      priority: entry.priority,
      specialRequests: entry.specialRequests || "",
      estimatedWaitTime: this.calculateEstimatedWaitTime(entry.partySize, entry.priority),
      actualWaitTime: 0,
      status: "waiting",
      tablePreference: "any",
      notificationPreferences: {
        sms: true,
        call: false,
      },
      location: {
        latitude: 9.0054,
        longitude: 38.7636,
        address: "አዲስ አበባ፣ ቦሌ",
      },
      joinedAt: new Date(),
      seatedAt: null,
      createdBy: "host-001",
      updatedAt: new Date(),
      createdAt: new Date(),
    }

    waitlistEntries.push(newEntry)
    this.updateAllEstimatedTimes()
    return newEntry
  }

  // Update waitlist status
  updateWaitlistStatus(id: string, status: "seated" | "cancelled" | "no-show"): WaitlistEntry | null {
    const index = waitlistEntries.findIndex((entry) => entry.id === id)
    if (index === -1) return null

    const entry = waitlistEntries[index]
    const now = new Date()

    if (status === "seated") {
      entry.seatedAt = now
      entry.actualWaitTime = Math.round((now.getTime() - entry.joinedAt.getTime()) / (1000 * 60))
    }

    entry.status = status
    entry.updatedAt = now

    this.updateAllEstimatedTimes()
    return entry
  }

  // Notify customer
  notifyCustomer(id: string): boolean {
    const entry = waitlistEntries.find((e) => e.id === id)
    if (!entry) return false

    entry.status = "notified"
    entry.updatedAt = new Date()

    // In a real app, this would send SMS/call
    console.log(`Notifying ${entry.customerName} at ${entry.customerPhone}`)
    return true
  }

  // Check for available tables
  checkForAvailableTables(): WaitlistEntry[] {
    // Simulate checking for available tables
    const waitingEntries = waitlistEntries.filter((entry) => entry.status === "waiting")
    const readyEntries = waitingEntries.slice(0, 2) // Simulate 2 tables becoming available

    readyEntries.forEach((entry) => {
      entry.status = "ready"
      entry.updatedAt = new Date()
    })

    return readyEntries
  }

  // Get waitlist statistics
  getWaitlistStats(): WaitlistStats {
    const activeEntries = waitlistEntries.filter((entry) => entry.status === "waiting")
    const seatedToday = waitlistEntries.filter((entry) => entry.status === "seated" && this.isToday(entry.seatedAt))
    const cancelledToday = waitlistEntries.filter(
      (entry) => entry.status === "cancelled" && this.isToday(entry.updatedAt),
    )
    const noShowToday = waitlistEntries.filter((entry) => entry.status === "no-show" && this.isToday(entry.updatedAt))

    const totalWaitTime = seatedToday.reduce((sum, entry) => sum + (entry.actualWaitTime || 0), 0)
    const averageWaitTime = seatedToday.length > 0 ? Math.round(totalWaitTime / seatedToday.length) : 0

    const totalToday = seatedToday.length + cancelledToday.length + noShowToday.length
    const noShowRate = totalToday > 0 ? Math.round((noShowToday.length / totalToday) * 100) : 0

    return {
      totalWaiting: activeEntries.length,
      averageWaitTime,
      totalSeatedToday: seatedToday.length,
      noShowRate,
    }
  }

  // Calculate estimated wait time
  private calculateEstimatedWaitTime(partySize: number, priority: WaitlistPriority): number {
    let baseTime = 20 // Base wait time in minutes

    // Adjust for party size
    if (partySize >= 6) baseTime += 15
    else if (partySize >= 4) baseTime += 10
    else if (partySize <= 2) baseTime -= 5

    // Adjust for priority
    if (priority === "vip") baseTime -= 15
    else if (priority === "high" || priority === "elderly" || priority === "disabled") baseTime -= 10

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
}

// Create service instance
export const waitlistService = new WaitlistService()

// Export as waitlistManager for backward compatibility
export const waitlistManager = waitlistService

// Default export
export default waitlistService
