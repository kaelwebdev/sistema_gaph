import { z } from 'zod'

export const createPQRSSchema = z.object({
  type: z.enum(['PREGUNTA', 'QUEJA', 'RECLAMO', 'SUGERENCIA']),
  subject: z.string().min(1, 'El asunto es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  fullName: z.string().min(1, 'El nombre completo es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  tower: z.string().min(1, 'La torre es requerida'),
  number: z.coerce.number().int('Debe ser un número válido'),
  condominiumId: z.string(),
})