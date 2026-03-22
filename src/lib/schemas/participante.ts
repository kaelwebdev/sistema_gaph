import { z } from 'zod'

export const createParticipanteSchema = z.object({
  cedula: z.string().min(1, 'La cédula es requerida'),
  torre: z.string().min(1, 'La torre es requerida'),
  numero: z.string().min(1, 'El número de apartamento es requerido'),
  tipo: z.enum(['PROPIETARIO', 'APODERADO']),
})

export const personaApartamentoSchema = z.object({
  rol: z.enum(['PROPIETARIO', 'APODERADO', 'RESIDENTE']),
  estadoActivo: z.boolean().default(true),
})