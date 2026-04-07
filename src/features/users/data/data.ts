import {
  Shield,
  UserCheck,
  Briefcase,
  GraduationCap,
  Star,
  User,
  UserMinus,
  Wrench,
  DollarSign,
  Monitor,
  Megaphone,
  FileText,
  Users,
} from 'lucide-react'

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
    // icon: Shield,
  },
  {
    label: 'Employee',
    value: 'EMPLOYEE',
    icon: UserCheck,
  },
] as const

export const positions = [
  {
    label: 'Director',
    value: 'DIRECTOR',
    icon: Star,
  },
  {
    label: 'Manager',
    value: 'MANAGER',
    icon: Briefcase,
  },
  {
    label: 'Supervisor',
    value: 'SUPERVISOR',
    icon: Users,
  },
  {
    label: 'Team Lead',
    value: 'TEAM_LEAD',
    icon: UserCheck,
  },
  {
    label: 'Senior Staff',
    value: 'SENIOR_STAFF',
    icon: User,
  },
  {
    label: 'Staff',
    value: 'STAFF',
    icon: User,
  },
  {
    label: 'Junior Staff',
    value: 'JUNIOR_STAFF',
    icon: UserMinus,
  },
  {
    label: 'HR Specialist',
    value: 'HR_SPECIALIST',
    icon: GraduationCap,
  },
  {
    label: 'Finance Specialist',
    value: 'FINANCE_SPECIALIST',
    icon: DollarSign,
  },
  {
    label: 'IT Specialist',
    value: 'IT_SPECIALIST',
    icon: Monitor,
  },
  {
    label: 'Marketing Specialist',
    value: 'MARKETING_SPECIALIST',
    icon: Megaphone,
  },
  {
    label: 'Intern',
    value: 'INTERN',
    icon: GraduationCap,
  },
  {
    label: 'Contract',
    value: 'CONTRACT',
    icon: FileText,
  },
  {
    label: 'Other',
    value: 'OTHER',
    icon: Wrench,
  },
] as const
