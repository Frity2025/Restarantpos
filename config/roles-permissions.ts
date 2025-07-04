export type Role =
  | "admin"
  | "manager"
  | "kitchen_manager"
  | "finance_manager"
  | "inventory_manager"
  | "department_head"
  | "cashier"
  | "waiter"
  | "kitchen_staff"
  | "viewer"

export type Permission =
  | "manage_orders"
  | "view_orders"
  | "manage_food"
  | "view_food"
  | "manage_employees"
  | "view_employees"
  | "manage_stats"
  | "view_stats"
  | "manage_tables"
  | "view_tables"
  | "manage_reservations"
  | "view_reservations"
  | "manage_waitlist"
  | "view_waitlist"
  | "manage_inventory"
  | "view_inventory"
  | "manage_suppliers"
  | "view_suppliers"
  | "create_purchase_orders"
  | "approve_purchase_orders"
  | "view_purchase_orders"
  | "manage_purchase_templates"
  | "view_financial_reports"
  | "manage_budgets"
  | "approve_high_value_orders"
  | "manage_system_settings"

export const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "manage_orders",
    "view_orders",
    "manage_food",
    "view_food",
    "manage_employees",
    "view_employees",
    "manage_stats",
    "view_stats",
    "manage_tables",
    "view_tables",
    "manage_reservations",
    "view_reservations",
    "manage_waitlist",
    "view_waitlist",
    "manage_inventory",
    "view_inventory",
    "manage_suppliers",
    "view_suppliers",
    "create_purchase_orders",
    "approve_purchase_orders",
    "view_purchase_orders",
    "manage_purchase_templates",
    "view_financial_reports",
    "manage_budgets",
    "approve_high_value_orders",
    "manage_system_settings",
  ],
  manager: [
    "manage_orders",
    "view_orders",
    "manage_food",
    "view_food",
    "view_employees",
    "manage_stats",
    "view_stats",
    "manage_tables",
    "view_tables",
    "manage_reservations",
    "view_reservations",
    "manage_waitlist",
    "view_waitlist",
    "view_inventory",
    "view_suppliers",
    "create_purchase_orders",
    "approve_purchase_orders",
    "view_purchase_orders",
    "view_financial_reports",
  ],
  kitchen_manager: [
    "manage_orders",
    "view_orders",
    "manage_food",
    "view_food",
    "view_stats",
    "manage_inventory",
    "view_inventory",
    "create_purchase_orders",
    "approve_purchase_orders",
    "view_purchase_orders",
  ],
  finance_manager: [
    "view_orders",
    "view_stats",
    "view_inventory",
    "view_suppliers",
    "approve_purchase_orders",
    "view_purchase_orders",
    "view_financial_reports",
    "manage_budgets",
    "approve_high_value_orders",
  ],
  inventory_manager: [
    "view_orders",
    "manage_inventory",
    "view_inventory",
    "manage_suppliers",
    "view_suppliers",
    "create_purchase_orders",
    "view_purchase_orders",
    "manage_purchase_templates",
  ],
  department_head: [
    "view_orders",
    "view_food",
    "view_employees",
    "view_stats",
    "view_tables",
    "view_reservations",
    "view_waitlist",
    "create_purchase_orders",
    "view_purchase_orders",
  ],
  cashier: [
    "manage_orders",
    "view_orders",
    "view_food",
    "view_tables",
    "view_reservations",
    "manage_waitlist",
    "view_waitlist",
  ],
  waiter: [
    "manage_orders",
    "view_orders",
    "view_food",
    "view_tables",
    "manage_reservations",
    "view_reservations",
    "view_waitlist",
  ],
  kitchen_staff: ["view_orders", "view_food", "view_inventory"],
  viewer: ["view_orders", "view_food", "view_stats"],
}

export function roleHasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) || false
}

export function getUserPermissions(role: Role): Permission[] {
  return rolePermissions[role] || []
}

export function userHasPermission(role: Role, permission: Permission): boolean {
  return roleHasPermission(role, permission)
}

export function userHasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((permission) => roleHasPermission(role, permission))
}

export function userHasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((permission) => roleHasPermission(role, permission))
}

export function getApprovalLevel(role: Role): number {
  switch (role) {
    case "admin":
      return 4
    case "manager":
      return 3
    case "finance_manager":
      return 3
    case "kitchen_manager":
      return 2
    case "department_head":
      return 1
    default:
      return 0
  }
}

export function canApproveAmount(role: Role, amount: number): boolean {
  switch (role) {
    case "admin":
      return true // Can approve any amount
    case "manager":
    case "finance_manager":
      return amount <= 50000 // Up to 50,000 ETB
    case "kitchen_manager":
      return amount <= 15000 // Up to 15,000 ETB
    case "department_head":
      return amount <= 5000 // Up to 5,000 ETB
    default:
      return false
  }
}
