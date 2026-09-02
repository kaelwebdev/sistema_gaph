import { z } from 'zod'

export const createPersonSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  idNumber: z.string().min(1, 'La cédula es requerida'),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  condominiumId: z.string().min(1, 'El cliente es requerido'),
})

export const updatePersonSchema = createPersonSchema.partial()