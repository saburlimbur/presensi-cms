import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import Employees from '@/features/employees'
import { positions } from '@/features/users/data/data'

const employeesSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z
    .array(z.union([z.literal('active'), z.literal('inactive')]))
    .optional()
    .catch([]),
  role: z
    .array(z.union([z.literal('ADMIN'), z.literal('EMPLOYEE')]))
    .optional()
    .catch([]),
  position: z
    .array(
      z.enum(
        positions.map((p) => p.value as (typeof positions)[number]['value'])
      )
    )
    .optional()
    .catch([]),
  fullName: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/employees/')({
  validateSearch: employeesSearchSchema,
  component: Employees,
})
