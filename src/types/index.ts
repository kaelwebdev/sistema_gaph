import type {
  Apartamento,
  Persona,
  PersonaApartamento,
  Asamblea,
  ParticipanteAsamblea,
  Encuesta,
  Opcion,
  Voto,
  Comunicado,
  PQRS,
  Cliente,
} from '@/generated/prisma'

export type {
  Apartamento,
  Persona,
  PersonaApartamento,
  Asamblea,
  ParticipanteAsamblea,
  Encuesta,
  Opcion,
  Voto,
  Comunicado,
  PQRS,
  Cliente,
}

export type EstadoApartamento = 'PROPIO' | 'ARRIENDO' | 'VACIO'
export type RolPersona = 'PROPIETARIO' | 'APODERADO' | 'RESIDENTE'
export type EstadoAsambleum = 'ABIERTA' | 'CERRADA'
export type TipoParticipante = 'PROPIETARIO' | 'APODERADO'
export type EstadoEncuesta = 'ACTIVA' | 'CERRADA'
export type TipoEncuesta = 'BINARIA' | 'MULTIPLE'
export type TipoPQRS = 'PREGUNTA' | 'QUEJA' | 'RECLAMO' | 'SUGERENCIA'