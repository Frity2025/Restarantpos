const permissions = [
  "create",
  "read",
  "update",
  "delete",
  "manage_users",
  "view_analytics",
  "manage_settings",
  "manage_waitlist",
  "view_waitlist_stats",
]

const rolePermissions = {
  admin: [
    "create",
    "read",
    "update",
    "delete",
    "manage_users",
    "view_analytics",
    "manage_settings",
    "manage_waitlist",
    "view_waitlist_stats",
  ],
  manager: ["create", "read", "update", "delete", "view_analytics", "manage_waitlist", "view_waitlist_stats"],
  cashier: ["read", "create", "update", "manage_waitlist"],
  waiter: ["read", "update", "view_waitlist_stats"],
}

export { permissions, rolePermissions }
