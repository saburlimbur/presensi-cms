import { createFileRoute } from '@tanstack/react-router'
import Overtime from '@/features/requests/overtime'

export const Route = createFileRoute('/_authenticated/requests/overtime/')({
  component: Overtime,
})
