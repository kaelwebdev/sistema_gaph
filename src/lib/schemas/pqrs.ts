import { z } from 'zod'

export const createPQRSSchema = z.object({
  tipo: z.enum(['PREGUNTA', 'QUEJA', 'RECLAMO', 'SUGERENCIA']),
  asunto: z.string().min(1, 'El asunto es requerido'),
  descripcion: z.string().min(1, 'La descripción es requerida'),
  nombreCompleto: z.string().min(1, 'El nombre completo es requerido'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  torre: z.string().min(1, 'La torre es requerida'),
  numero: z.coerce.number().int('Debe ser un número válido'),
  clienteId: z.string(),
})