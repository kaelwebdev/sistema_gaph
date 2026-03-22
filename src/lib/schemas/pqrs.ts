import { z } from 'zod'

export const createPQRSSchema = z.object({
  tipo: z.enum(['PREGUNTA', 'QUEJA', 'RECLAMO', 'SUGERENCIA']),
  descripcion: z.string().min(1, 'La descripción es requerida'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
})