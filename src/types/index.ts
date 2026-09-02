// Custom type exports
// For Prisma model types, import directly from '@/generated/prisma/models/{ModelName}'

// Custom enum types
export type ApartmentStatus = 'PROPIO' | 'ARRIENDO' | 'VACIO'
export type PersonRole = 'PROPIETARIO' | 'APODERADO' | 'RESIDENTE'
export type AssemblyStatus = 'ABIERTA' | 'CERRADA'
export type ParticipantType = 'PROPIETARIO' | 'APODERADO'
export type SurveyStatus = 'ACTIVA' | 'CERRADA'
export type SurveyType = 'BINARIA' | 'MULTIPLE'
export type PQRSType = 'PREGUNTA' | 'QUEJA' | 'RECLAMO' | 'SUGERENCIA'
export type PQRSStatus = 'PENDIENTE' | 'RESUELTO' | 'RECHAZADO' | 'SIN_LEER'
