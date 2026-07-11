import { z } from 'zod'

export const locationSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string().nullable().optional(),
  latitude: z.number(),
  longitude: z.number(),
  radius: z.number(),
  isActive: z.boolean(),
  createdAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
})
export type Location = z.infer<typeof locationSchema>

export const locationFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  // tanpa z.coerce / .default supaya tipe input == output schema; konversi
  // angka dari <input type="number"> ditangani di field onChange.
  address: z.string().max(255).optional().or(z.literal('')),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().int().min(1).max(10000),
  isActive: z.boolean(),
})
export type LocationFormValues = z.infer<typeof locationFormSchema>
