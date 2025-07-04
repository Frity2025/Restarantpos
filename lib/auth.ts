import type { Employee, LoginCredentials, AuthResponse, UserRole } from "@/types/auth"
import { rolePermissions } from "@/config/roles-permissions"

// ናሙና ሰራተኞች (በእውነተኛ አፕሊኬሽን ውስጥ ከዳታቤዝ ይመጣል)
const employees: Employee[] = [
  {
    id: "emp-001",
    firstName: "አበበ",
    lastName: "ከበደ",
    email: "admin@restaurant.com",
    phone: "+251911123456",
    role: "admin",
    password: "admin123", // በእውነተኛ አፕሊኬሽን ውስጥ ይመሰጠራል
    isActive: true,
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
    permissions: [],
    shift: "morning",
    salary: 15000,
    hireDate: new Date("2024-01-01"),
  },
  {
    id: "emp-002",
    firstName: "ፋጢማ",
    lastName: "አህመድ",
    email: "manager@restaurant.com",
    phone: "+251911234567",
    role: "manager",
    password: "manager123",
    isActive: true,
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date(),
    permissions: [],
    shift: "afternoon",
    salary: 12000,
    hireDate: new Date("2024-01-15"),
  },
  {
    id: "emp-003",
    firstName: "ዳዊት",
    lastName: "ተስፋዬ",
    email: "cashier@restaurant.com",
    phone: "+251911345678",
    role: "cashier",
    password: "cashier123",
    isActive: true,
    createdAt: new Date("2024-02-01"),
    permissions: [],
    shift: "morning",
    salary: 8000,
    hireDate: new Date("2024-02-01"),
  },
  {
    id: "emp-004",
    firstName: "ሄለን",
    lastName: "ገብረ",
    email: "waiter@restaurant.com",
    phone: "+251911456789",
    role: "waiter",
    password: "waiter123",
    isActive: true,
    createdAt: new Date("2024-02-15"),
    permissions: [],
    shift: "afternoon",
    salary: 6000,
    hireDate: new Date("2024-02-15"),
  },
]

// የመግቢያ አገልግሎት
export class AuthService {
  private static instance: AuthService
  private currentEmployee: Employee | null = null

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  // መግባት
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // ሰራተኛ መፈለግ
    const employee = employees.find(
      (emp) => emp.email === credentials.email && emp.password === credentials.password && emp.isActive,
    )

    if (!employee) {
      return {
        success: false,
        message: "የተሳሳተ ኢሜይል ወይም የይለፍ ቃል",
      }
    }

    // የመጨረሻ መግቢያ ጊዜ ማዘመን
    employee.lastLogin = new Date()
    this.currentEmployee = employee

    // ፈቃዶችን መጫን
    employee.permissions = this.getEmployeePermissions(employee.role)

    // ቶከን መፍጠር (ለቀላልነት ብቻ)
    const token = `token_${employee.id}_${Date.now()}`

    return {
      success: true,
      employee,
      token,
      message: "በተሳካ ሁኔታ ገብተዋል",
    }
  }

  // መውጣት
  logout(): void {
    this.currentEmployee = null
    localStorage.removeItem("auth_token")
    localStorage.removeItem("current_employee")
  }

  // የአሁኑ ሰራተኛ
  getCurrentEmployee(): Employee | null {
    return this.currentEmployee
  }

  // ሰራተኛ ፈቃድ አለው?
  hasPermission(permissionId: string): boolean {
    if (!this.currentEmployee) return false
    return this.currentEmployee.permissions.some((p) => p.id === permissionId)
  }

  // የሰራተኛ ፈቃዶች
  private getEmployeePermissions(role: UserRole) {
    const permissionIds = rolePermissions[role] || []
    return permissionIds.map((id) => ({ id, name: id, description: "", module: "" }))
  }

  // ሁሉም ሰራተኞች
  getAllEmployees(): Employee[] {
    return employees.filter((emp) => emp.isActive)
  }

  // ሰራተኛ መጨመር
  addEmployee(employeeData: Omit<Employee, "id" | "createdAt" | "permissions">): Employee {
    const newEmployee: Employee = {
      ...employeeData,
      id: `emp-${Date.now()}`,
      createdAt: new Date(),
      permissions: this.getEmployeePermissions(employeeData.role),
    }
    employees.push(newEmployee)
    return newEmployee
  }

  // ሰራተኛ ማስተካከል
  updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    const index = employees.findIndex((emp) => emp.id === id)
    if (index === -1) return null

    employees[index] = { ...employees[index], ...updates }
    if (updates.role) {
      employees[index].permissions = this.getEmployeePermissions(updates.role)
    }
    return employees[index]
  }

  // ሰራተኛ መሰረዝ
  deleteEmployee(id: string): boolean {
    const index = employees.findIndex((emp) => emp.id === id)
    if (index === -1) return false

    employees[index].isActive = false
    return true
  }
}

export const authService = AuthService.getInstance()

// Export the hasPermission function for direct use
export const hasPermission = (permissionId: string): boolean => {
  return authService.hasPermission(permissionId)
}

// Export other utility functions
export const getCurrentEmployee = (): Employee | null => {
  return authService.getCurrentEmployee()
}

export const getAllEmployees = (): Employee[] => {
  return authService.getAllEmployees()
}
