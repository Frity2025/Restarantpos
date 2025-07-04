"use client"

import { useState, useEffect } from "react"
import { tableManager } from "@/lib/table-management"
import type { Reservation, ReservationStatus, ReservationFilter } from "@/types/table"

const statusNames: Record<ReservationStatus, string> = {
  pending: "በመጠባበቅ ላይ",
  confirmed: "ተረጋግጧል",
  seated: "ተቀምጧል",
  completed: "ተጠናቋል",
  cancelled: "ተሰርዟል",
  no_show: "አልመጣም",
}

const statusColors: Record<ReservationStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  seated: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-orange-100 text-orange-800",
}

export function ReservationManagement() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [filter, setFilter] = useState<ReservationFilter>({
    status: [],
    date: new Date(),
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadReservations()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [reservations, searchTerm, filter])

  const loadReservations = () => {
    const allReservations = tableManager.getAllReservations()
    setReservations(allReservations)
  }

  const applyFilters = () => {
    let filtered = tableManager.getFilteredReservations(filter)

    if (searchTerm) {
      filtered = filtered.filter(
        (reservation) =>
          reservation.reservationNumber.toLowerCase().includes\
