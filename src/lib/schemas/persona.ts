import { z } from 'zod'

export const createPersonaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  cedula: z.string().min(1, 'La cédula es requerida'),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  clienteId: z.string().min(1, 'El cliente es requerido'),
})

export const updatePersonaSchema = createPersonaSchema.partial()