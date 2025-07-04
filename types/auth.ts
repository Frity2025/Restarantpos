// የሰራተኞች ደረጃዎች
export type UserRole = "admin" | "manager" | "cashier" | "waiter" | "kitchen" | "delivery"

// የሰራተኛ መረጃ
export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: UserRole
  password: string
  isActive: boolean
  createdAt: Date
  lastLogin?: Date
  permissions: Permission[]
  shift?: "morning" | "afternoon" | "night"
  salary?: number
  hireDate: Date
}

// የፈቃድ አይነቶች
export interface Permission {
  id: string
  name: string
  description: string
  module: string // "pos", "inventory", "reports", "settings", etc.
}

// የመግቢያ መረጃ
export interface LoginCredentials {
  email: string
  password: string
}

// የመግቢያ ምላش
export interface AuthResponse {
  success: boolean
  employee?: Employee
  token?: string
  message: string
}

// የሰራተኛ ስታቲስቲክስ
export interface EmployeeStats {
  totalEmployees: number
  activeEmployees: number
  onlineEmployees: number
  byRole: Record<UserRole, number>
}
