import type { Permission, UserRole } from "@/types/auth"

// የፈቃድ ዝርዝር
export const permissions: Permission[] = [
  // POS ፈቃዶች
  { id: "pos_view", name: "POS ማየት", description: "የPOS ስርዓት ማየት", module: "pos" },
  { id: "pos_create_order", name: "ትዕዛዝ መፍጠር", description: "አዲስ ትዕዛዝ መፍጠር", module: "pos" },
  { id: "pos_edit_order", name: "ትዕዛዝ ማስተካከል", description: "ያለ ትዕዛዝ ማስተካከል", module: "pos" },
  { id: "pos_cancel_order", name: "ትዕዛዝ መሰረዝ", description: "ትዕዛዝ መሰረዝ", module: "pos" },
  { id: "pos_apply_discount", name: "ቅናሽ መስጠት", description: "በትዕዛዝ ላይ ቅናሽ መስጠት", module: "pos" },

  // የምግብ አስተዳደር ፈቃዶች
  { id: "menu_view", name: "ምናሌ ማየት", description: "የምግብ ምናሌ ማየት", module: "menu" },
  { id: "menu_add", name: "ምግብ መጨመር", description: "አዲስ ምግብ መጨመር", module: "menu" },
  { id: "menu_edit", name: "ምግብ ማስተካከል", description: "ያለ ምግብ ማስተካከል", module: "menu" },
  { id: "menu_delete", name: "ምግብ መሰረዝ", description: "ምግብ ከምናሌ መሰረዝ", module: "menu" },

  // የሪፖርት ፈቃዶች
  { id: "reports_view", name: "ሪፖርት ማየት", description: "የሽያጭ ሪፖርቶች ማየት", module: "reports" },
  { id: "reports_export", name: "ሪፖርት መላክ", description: "ሪፖርቶችን መላክ", module: "reports" },
  { id: "reports_financial", name: "የገንዘብ ሪፖርት", description: "የገንዘብ ሪፖርቶች ማየት", module: "reports" },

  // የሰራተኞች አስተዳደር ፈቃዶች
  { id: "employees_view", name: "ሰራተኞች ማየት", description: "የሰራተኞች ዝርዝር ማየት", module: "employees" },
  { id: "employees_add", name: "ሰራተኛ መጨመር", description: "አዲስ ሰራተኛ መጨመር", module: "employees" },
  { id: "employees_edit", name: "ሰራተኛ ማስተካከል", description: "የሰራተኛ መረጃ ማስተካከል", module: "employees" },
  { id: "employees_delete", name: "ሰራተኛ መሰረዝ", description: "ሰራተኛ መሰረዝ", module: "employees" },

  // የቅንብር ፈቃዶች
  { id: "settings_view", name: "ቅንብሮች ማየት", description: "የስርዓት ቅንብሮች ማየት", module: "settings" },
  { id: "settings_edit", name: "ቅንብሮች ማስተካከል", description: "የስርዓት ቅንብሮች ማስተካከል", module: "settings" },

  // የጠረጴዛ አስተዳደር ፈቃዶች
  { id: "tables_view", name: "ጠረጴዛዎች ማየት", description: "የጠረጴዛ ሁኔታ ማየት", module: "tables" },
  { id: "tables_manage", name: "ጠረጴዛዎች ማስተዳደር", description: "ጠረጴዛዎችን ማስተዳደር", module: "tables" },
]

// የደረጃ ፈቃዶች
export const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    // ሁሉም ፈቃዶች
    ...permissions.map((p) => p.id),
  ],
  manager: [
    "pos_view",
    "pos_create_order",
    "pos_edit_order",
    "pos_cancel_order",
    "pos_apply_discount",
    "menu_view",
    "menu_add",
    "menu_edit",
    "menu_delete",
    "reports_view",
    "reports_export",
    "reports_financial",
    "employees_view",
    "employees_add",
    "employees_edit",
    "tables_view",
    "tables_manage",
    "settings_view",
  ],
  cashier: [
    "pos_view",
    "pos_create_order",
    "pos_edit_order",
    "pos_apply_discount",
    "menu_view",
    "tables_view",
    "reports_view",
  ],
  waiter: ["pos_view", "pos_create_order", "pos_edit_order", "menu_view", "tables_view", "tables_manage"],
  kitchen: ["pos_view", "menu_view", "tables_view"],
  delivery: ["pos_view", "menu_view", "tables_view"],
}

// የደረጃ ስሞች በአማርኛ
export const roleNames: Record<UserRole, string> = {
  admin: "አስተዳዳሪ",
  manager: "ሥራ አስኪያጅ",
  cashier: "ገንዘብ ተቀባይ",
  waiter: "አስተናጋጅ",
  kitchen: "ኩሽና",
  delivery: "አድራሻ",
}
