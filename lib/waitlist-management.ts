import type { WaitlistEntry, WaitlistPriority, WaitlistStatus, WaitlistStats } from "@/types/waitlist"
import { tableManager } from "@/lib/table-management"

class WaitlistService {
  private waitlistEntries: WaitlistEntry[] = []
  private notificationQueue: Array<{ entryId: string; type: string }> = []

  // ወደ ጥበቃ ዝርዝር መጨመር
  addToWaitlist(data: {
    customerName: string
    customerPhone: string
    customerEmail?: string
    partySize: number
    priority?: WaitlistPriority
    specialRequests?: string
    createdBy: string
  }): WaitlistEntry {
    const estimatedWaitTime = this.calculateEstimatedWaitTime(data.partySize, data.priority || "normal")

    const entry: WaitlistEntry = {
      id: `waitlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      partySize: data.partySize,
      priority: data.priority || "normal",
      status: "waiting",
      estimatedWaitTime,
      specialRequests: data.specialRequests,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: data.createdBy,
    }

    this.waitlistEntries.unshift(entry)
    this.sortWaitlistByPriority()
    return entry
  }

  // ሁሉንም ጥበቃ ዝርዝር ግቤቶች ማግኘት
  getAllWaitlistEntries(): WaitlistEntry[] {
    return this.waitlistEntries.sort((a, b) => {
      // በቅድሚያ እና በጊዜ መደርደር
      const priorityOrder = { vip: 0, elderly: 1, disabled: 1, high: 2, normal: 3 }
      const aPriority = priorityOrder[a.priority]
      const bPriority = priorityOrder[b.priority]

      if (aPriority !== bPriority) {
        return aPriority - bPriority
      }

      return a.createdAt.getTime() - b.createdAt.getTime()
    })
  }

  // እየጠበቁ ያሉ ግቤቶች ማግኘት
  getWaitingEntries(): WaitlistEntry[] {
    return this.getAllWaitlistEntries().filter((entry) => entry.status === "waiting" || entry.status === "notified")
  }

  // የጥበቃ ዝርዝር ሁኔታ ማዘመን
  updateWaitlistStatus(id: string, status: WaitlistStatus, tableId?: string): boolean {
    const entry = this.waitlistEntries.find((e) => e.id === id)
    if (!entry) return false

    const oldStatus = entry.status
    entry.status = status
    entry.updatedAt = new Date()

    switch (status) {
      case "notified":
        entry.notifiedAt = new Date()
        break
      case "seated":
        entry.seatedAt = new Date()
        entry.tableAssigned = tableId
        if (entry.createdAt) {
          entry.actualWaitTime = Math.floor((new Date().getTime() - entry.createdAt.getTime()) / (1000 * 60))
        }
        break
      case "cancelled":
      case "no-show":
        // ምንም ተጨማሪ እርምጃ አያስፈልግም
        break
    }

    return true
  }

  // ደንበኛ ማሳወቅ
  notifyCustomer(id: string): boolean {
    const entry = this.waitlistEntries.find((e) => e.id === id)
    if (!entry || entry.status !== "waiting") return false

    entry.status = "notified"
    entry.notifiedAt = new Date()
    entry.updatedAt = new Date()

    // በእውነተኛ አፕሊኬሽን ውስጥ እዚህ SMS/ስልክ ጥሪ ይላካል
    console.log(`ደንበኛ ${entry.customerName} (${entry.customerPhone}) ተማሳወቀ`)

    return true
  }

  // ክፍት ጠረጴዛዎች ማረጋገጥ
  checkForAvailableTables(): WaitlistEntry[] {
    const waitingEntries = this.getWaitingEntries().filter((entry) => entry.status === "waiting")
    const availableTables = tableManager.getTablesByStatus("available")
    const notifiedEntries: WaitlistEntry[] = []

    for (const entry of waitingEntries) {
      const suitableTable = availableTables.find((table) => table.capacity >= entry.partySize)
      if (suitableTable) {
        this.notifyCustomer(entry.id)
        notifiedEntries.push(entry)
        // ጠረጴዛውን ከዝርዝር ማስወገድ ሌሎች ደንበኞች እንዳይመደቡበት
        const tableIndex = availableTables.indexOf(suitableTable)
        if (tableIndex > -1) {
          availableTables.splice(tableIndex, 1)
        }
      }
    }

    return notifiedEntries
  }

  // የጥበቃ ጊዜ ስሌት
  private calculateEstimatedWaitTime(partySize: number, priority: WaitlistPriority): number {
    const baseWaitTime = 30 // 30 ደቂቃ መሰረታዊ ጥበቃ ጊዜ
    const partySizeMultiplier = Math.max(1, partySize / 4) // ትልቅ ቡድን ብዙ ጊዜ ይጠብቃል
    const priorityMultiplier = this.getPriorityMultiplier(priority)

    const waitingAhead = this.getWaitingEntries().length
    const queueMultiplier = waitingAhead * 0.5 // እያንዳንዱ ሰው በፊት 30 ሰከንድ ይጨምራል

    return Math.round(baseWaitTime * partySizeMultiplier * priorityMultiplier + queueMultiplier)
  }

  private getPriorityMultiplier(priority: WaitlistPriority): number {
    switch (priority) {
      case "vip":
        return 0.5 // ቪአይፒ ደንበኞች ግማሽ ጊዜ ይጠብቃሉ
      case "elderly":
      case "disabled":
        return 0.7 // አረጋውያን እና የአካል ጉዳተኞች ቅነሳ ያገኛሉ
      case "high":
        return 0.8 // ከፍተኛ ቅድሚያ ያላቸው ትንሽ ቅነሳ ያገኛሉ
      default:
        return 1.0 // መደበኛ ጥበቃ ጊዜ
    }
  }

  // የጥበቃ ዝርዝር ቦታ ማግኘት
  getWaitlistPosition(id: string): number {
    const waitingEntries = this.getWaitingEntries()
    const index = waitingEntries.findIndex((entry) => entry.id === id)
    return index >= 0 ? index + 1 : 0
  }

  // ስታቲስቲክስ ማግኘት
  getWaitlistStats(): WaitlistStats {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayEntries = this.waitlistEntries.filter((entry) => entry.createdAt >= today && entry.createdAt < tomorrow)

    const totalWaiting = this.waitlistEntries.filter((entry) => entry.status === "waiting").length
    const totalNotified = this.waitlistEntries.filter((entry) => entry.status === "notified").length
    const totalSeatedToday = todayEntries.filter((entry) => entry.status === "seated").length
    const totalCancelledToday = todayEntries.filter((entry) => entry.status === "cancelled").length
    const totalNoShowToday = todayEntries.filter((entry) => entry.status === "no-show").length

    const completedEntries = todayEntries.filter((entry) => entry.actualWaitTime !== undefined)
    const averageWaitTime =
      completedEntries.length > 0
        ? Math.round(
            completedEntries.reduce((sum, entry) => sum + (entry.actualWaitTime || 0), 0) / completedEntries.length,
          )
        : 0

    const longestWaitTime =
      completedEntries.length > 0 ? Math.max(...completedEntries.map((entry) => entry.actualWaitTime || 0)) : 0

    const totalCompleted = totalSeatedToday + totalCancelledToday + totalNoShowToday
    const noShowRate = totalCompleted > 0 ? Math.round((totalNoShowToday / totalCompleted) * 100) : 0

    const priorityBreakdown = {
      normal: this.waitlistEntries.filter((entry) => entry.priority === "normal").length,
      high: this.waitlistEntries.filter((entry) => entry.priority === "high").length,
      vip: this.waitlistEntries.filter((entry) => entry.priority === "vip").length,
      elderly: this.waitlistEntries.filter((entry) => entry.priority === "elderly").length,
      disabled: this.waitlistEntries.filter((entry) => entry.priority === "disabled").length,
    }

    return {
      totalWaiting,
      totalNotified,
      totalSeatedToday,
      totalCancelledToday,
      totalNoShowToday,
      averageWaitTime,
      longestWaitTime,
      noShowRate,
      priorityBreakdown,
    }
  }

  // የጥበቃ ዝርዝር በቅድሚያ መደርደር
  private sortWaitlistByPriority(): void {
    this.waitlistEntries.sort((a, b) => {
      // በቅድሚያ እና በጊዜ መደርደር
      const priorityOrder = { vip: 0, elderly: 1, disabled: 1, high: 2, normal: 3 }
      const aPriority = priorityOrder[a.priority]
      const bPriority = priorityOrder[b.priority]

      if (aPriority !== bPriority) {
        return aPriority - bPriority
      }

      return a.createdAt.getTime() - b.createdAt.getTime()
    })
  }

  // ጥበቃ ዝርዝር ማጽዳት (ለቀን መጨረሻ)
  clearCompletedEntries(olderThanDays = 7): number {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

    const initialLength = this.waitlistEntries.length
    this.waitlistEntries = this.waitlistEntries.filter(
      (entry) =>
        entry.createdAt > cutoffDate ||
        entry.status === "waiting" ||
        entry.status === "notified" ||
        entry.status === "ready",
    )

    return initialLength - this.waitlistEntries.length
  }
}

export const waitlistService = new WaitlistService()
