import { z } from 'zod'

export const createEncuestaSchema = z.object({
  pregunta: z.string().min(1, 'La pregunta es requerida'),
  orden: z.coerce.number().int().default(0),
  estado: z.enum(['ACTIVA', 'CERRADA']).default('ACTIVA'),
  tipo: z.enum(['BINARIA', 'MULTIPLE']).default('MULTIPLE'),
})

export const createOpcionSchema = z.object({
  texto: z.string().min(1, 'El texto es requerido'),
  orden: z.coerce.number().int().default(0),
})