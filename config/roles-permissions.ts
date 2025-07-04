export interface Permission {
  id: string
  name: string
  description: string
  category: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  isActive: boolean
}

export const permissions: Permission[] = [
  // ትዕዛዝ ፈቃዶች
  { id: "view_orders", name: "ትዕዛዞች ማየት", description: "ሁሉንም ትዕዛዞች ማየት", category: "orders" },
  { id: "create_orders", name: "ትዕዛዝ መፍጠር", description: "አዲስ ትዕዛዝ መፍጠር", category: "orders" },
  { id: "edit_orders", name: "ትዕዛዝ ማርትዕ", description: "ያሉ ትዕዛዞችን ማርትዕ", category: "orders" },
  { id: "cancel_orders", name: "ትዕዛዝ መሰረዝ", description: "ትዕዛዞችን መሰረዝ", category: "orders" },
  { id: "process_payments", name: "ክፍያ ማስኬድ", description: "የክፍያ ሂደት ማስኬድ", category: "orders" },

  // ምግብ አስተዳደር ፈቃዶች
  { id: "manage_menu", name: "ምግብ ዝርዝር አስተዳደር", description: "ምግቦችን መጨመር፣ ማርትዕ፣ መሰረዝ", category: "menu" },
  { id: "view_menu", name: "ምግብ ዝርዝር ማየት", description: "ምግብ ዝርዝር ማየት", category: "menu" },
  { id: "manage_categories", name: "ምድቦች አስተዳደር", description: "የምግብ ምድቦች አስተዳደር", category: "menu" },

  // ጠረጴዛ አስተዳደር ፈቃዶች
  { id: "manage_tables", name: "ጠረጴዛዎች አስተዳደር", description: "ጠረጴዛዎችን አስተዳደር", category: "tables" },
  { id: "view_tables", name: "ጠረጴዛዎች ማየት", description: "የጠረጴዛ ሁኔታ ማየት", category: "tables" },
  { id: "assign_tables", name: "ጠረጴዛ መመደብ", description: "ደንበኞችን ጠረጴዛ መመደብ", category: "tables" },

  // ቦታ ማስያዝ ፈቃዶች
  { id: "manage_reservations", name: "ቦታ ማስያዝ አስተዳደር", description: "ቦታ ማስያዝ አስተዳደር", category: "reservations" },
  { id: "view_reservations", name: "ቦታ ማስያዝ ማየት", description: "ቦታ ማስያዞች ማየት", category: "reservations" },
  { id: "create_reservations", name: "ቦታ ማስያዝ መፍጠር", description: "አዲስ ቦታ ማስያዝ መፍጠር", category: "reservations" },

  // ጥበቃ ዝርዝር ፈቃዶች
  { id: "manage_waitlist", name: "ጥበቃ ዝርዝር አስተዳደር", description: "ጥበቃ ዝርዝር ሙሉ አስተዳደር", category: "waitlist" },
  { id: "view_waitlist", name: "ጥበቃ ዝርዝር ማየት", description: "ጥበቃ ዝርዝር ማየት", category: "waitlist" },
  { id: "add_to_waitlist", name: "ወደ ጥበቃ ዝርዝር መጨመር", description: "ደንበኞችን ወደ ጥበቃ ዝርዝር መጨመር", category: "waitlist" },

  // ኩሽና ፈቃዶች
  { id: "kitchen_access", name: "ኩሽና መዳረሻ", description: "የኩሽና ዳሽቦርድ መዳረሻ", category: "kitchen" },
  { id: "update_order_status", name: "የትዕዛዝ ሁኔታ ማዘመን", description: "የትዕዛዝ ሁኔታ ማዘመን", category: "kitchen" },
  { id: "view_kitchen_orders", name: "የኩሽና ትዕዛዞች ማየት", description: "የኩሽና ትዕዛዞች ማየት", category: "kitchen" },

  // ሰራተኛ አስተዳደር ፈቃዶች
  { id: "manage_employees", name: "ሰራተኞች አስተዳደር", description: "ሰራተኞችን አስተዳደር", category: "employees" },
  { id: "view_employees", name: "ሰራተኞች ማየት", description: "የሰራተኞች ዝርዝር ማየት", category: "employees" },
  { id: "manage_roles", name: "ሚናዎች አስተዳደር", description: "የሰራተኛ ሚናዎች አስተዳደር", category: "employees" },

  // ሪፖርት እና ትንተና ፈቃዶች
  { id: "view_analytics", name: "ትንተና ማየት", description: "የንግድ ትንተና እና ሪፖርቶች ማየት", category: "analytics" },
  { id: "view_reports", name: "ሪፖርቶች ማየት", description: "የንግድ ሪፖርቶች ማየት", category: "analytics" },
  { id: "export_data", name: "ዳታ መላክ", description: "ዳታ ወደ ውጭ መላክ", category: "analytics" },

  // ስርዓት አስተዳደር ፈቃዶች
  { id: "admin_access", name: "አስተዳዳሪ መዳረሻ", description: "የስርዓት አስተዳደር መዳረሻ", category: "admin" },
  { id: "manage_settings", name: "ቅንብሮች አስተዳደር", description: "የስርዓት ቅንብሮች አስተዳደር", category: "admin" },
  { id: "view_logs", name: "ሎጎች ማየት", description: "የስርዓት ሎጎች ማየት", category: "admin" },
]

export const roles: Role[] = [
  {
    id: "admin",
    name: "አስተዳዳሪ",
    description: "ሙሉ የስርዓት መዳረሻ ያለው",
    permissions: permissions.map((p) => p.id), // ሁሉንም ፈቃዶች
    isActive: true,
  },
  {
    id: "manager",
    name: "ሥራ አስኪያጅ",
    description: "የንግድ አስተዳደር ፈቃዶች",
    permissions: [
      "view_orders",
      "create_orders",
      "edit_orders",
      "cancel_orders",
      "process_payments",
      "manage_menu",
      "view_menu",
      "manage_categories",
      "manage_tables",
      "view_tables",
      "assign_tables",
      "manage_reservations",
      "view_reservations",
      "create_reservations",
      "manage_waitlist",
      "view_waitlist",
      "add_to_waitlist",
      "view_employees",
      "view_analytics",
      "view_reports",
      "export_data",
    ],
    isActive: true,
  },
  {
    id: "waiter",
    name: "አስተናጋጅ",
    description: "የደንበኛ አገልግሎት ፈቃዶች",
    permissions: [
      "view_orders",
      "create_orders",
      "edit_orders",
      "process_payments",
      "view_menu",
      "view_tables",
      "assign_tables",
      "view_reservations",
      "create_reservations",
      "manage_waitlist",
      "view_waitlist",
      "add_to_waitlist",
    ],
    isActive: true,
  },
  {
    id: "kitchen",
    name: "ኩሽና ሰራተኛ",
    description: "የኩሽና ፈቃዶች",
    permissions: ["kitchen_access", "update_order_status", "view_kitchen_orders", "view_menu"],
    isActive: true,
  },
  {
    id: "cashier",
    name: "ገንዘብ ተቀባይ",
    description: "የክፍያ ሂደት ፈቃዶች",
    permissions: ["view_orders", "process_payments", "view_menu", "view_tables"],
    isActive: true,
  },
  {
    id: "host",
    name: "አስተናጋጅ/ተቀባይ",
    description: "የደንበኛ ተቀባይ ፈቃዶች",
    permissions: [
      "view_tables",
      "assign_tables",
      "manage_reservations",
      "view_reservations",
      "create_reservations",
      "manage_waitlist",
      "view_waitlist",
      "add_to_waitlist",
    ],
    isActive: true,
  },
]

// ሚና በፈቃድ ማግኘት
export function getRoleById(roleId: string): Role | undefined {
  return roles.find((role) => role.id === roleId)
}

// ፈቃድ በመለያ ማግኘት
export function getPermissionById(permissionId: string): Permission | undefined {
  return permissions.find((permission) => permission.id === permissionId)
}

// ሚና ፈቃድ ያለው እንደሆነ ማረጋገጥ
export function roleHasPermission(roleId: string, permissionId: string): boolean {
  const role = getRoleById(roleId)
  return role ? role.permissions.includes(permissionId) : false
}

// በምድብ ፈቃዶች ማግኘት
export function getPermissionsByCategory(category: string): Permission[] {
  return permissions.filter((permission) => permission.category === category)
}

// ንቁ ሚናዎች ማግኘት
export function getActiveRoles(): Role[] {
  return roles.filter((role) => role.isActive)
}
