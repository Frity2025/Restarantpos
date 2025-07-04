import type { Employee, LoginCredentials, AuthResponse } from "@/types/auth"
import { roleHasPermission } from "@/config/roles-permissions"

// Sample employees data
const employees: Employee[] = [
  {
    id: "admin-001",
    username: "admin",
    name: "አስተዳዳሪ",
    email: "admin@restaurant.com",
    role: "admin",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "manager-001",
    username: "manager",
    name: "ሥራ አስኪያጅ አህመድ",
    email: "manager@restaurant.com",
    role: "manager",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "waiter-001",
    username: "waiter1",
    name: "አስተናጋጅ ፋጢማ",
    email: "fatima@restaurant.com",
    role: "waiter",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "kitchen-001",
    username: "chef1",
    name: "ሼፍ ዳዊት",
    email: "dawit@restaurant.com",
    role: "kitchen",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
  {
    id: "host-001",
    username: "host1",
    name: "ተቀባይ ሳራ",
    email: "sara@restaurant.com",
    role: "host",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
  },
]

class AuthService {
  private currentEmployee: Employee | null = null
  private isAuthenticated = false

  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Sample authentication - in real app this would call server API
    const employee = employees.find((e) => e.username === credentials.username && e.isActive)

    if (!employee) {
      return { success: false, error: "የተጠቃሚ ስም ወይም የይለፍ ቃል ስህተት" }
    }

    // Sample password validation (in real app passwords would be hashed)
    const validPasswords: Record<string, string> = {
      admin: "admin123",
      manager: "manager123",
      waiter1: "waiter123",
      chef1: "chef123",
      host1: "host123",
    }

    if (validPasswords[credentials.username] !== credentials.password) {
      return { success: false, error: "የተጠቃሚ ስም ወይም የይለፍ ቃል ስህተት" }
    }

    // Update last login time
    employee.lastLogin = new Date()
    this.currentEmployee = employee
    this.isAuthenticated = true

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_employee", JSON.stringify(employee))
      localStorage.setItem("auth_token", "sample_token_" + employee.id)
    }

    return { success: true, employee, token: "sample_token_" + employee.id }
  }

  // Logout
  logout(): void {
    this.currentEmployee = null
    this.isAuthenticated = false

    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_employee")
      localStorage.removeItem("auth_token")
    }
  }

  // Get current employee
  getCurrentEmployee(): Employee | null {
    if (this.currentEmployee) {
      return this.currentEmployee
    }

    // Try to get from localStorage
    if (typeof window !== "undefined") {
      const storedEmployee = localStorage.getItem("auth_employee")
      const storedToken = localStorage.getItem("auth_token")

      if (storedEmployee && storedToken) {
        try {
          this.currentEmployee = JSON.parse(storedEmployee)
          this.isAuthenticated = true
          return this.currentEmployee
        } catch (error) {
          console.error("Error parsing stored employee:", error)
          this.logout()
        }
      }
    }

    return null
  }

  // Check if authenticated
  isAuth(): boolean {
    return !!this.getCurrentEmployee()
  }

  // Check permission
  hasPermission(permission: string): boolean {
    const employee = this.getCurrentEmployee()
    if (!employee) return false

    return roleHasPermission(employee.role, permission)
  }

  // Check multiple permissions (any one)
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission))
  }

  // Check all permissions
  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission))
  }

  // Check role
  hasRole(role: string): boolean {
    const employee = this.getCurrentEmployee()
    return employee?.role === role
  }

  // Check if admin
  isAdmin(): boolean {
    return this.hasRole("admin")
  }

  // Get all employees (admin only)
  getAllEmployees(): Employee[] {
    if (!this.isAdmin()) {
      throw new Error("Unauthorized: Admin access required")
    }
    return employees
  }

  // Get employee by ID
  getEmployeeById(id: string): Employee | undefined {
    if (!this.hasPermission("view_employees") && !this.isAdmin()) {
      throw new Error("Unauthorized: Insufficient permissions")
    }
    return employees.find((employee) => employee.id === id)
  }

  // Create new employee
  createEmployee(employeeData: Omit<Employee, "id" | "createdAt" | "lastLogin">): Employee {
    if (!this.hasPermission("manage_employees")) {
      throw new Error("Unauthorized: Cannot create employees")
    }

    const newEmployee: Employee = {
      ...employeeData,
      id: `emp-${Date.now()}`,
      createdAt: new Date(),
      lastLogin: null,
    }

    employees.push(newEmployee)
    return newEmployee
  }

  // Update employee
  updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    if (!this.hasPermission("manage_employees")) {
      throw new Error("Unauthorized: Cannot update employees")
    }

    const employeeIndex = employees.findIndex((employee) => employee.id === id)
    if (employeeIndex === -1) return null

    employees[employeeIndex] = { ...employees[employeeIndex], ...updates }
    return employees[employeeIndex]
  }

  // Toggle employee status
  toggleEmployeeStatus(id: string): Employee | null {
    if (!this.hasPermission("manage_employees")) {
      throw new Error("Unauthorized: Cannot modify employee status")
    }

    const employee = employees.find((employee) => employee.id === id)
    if (!employee) return null

    employee.isActive = !employee.isActive
    return employee
  }
}

// Create service instance
export const authService = new AuthService()

// Export common functions
export const login = (credentials: LoginCredentials) => authService.login(credentials)
export const logout = () => authService.logout()
export const getCurrentEmployee = () => authService.getCurrentEmployee()
export const hasPermission = (permission: string) => authService.hasPermission(permission)
export const hasAnyPermission = (permissions: string[]) => authService.hasAnyPermission(permissions)
export const hasAllPermissions = (permissions: string[]) => authService.hasAllPermissions(permissions)
export const hasRole = (role: string) => authService.hasRole(role)
export const isAdmin = () => authService.isAdmin()
