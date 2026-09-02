import { z } from 'zod'

export const createSurveySchema = z.object({
  question: z.string().min(1, 'La pregunta es requerida'),
  order: z.coerce.number().int().default(0),
  status: z.enum(['ACTIVA', 'CERRADA']).default('ACTIVA'),
  type: z.enum(['BINARIA', 'MULTIPLE']).default('MULTIPLE'),
  assemblyId: z.string(),
})

export const createSurveyOptionSchema = z.object({
  text: z.string().min(1, 'El texto es requerido'),
  order: z.coerce.number().int().default(0),
})