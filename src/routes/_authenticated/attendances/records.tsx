import { createFileRoute } from '@tanstack/react-router'
import Records from '@/features/attendances/records'

export const Route = createFileRoute('/_authenticated/attendances/records')({
  component: Records,
})
