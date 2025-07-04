import { LayoutDashboard, Settings, User, ShoppingCart, Receipt, GitBranch, FileIcon as FileTemplate } from 'lucide-react'

import { Icons } from "@/components/icons"

export interface NavItem {
  title: string
  titleAmharic: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  permissions?: string[]
  label?: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export type SidebarNavItem = NavItem & {
  items?: SidebarNavItem[]
}

export type DocumentationNavItem = NavItem & {
  items?: DocumentationNavItem[]
}

const checkPermissions = (permissions: string[] | undefined, userPermissions: string[] | undefined) => {
  if (!permissions) return true
  if (!userPermissions) return false
  return permissions.every(permission => userPermissions.includes(permission))
}

export const sidebarNavItems: SidebarNavItem[] = [
  {
    title: "Dashboard",
    titleAmharic: "ዳሽቦርድ",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Customers",
    titleAmharic: "ደንበኞች",
    href: "/customers",
    icon: User,
    permissions: ["view_customers"],
  },
  {
    title: "Products",
    titleAmharic: "ምርቶች",
    href: "/products",
    icon: ShoppingCart,
    permissions: ["view_products"],
  },
  {
    title: "Purchase Orders",
    titleAmharic: "የግዢ ትዕዛዞች",
    href: "/purchase-orders",
    icon: Receipt,
    permissions: ["manage_purchase_orders"],
  },
  {
    title: "Purchase Order Workflow",
    titleAmharic: "የግዢ ትዕዛዝ ፍሰት",
    href: "/purchase-orders/workflow",
    icon: GitBranch,
    permissions: ["manage_purchase_orders", "approve_orders"],
  },
  {
    title: "PO Templates",
    titleAmharic: "የግዢ ቅጦች",
    href: "/purchase-orders/templates", 
    icon: FileTemplate,
    permissions: ["manage_purchase_orders"],
  },
  {
    title: "Settings",
    titleAmharic: "ቅንብሮች",
    href: "/settings",
    icon: Settings,
  },
]
