import { z } from 'zod'

export const createAsambleaSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  fecha: z.coerce.date(),
  estado: z.enum(['ABIERTA', 'CERRADA']).default('ABIERTA'),
})

export const updateAsambleaSchema = createAsambleaSchema.partial()