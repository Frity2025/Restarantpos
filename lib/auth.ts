import type { Employee } from "@/types/auth"

// Sample employees for demo
const employees: Employee[] = [
  {
    id: "1",
    firstName: "አህመድ",
    lastName: "አሊ",
    email: "admin@restaurant.com",
    phone: "+251911123456",
    role: "admin",
    password: "admin123",
    isActive: true,
    createdAt: new Date(),
    permissions: [],
    hireDate: new Date(),
    name: "አህመድ አሊ",
    username: "admin",
  },
  {
    id: "2",
    firstName: "ፋጢማ",
    lastName: "መሀመድ",
    email: "cashier@restaurant.com",
    phone: "+251911123457",
    role: "cashier",
    password: "cashier123",
    isActive: true,
    createdAt: new Date(),
    permissions: [],
    hireDate: new Date(),
    name: "ፋጢማ መሀመድ",
    username: "cashier",
  },
  {
    id: "3",
    firstName: "ዳዊት",
    lastName: "ተስፋዬ",
    email: "kitchen@restaurant.com",
    phone: "+251911123458",
    role: "kitchen",
    password: "kitchen123",
    isActive: true,
    createdAt: new Date(),
    permissions: [],
    hireDate: new Date(),
    name: "ዳዊት ተስፋዬ",
    username: "kitchen",
  },
]

export async function authenticateUser(username: string, password: string): Promise<Employee | null> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const employee = employees.find((emp) => emp.username === username && emp.password === password && emp.isActive)

  return employee || null
}

export function hasPermission(employee: Employee, permission: string): boolean {
  // Admin has all permissions
  if (employee.role === "admin") return true

  // Define role-based permissions
  const rolePermissions: Record<string, string[]> = {
    cashier: ["pos_view", "orders_view", "payments_view"],
    kitchen: ["kitchen_view", "orders_view"],
    waiter: ["pos_view", "orders_view", "tables_view"],
    manager: ["pos_view", "orders_view", "payments_view", "reports_view", "employees_view"],
  }

  const permissions = rolePermissions[employee.role] || []
  return permissions.includes(permission)
}
