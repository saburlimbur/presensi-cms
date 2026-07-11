import { createFileRoute } from '@tanstack/react-router'
import LeaveBalances from '@/features/leave-balances'

export const Route = createFileRoute('/_authenticated/leave-balances')({
  component: LeaveBalances,
})
