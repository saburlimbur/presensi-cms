import { createFileRoute } from '@tanstack/react-router'
import AttendanceRecords from '@/features/attendances/records'

export const Route = createFileRoute('/_authenticated/attendances/records')({
  component: AttendanceRecords,
})
