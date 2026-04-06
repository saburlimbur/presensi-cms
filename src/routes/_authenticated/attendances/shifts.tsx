import { createFileRoute } from '@tanstack/react-router'
import Shifts from '@/features/attendances/shifts'

export const Route = createFileRoute('/_authenticated/attendances/shifts')({
  component: Shifts,
})
