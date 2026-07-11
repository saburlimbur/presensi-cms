import {
  Bell,
  Building2,
  Clock,
  FileBarChart,
  FileText,
  LayoutDashboard,
  MapPin,
  ScrollText,
  Settings,
  Timer,
  Users,
  Wallet,
  Command,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  // user: {
  //   name: 'Admin',
  //   email: 'admin@attendance.com',
  //   avatar: '/avatars/shadcn.jpg',
  // },
  teams: [
    {
      name: 'Attendance Admin',
      logo: Command,
      plan: 'Dashboard Admin',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Employees',
          url: '/employees',
          icon: Users,
        },
        {
          title: 'Departments',
          url: '/departments',
          icon: Building2,
        },
      ],
    },
    {
      title: 'Attendance',
      items: [
        {
          title: 'Reports',
          url: '/attendances/reports',
          icon: FileBarChart,
        },
        {
          title: 'Locations',
          url: '/attendances/locations',
          icon: MapPin,
        },
        {
          title: 'Shifts',
          url: '/attendances/shifts',
          icon: Clock,
        },
      ],
    },
    {
      title: 'Requests',
      items: [
        {
          title: 'Permissions',
          url: '/requests/permissions',
          icon: FileText,
        },
        {
          title: 'Overtime',
          url: '/requests/overtime',
          icon: Timer,
        },
        {
          title: 'Leave Balances',
          url: '/leave-balances',
          icon: Wallet,
        },
      ],
    },
    {
      title: 'System',
      items: [
        {
          title: 'Notifications',
          url: '/notifications',
          icon: Bell,
        },
        {
          title: 'Audit Logs',
          url: '/audit-logs',
          icon: ScrollText,
        },
        {
          title: 'Settings',
          url: '/settings',
          icon: Settings,
        },
      ],
    },
  ],
}
