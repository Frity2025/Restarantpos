import { LayoutDashboard, Users, Settings, Clock } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: any
  permission?: string
}

export const dashboardConfig = {
  sidebarNav: [
    {
      title: "ዳሽቦርድ",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "ተጠቃሚዎች",
      href: "/dashboard/users",
      icon: Users,
      permission: "manage_users",
    },
    {
      title: "የጥበቃ ዝርዝር",
      href: "/waitlist",
      icon: Clock,
      permission: "manage_waitlist",
    },
    {
      title: "ቅንጅቶች",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ] as NavItem[],
}
