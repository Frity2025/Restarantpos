import type { WaitlistEntry, WaitlistPriority, WaitlistStatus, WaitlistStats } from "@/types/waitlist"
import { tableService } from "./table-management"

// ናሙና የጥበቃ ዝርዝር ውሂብ
let waitlistEntries: WaitlistEntry[] = [
  {
    id: "wait-001",
    customerName: "አልማዝ ተስፋዬ",
    customerPhone: "+251911111111",
    customerEmail: "almaz@email.com",
    partySize: 4,
    priority: "normal",
    estimatedWaitTime: 25,
    status: "waiting",
    specialRequests: "የልጆች ወንበር ያስፈልጋል",
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
  },
  {
    id: "wait-002",
    customerName: "ሳሙኤል ገብረ",
    customerPhone: "+251922222222",
    partySize: 2,
    priority: "vip",
    estimatedWaitTime: 10,
    status: "notified",
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    notifiedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  },
]

export class WaitlistService {
  private static instance: WaitlistService

  static getInstance(): WaitlistService {
    if (!WaitlistService.instance) {
      WaitlistService.instance = new WaitlistService()
    }
    return WaitlistService.instance
  }

  // ወደ ጥበቃ ዝርዝር መጨመር
  addToWaitlist(entry: Omit<WaitlistEntry, "id" | "createdAt" | "estimatedWaitTime" | "status">): WaitlistEntry {
    const newEntry: WaitlistEntry = {
      ...entry,
      id: `wait-${Date.now()}`,
      createdAt: new Date(),
      estimatedWaitTime: this.calculateEstimatedWaitTime(entry.partySize, entry.priority),
      status: "waiting",
    }

    // የቅድሚያ መሰረት ማስገባት
    const insertIndex = this.findInsertPosition(newEntry)
    waitlistEntries.splice(insertIndex, 0, newEntry)

    return newEntry
  }

  // ሁሉም የጥበቃ ዝርዝር ማግኘት
  getAllWaitlistEntries(): WaitlistEntry[] {
    return waitlistEntries.sort((a, b) => {
      // በቅድሚያ እና በጊዜ ማስተካከል
      const priorityOrder = { vip: 0, elderly: 1, disabled: 1, high: 2, normal: 3 }
      const aPriority = priorityOrder[a.priority]
      const bPriority = priorityOrder[b.priority]

      if (aPriority !== bPriority) {
        return aPriority - bPriority
      }

      return a.createdAt.getTime() - b.createdAt.getTime()
    })
  }

  // የሚጠብቁ ደንበኞች ብቻ
  getWaitingEntries(): WaitlistEntry[] {
    return this.getAllWaitlistEntries().filter((entry) => entry.status === "waiting" || entry.status === "notified")
  }

  // የጥበቃ ዝርዝር ሁኔታ ማዘመን
  updateWaitlistStatus(id: string, status: WaitlistStatus): WaitlistEntry | null {
    const entry = waitlistEntries.find((e) => e.id === id)
    if (!entry) return null

    entry.status = status

    switch (status) {
      case "notified":
        entry.notifiedAt = new Date()
        break
      case "seated":
        entry.seatedAt = new Date()
        entry.actualWaitTime = Math.floor((new Date().getTime() - entry.createdAt.getTime()) / (1000 * 60))
        break
      case "cancelled":
        entry.cancelledAt = new Date()
        break
      case "no-show":
        entry.noShowAt = new Date()
        break
    }

    return entry
  }

  // ደንበኛ ማሳወቅ
  notifyCustomer(id: string): boolean {
    const entry = waitlistEntries.find((e) => e.id === id)
    if (!entry || entry.status !== "waiting") return false

    // ማሳወቂያ ላክ (በእውነተኛ አፕሊኬሽን ውስጥ SMS/ስልክ ጥሪ)
    console.log(`ደንበኛ ${entry.customerName} ተማሳወቀ - ስልክ: ${entry.customerPhone}`)

    this.updateWaitlistStatus(id, "notified")
    return true
  }

  // ራስ-ሰር ማሳወቂያ ፍተሻ
  checkForAvailableTables(): WaitlistEntry[] {
    const availableTables = tableService.getAvailableTables()
    const waitingEntries = this.getWaitingEntries().filter((e) => e.status === "waiting")
    const notifiedEntries: WaitlistEntry[] = []

    for (const entry of waitingEntries) {
      const suitableTable = availableTables.find(
        (table) => table.capacity >= entry.partySize && table.capacity <= entry.partySize + 2, // ትንሽ ተለዋዋጭነት
      )

      if (suitableTable) {
        this.notifyCustomer(entry.id)
        notifiedEntries.push(entry)
      }
    }

    return notifiedEntries
  }

  // የጥበቃ ጊዜ ስሌት
  private calculateEstimatedWaitTime(partySize: number, priority: WaitlistPriority): number {
    let baseTime = 20 // መሰረታዊ የጥበቃ ጊዜ በደቂቃ

    // የቡድን መጠን ተጽእኖ
    if (partySize > 4) baseTime += 10
    if (partySize > 6) baseTime += 10

    // የቅድሚያ ተጽእኖ
    switch (priority) {
      case "vip":
        baseTime *= 0.5
        break
      case "elderly":
      case "disabled":
        baseTime *= 0.7
        break
      case "high":
        baseTime *= 0.8
        break
    }

    // የአሁኑ ጥበቃ ዝርዝር ተጽእኖ
    const waitingCount = this.getWaitingEntries().length
    baseTime += waitingCount * 5

    return Math.max(5, Math.round(baseTime))
  }

  // የማስገቢያ ቦታ ፍለጋ
  private findInsertPosition(newEntry: WaitlistEntry): number {
    const priorityOrder = { vip: 0, elderly: 1, disabled: 1, high: 2, normal: 3 }
    const newPriority = priorityOrder[newEntry.priority]

    for (let i = 0; i < waitlistEntries.length; i++) {
      const currentPriority = priorityOrder[waitlistEntries[i].priority]
      if (newPriority < currentPriority) {
        return i
      }
    }

    return waitlistEntries.length
  }

  // ስታቲስቲክስ
  getWaitlistStats(): WaitlistStats {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayEntries = waitlistEntries.filter((entry) => entry.createdAt >= today)

    const seatedEntries = todayEntries.filter((entry) => entry.status === "seated")
    const noShowEntries = todayEntries.filter((entry) => entry.status === "no-show")
    const waitingEntries = this.getWaitingEntries()

    const totalWaitTimes = seatedEntries.filter((entry) => entry.actualWaitTime).map((entry) => entry.actualWaitTime!)

    const averageWaitTime =
      totalWaitTimes.length > 0 ? totalWaitTimes.reduce((sum, time) => sum + time, 0) / totalWaitTimes.length : 0

    const longestWaitTime = totalWaitTimes.length > 0 ? Math.max(...totalWaitTimes) : 0

    const priorityBreakdown = waitingEntries.reduce(
      (acc, entry) => {
        acc[entry.priority] = (acc[entry.priority] || 0) + 1
        return acc
      },
      {} as Record<WaitlistPriority, number>,
    )

    return {
      totalWaiting: waitingEntries.length,
      averageWaitTime: Math.round(averageWaitTime),
      longestWaitTime,
      totalSeatedToday: seatedEntries.length,
      noShowRate: todayEntries.length > 0 ? Math.round((noShowEntries.length / todayEntries.length) * 100) : 0,
      priorityBreakdown,
    }
  }

  // ጥበቃ ዝርዝር ማጽዳት (ያለፉ ግቤቶች)
  cleanupOldEntries(): void {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    waitlistEntries = waitlistEntries.filter(
      (entry) =>
        entry.createdAt > oneDayAgo ||
        (entry.status !== "seated" && entry.status !== "cancelled" && entry.status !== "no-show"),
    )
  }

  // ደንበኛ ማስወገድ
  removeFromWaitlist(id: string): boolean {
    const index = waitlistEntries.findIndex((e) => e.id === id)
    if (index === -1) return false

    waitlistEntries.splice(index, 1)
    return true
  }
}

export const waitlistService = WaitlistService.getInstance()
