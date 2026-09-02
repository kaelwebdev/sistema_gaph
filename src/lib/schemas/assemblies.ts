import { z } from 'zod'

export const createAssemblySchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  date: z.coerce.date(),
  status: z.enum(['ABIERTA', 'CERRADA']).default('ABIERTA'),
})

export const updateAssemblySchema = createAssemblySchema.partial()