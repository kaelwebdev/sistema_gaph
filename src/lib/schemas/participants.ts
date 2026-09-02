import { z } from 'zod'

export const createParticipantSchema = z.object({
  idNumber: z.string().min(1, 'La cédula es requerida'),
  tower: z.string().min(1, 'La torre es requerida'),
  number: z.string().min(1, 'El número de apartment es requerido'),
  type: z.enum(['PROPIETARIO', 'APODERADO']),
})

export const personApartmentSchema = z.object({
  role: z.enum(['PROPIETARIO', 'APODERADO', 'RESIDENTE']),
  isActive: z.boolean().default(true),
})