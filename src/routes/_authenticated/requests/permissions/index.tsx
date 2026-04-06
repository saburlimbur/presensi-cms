import { createFileRoute } from '@tanstack/react-router'
import Permissions from '@/features/requests/permissions'

export const Route = createFileRoute('/_authenticated/requests/permissions/')({
  component: Permissions,
})
