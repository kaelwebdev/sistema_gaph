import { z } from 'zod'

export const createApartamentoSchema = z.object({
  numero: z.string().min(1, 'El número es requerido'),
  torre: z.string().min(1, 'La torre es requerida'),
  nivel: z.coerce.number().int().positive('El nivel debe ser positivo'),
  estado: z.enum(['PROPIO', 'ARRIENDO', 'VACIO']),
  observaciones: z.string().optional(),
  habitantes: z.coerce.number().int().min(0).default(0),
  clienteId: z.string().min(1, 'El cliente es requerido'),
})

export const updateApartamentoSchema = createApartamentoSchema.partial()