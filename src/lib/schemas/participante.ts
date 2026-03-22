import { z } from 'zod'

export const createParticipanteSchema = z.object({
  apartamentoId: z.string().min(1, 'El apartamento es requerido'),
  personaId: z.string().min(1, 'La persona es requerida'),
  tipo: z.enum(['PROPIETARIO', 'APODERADO']),
})

export const personaApartamentoSchema = z.object({
  rol: z.enum(['PROPIETARIO', 'APODERADO', 'RESIDENTE']),
  estadoActivo: z.boolean().default(true),
})