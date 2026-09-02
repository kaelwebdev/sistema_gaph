import { z } from 'zod'

export const createApartmentSchema = z.object({
  number: z.string().min(1, 'El número es requerido'),
  tower: z.string().min(1, 'La torre es requerida'),
  level: z.coerce.number().int().positive('El nivel debe ser positivo'),
  status: z.enum(['PROPIO', 'ARRIENDO', 'VACIO']),
  observations: z.string().optional(),
  inhabitants: z.coerce.number().int().min(0).default(0),
  condominiumId: z.string().min(1, 'El cliente es requerido'),
})

export const updateApartmentSchema = createApartmentSchema.partial()