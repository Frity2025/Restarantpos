import type {
  WaitlistEntry,
  WaitlistStatus,
  WaitlistPriority,
  WaitlistStats,
  WaitlistFilter,
  WaitlistNotification,
} from "@/types/waitlist"
import type { Table } from "@/types/table"
import { tableManager } from "./table-management"

class WaitlistManager {
  private static instance: WaitlistManager
  private waitlist: WaitlistEntry[] = []
  private notifications: WaitlistNotification[] = []
  private waitlistCounter = 1

  static getInstance(): WaitlistManager {
    if (!WaitlistManager.instance) {
      WaitlistManager.instance = new WaitlistManager()
    }
    return WaitlistManager.instance
  }

  // የጥበቃ ዝርዝር ግቤት መፍጠር
  addToWaitlist(entryData: {
    customerName: string
    customerPhone: string
    customerEmail?: string
    partySize: number
    preferredTableType?: string[]
    specialRequests?: string
    priority?: WaitlistPriority
    createdBy: string
  }): WaitlistEntry {
    const estimatedWaitTime = this.calculateEstimatedWaitTime(entryData.partySize, entryData.priority || "normal")

    const newEntry: WaitlistEntry = {
      id: `waitlist-${Date.now()}-${this.waitlistCounter++}`,
      ...entryData,
      priority: entryData.priority || "normal",
      status: "waiting",
      estimatedWaitTime,
      joinedAt: new Date(),
      updatedAt: new Date(),
    }

    // ቅድሚያ መሰረት ማስገባት
    this.insertByPriority(newEntry)
    this.updateAllEstimatedWaitTimes()

    return newEntry
  }

  // በቅድሚያ መሰረት ማስገባት
  private insertByPriority(entry: WaitlistEntry): void {
    const priorityOrder: Record<WaitlistPriority, number> = {
      vip: 1,
      elderly: 2,
      disability: 3,
      high: 4,
      normal: 5,
    }

    let insertIndex = this.waitlist.length
    for (let i = 0; i < this.waitlist.length; i++) {
      if (
        this.waitlist[i].status === "waiting" &&
        priorityOrder[entry.priority] < priorityOrder[this.waitlist[i].priority]
      ) {
        insertIndex = i
        break
      }
    }

    this.waitlist.splice(insertIndex, 0, entry)
  }

  // የጥበቃ ዝርዝር ሁኔታ ማዘመን
  updateWaitlistStatus(entryId: string, status: WaitlistStatus, tableId?: string): boolean {
    const entry = this.waitlist.find((e) => e.id === entryId)
    if (!entry) return false

    entry.status = status
    entry.updatedAt = new Date()

    if (status === "notified") {
      entry.notifiedAt = new Date()
      if (tableId) {
        entry.tableAssigned = tableId
      }
    } else if (status === "seated") {
      entry.seatedAt = new Date()
      if (tableId) {
        entry.tableAssigned = tableId
        // ጠረጴዛውን occupied ማድረግ
        tableManager.updateTableStatus(tableId, "occupied", {
          customerName: entry.customerName,
          estimatedDuration: 90, // ነባሪ 90 ደቂቃ
        })
      }
    }

    this.updateAllEstimatedWaitTimes()
    return true
  }

  // ሁሉንም የጥበቃ ዝርዝር ማግኘት
  getAllWaitlist(): WaitlistEntry[] {
    return this.waitlist.sort((a, b) => {
      // በቅድሚያ እና በጊዜ ደርድር
      const priorityOrder: Record<WaitlistPriority, number> = {
        vip: 1,
        elderly: 2,
        disability: 3,
        high: 4,
        normal: 5,
      }

      if (a.status !== b.status) {
        if (a.status === "waiting") return -1
        if (b.status === "waiting") return 1
      }

      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff

      return a.joinedAt.getTime() - b.joinedAt.getTime()
    })
  }

  // በመጠባበቅ ላይ ያሉትን ማግኘት
  getWaitingEntries(): WaitlistEntry[] {
    return this.waitlist.filter((entry) => entry.status === "waiting")
  }

  // በማጣሪያ የጥበቃ ዝርዝር ማግኘት
  getFilteredWaitlist(filter: WaitlistFilter): WaitlistEntry[] {
    let filtered = this.waitlist

    if (filter.status && filter.status.length > 0) {
      filtered = filtered.filter((entry) => filter.status!.includes(entry.status))
    }

    if (filter.priority && filter.priority.length > 0) {
      filtered = filtered.filter((entry) => filter.priority!.includes(entry.priority))
    }

    if (filter.partySize) {
      filtered = filtered.filter((entry) => entry.partySize === filter.partySize)
    }

    if (filter.dateFrom) {
      filtered = filtered.filter((entry) => entry.joinedAt >= filter.dateFrom!)
    }

    if (filter.dateTo) {
      filtered = filtered.filter((entry) => entry.joinedAt <= filter.dateTo!)
    }

    return filtered
  }

  // የጥበቃ ዝርዝር ቦታ ማግኘት
  getWaitlistPosition(entryId: string): number {
    const waitingEntries = this.getWaitingEntries()
    const index = waitingEntries.findIndex((entry) => entry.id === entryId)
    return index >= 0 ? index + 1 : -1
  }

  // የጥበቃ ጊዜ ስሌት
  private calculateEstimatedWaitTime(partySize: number, priority: WaitlistPriority): number {
    const baseWaitTime = 15 // ነባሪ 15 ደቂቃ
    const partySizeMultiplier = Math.max(1, partySize / 4) // ትልቅ ቡድን ለመጠበቅ ይችላል
    const priorityMultiplier = priority === "vip" ? 0.5 : priority === "high" ? 0.7 : 1

    const waitingAhead = this.getWaitingEntries().length
    const averageTurnoverTime = 45 // አማካይ የጠረጴዛ ተለዋዋጭነት

    return Math.round(
      (baseWaitTime + waitingAhead * (averageTurnoverTime / 3)) * partySizeMultiplier * priorityMultiplier,
    )
  }

  // ሁሉንም የጥበቃ ጊዜዎች ማዘመን
  private updateAllEstimatedWaitTimes(): void {
    const waitingEntries = this.getWaitingEntries()
    waitingEntries.forEach((entry, index) => {
      const baseTime = index * 15 // እያንዳንዱ ቦታ 15 ደቂቃ
      const priorityMultiplier = entry.priority === "vip" ? 0.5 : entry.priority === "high" ? 0.7 : 1
      entry.estimatedWaitTime = Math.round(baseTime * priorityMultiplier)
    })
  }

  // ክፍት ጠረጴዛ ሲኖር ራስ-ሰር ማሳወቅ
  checkForAvailableTables(): WaitlistEntry[] {
    const waitingEntries = this.getWaitingEntries()
    const availableTables = tableManager.getTablesByStatus("available")
    const notifiedEntries: WaitlistEntry[] = []

    for (const entry of waitingEntries) {
      const suitableTable = this.findSuitableTable(entry, availableTables)
      if (suitableTable) {
        this.updateWaitlistStatus(entry.id, "notified", suitableTable.id)
        this.sendNotification(entry, "table_ready", `ጠረጴዛ ${suitableTable.number} ዝግጁ ነው!`)
        notifiedEntries.push(entry)
      }
    }

    return notifiedEntries
  }

  // ተስማሚ ጠረጴዛ ማግኘት
  private findSuitableTable(entry: WaitlistEntry, availableTables: Table[]): Table | null {
    // በአቅም ማጣራት
    let suitableTables = availableTables.filter((table) => table.capacity >= entry.partySize)

    // በተመራጭ አይነት ማጣራት
    if (entry.preferredTableType && entry.preferredTableType.length > 0) {
      const preferredTables = suitableTables.filter((table) =>
        entry.preferredTableType!.some((type) => table.type === type),
      )
      if (preferredTables.length > 0) {
        suitableTables = preferredTables
      }
    }

    // በአቅም ቅርበት ደርድር (ትንሹን ተስማሚ ጠረጴዛ ምረጥ)
    suitableTables.sort((a, b) => a.capacity - b.capacity)

    return suitableTables[0] || null
  }

  // ማሳወቂያ መላክ
  private sendNotification(entry: WaitlistEntry, type: string, message: string): void {
    const notification: WaitlistNotification = {
      id: `notification-${Date.now()}`,
      waitlistEntryId: entry.id,
      type: type as any,
      message,
      sentAt: new Date(),
      method: "sms", // በእውነተኛ አፕሊኬሽን ውስጥ ይህ ተለዋዋጭ ይሆናል
      status: "sent",
    }

    this.notifications.push(notification)
    console.log(`ማሳወቂያ ተልኳል ለ ${entry.customerName}: ${message}`)
  }

  // የጥበቃ ዝርዝር ስታቲስቲክስ
  getWaitlistStats(): WaitlistStats {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayEntries = this.waitlist.filter((entry) => entry.joinedAt >= today)
    const waitingEntries = this.getWaitingEntries()
    const seatedToday = todayEntries.filter((entry) => entry.status === "seated")
    const noShowToday = todayEntries.filter((entry) => entry.status === "no_show")

    const waitTimes = seatedToday
      .filter((entry) => entry.seatedAt)
      .map((entry) => (entry.seatedAt!.getTime() - entry.joinedAt.getTime()) / (1000 * 60))

    const averageWaitTime = waitTimes.length > 0 ? waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length : 0

    const longestWaitTime = waitTimes.length > 0 ? Math.max(...waitTimes) : 0

    const priorityBreakdown: Record<WaitlistPriority, number> = {
      normal: 0,
      high: 0,
      vip: 0,
      elderly: 0,
      disability: 0,
    }

    waitingEntries.forEach((entry) => {
      priorityBreakdown[entry.priority]++
    })

    return {
      totalWaiting: waitingEntries.length,
      averageWaitTime: Math.round(averageWaitTime),
      longestWaitTime: Math.round(longestWaitTime),
      totalServedToday: seatedToday.length,
      noShowRate: todayEntries.length > 0 ? (noShowToday.length / todayEntries.length) * 100 : 0,
      priorityBreakdown,
    }
  }

  // የጥበቃ ዝርዝር ግቤት ማስወገድ
  removeFromWaitlist(entryId: string): boolean {
    const index = this.waitlist.findIndex((entry) => entry.id === entryId)
    if (index >= 0) {
      this.waitlist.splice(index, 1)
      this.updateAllEstimatedWaitTimes()
      return true
    }
    return false
  }

  // የጥበቃ ዝርዝር ግቤት ማዘመን
  updateWaitlistEntry(entryId: string, updates: Partial<WaitlistEntry>): boolean {
    const entry = this.waitlist.find((e) => e.id === entryId)
    if (!entry) return false

    Object.assign(entry, updates, { updatedAt: new Date() })
    this.updateAllEstimatedWaitTimes()
    return true
  }

  // ማሳወቂያዎች ማግኘት
  getNotifications(entryId?: string): WaitlistNotification[] {
    if (entryId) {
      return this.notifications.filter((n) => n.waitlistEntryId === entryId)
    }
    return this.notifications.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())
  }
}

export const waitlistManager = WaitlistManager.getInstance()
