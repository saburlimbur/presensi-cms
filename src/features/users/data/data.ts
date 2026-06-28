import { Shield, UserCheck, User } from 'lucide-react'

export const statusTypes = new Map<string, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  [
    'inactive',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
])

export const roles = [
  {
    label: 'Admin',
    value: 'ADMIN',
    icon: Shield,
  },
  {
    label: 'Employee',
    value: 'EMPLOYEE',
    icon: UserCheck,
  },
] as const

export const positions = [
  {
    label: 'Staff',
    value: 'STAFF',
    icon: User,
  },
] as const
