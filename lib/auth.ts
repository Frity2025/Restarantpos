// Demo authentication data
export const demoEmployees = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    name: "አድሚን ተጠቃሚ",
    role: "admin",
    permissions: ["all"],
  },
  {
    id: "2",
    username: "cashier",
    password: "cashier123",
    name: "ገንዘብ ተቀባይ",
    role: "cashier",
    permissions: ["pos_view", "pos_create", "orders_view", "payments_view"],
  },
  {
    id: "3",
    username: "kitchen",
    password: "kitchen123",
    name: "ኩሽና ሰራተኛ",
    role: "kitchen",
    permissions: ["kitchen_view", "orders_view", "orders_update"],
  },
]

export async function authenticateUser(username: string, password: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const employee = demoEmployees.find((emp) => emp.username === username && emp.password === password)

  if (employee) {
    return {
      success: true,
      employee: {
        id: employee.id,
        name: employee.name,
        role: employee.role,
        permissions: employee.permissions,
      },
    }
  }

  return {
    success: false,
    error: "የተጠቃሚ ስም ወይም የይለፍ ቃል ትክክል አይደለም",
  }
}

export function hasPermission(employee: any, permission: string): boolean {
  if (!employee) return false
  if (employee.role === "admin" || employee.permissions?.includes("all")) return true
  return employee.permissions?.includes(permission) || false
}
