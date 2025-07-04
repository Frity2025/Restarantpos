import type { User, LoginCredentials, AuthState } from "@/types/auth"
import { roleHasPermission } from "@/config/roles-permissions"

// ናሙና ተጠቃሚዎች
const users: User[] = [
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
  private currentUser: User | null = null
  private isAuthenticated = false

  // ግንኙነት
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    // ናሙና ማረጋገጫ - በእውነተኛ አፕሊኬሽን ውስጥ ይህ ወደ ሰርቨር API ይላካል
    const user = users.find((u) => u.username === credentials.username && u.isActive)

    if (!user) {
      return { success: false, error: "የተጠቃሚ ስም ወይም የይለፍ ቃል ስህተት" }
    }

    // ናሙና የይለፍ ቃል ማረጋገጫ (በእውነተኛ አፕሊኬሽን ውስጥ hashed ይሆናል)
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

    // የመጨረሻ ግንኙነት ጊዜ ማዘመን
    user.lastLogin = new Date()
    this.currentUser = user
    this.isAuthenticated = true

    // ወደ localStorage ማስቀመጥ
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_user", JSON.stringify(user))
      localStorage.setItem("auth_token", "sample_token_" + user.id)
    }

    return { success: true, user }
  }

  // መውጣት
  logout(): void {
    this.currentUser = null
    this.isAuthenticated = false

    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_user")
      localStorage.removeItem("auth_token")
    }
  }

  // የአሁኑ ተጠቃሚ ማግኘት
  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser
    }

    // ከ localStorage ማግኘት
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("auth_user")
      const storedToken = localStorage.getItem("auth_token")

      if (storedUser && storedToken) {
        try {
          this.currentUser = JSON.parse(storedUser)
          this.isAuthenticated = true
          return this.currentUser
        } catch (error) {
          console.error("Error parsing stored user:", error)
          this.logout()
        }
      }
    }

    return null
  }

  // ማረጋገጫ ሁኔታ
  getAuthState(): AuthState {
    const user = this.getCurrentUser()
    return {
      isAuthenticated: !!user,
      user,
      isLoading: false,
    }
  }

  // ፈቃድ ማረጋገጥ
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser()
    if (!user) return false

    return roleHasPermission(user.role, permission)
  }

  // ብዙ ፈቃዶች ማረጋገጥ (ማንኛውም አንድ ካለ)
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission))
  }

  // ሁሉም ፈቃዶች ማረጋገጥ
  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission))
  }

  // ሚና ማረጋገጥ
  hasRole(role: string): boolean {
    const user = this.getCurrentUser()
    return user?.role === role
  }

  // አስተዳዳሪ እንደሆነ ማረጋገጥ
  isAdmin(): boolean {
    return this.hasRole("admin")
  }

  // ሁሉንም ተጠቃሚዎች ማግኘት (አስተዳዳሪዎች ብቻ)
  getAllUsers(): User[] {
    if (!this.isAdmin()) {
      throw new Error("Unauthorized: Admin access required")
    }
    return users
  }

  // ተጠቃሚ ማግኘት በመለያ
  getUserById(id: string): User | undefined {
    if (!this.hasPermission("view_employees") && !this.isAdmin()) {
      throw new Error("Unauthorized: Insufficient permissions")
    }
    return users.find((user) => user.id === id)
  }

  // አዲስ ተጠቃሚ መፍጠር
  createUser(userData: Omit<User, "id" | "createdAt" | "lastLogin">): User {
    if (!this.hasPermission("manage_employees")) {
      throw new Error("Unauthorized: Cannot create users")
    }

    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
      lastLogin: null,
    }

    users.push(newUser)
    return newUser
  }

  // ተጠቃሚ ማዘመን
  updateUser(id: string, updates: Partial<User>): User | null {
    if (!this.hasPermission("manage_employees")) {
      throw new Error("Unauthorized: Cannot update users")
    }

    const userIndex = users.findIndex((user) => user.id === id)
    if (userIndex === -1) return null

    users[userIndex] = { ...users[userIndex], ...updates }
    return users[userIndex]
  }

  // ተጠቃሚ ማሰናከል/ማንቃት
  toggleUserStatus(id: string): User | null {
    if (!this.hasPermission("manage_employees")) {
      throw new Error("Unauthorized: Cannot modify user status")
    }

    const user = users.find((user) => user.id === id)
    if (!user) return null

    user.isActive = !user.isActive
    return user
  }
}

// ነጠላ instance መፍጠር
export const authService = new AuthService()

// የተለመዱ exports
export const login = (credentials: LoginCredentials) => authService.login(credentials)
export const logout = () => authService.logout()
export const getCurrentUser = () => authService.getCurrentUser()
export const getAuthState = () => authService.getAuthState()
export const hasPermission = (permission: string) => authService.hasPermission(permission)
export const hasAnyPermission = (permissions: string[]) => authService.hasAnyPermission(permissions)
export const hasAllPermissions = (permissions: string[]) => authService.hasAllPermissions(permissions)
export const hasRole = (role: string) => authService.hasRole(role)
export const isAdmin = () => authService.isAdmin()
