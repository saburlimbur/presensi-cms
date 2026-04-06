import { createFileRoute } from '@tanstack/react-router'
import Locations from '@/features/attendances/locations'

export const Route = createFileRoute('/_authenticated/attendances/locations')({
  component: Locations,
})
