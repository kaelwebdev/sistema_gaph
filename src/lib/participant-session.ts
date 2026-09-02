export interface ApartmentCookie {
  id: string
  numero: string
  torre: string
}

export interface ParticipantSession {
  personaId: string
  cedula: string
  nombre: string
  apartments: ApartmentCookie[]
  ultimoApartmentId: string | null
  ultimoApartmentTorre: string | null
  ultimoApartmentNumero: string | null
}

const COOKIE_NAME = 'participant_session'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

/**
 * Read participant session from cookie (client-side)
 * Returns null if cookie doesn't exist or is invalid
 */
export function getParticipantSession(): ParticipantSession | null {
  if (typeof document === 'undefined') return null

  const cookieStr = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`))

  if (!cookieStr) return null

  try {
    const value = cookieStr.split('=')[1]
    return JSON.parse(decodeURIComponent(value)) as ParticipantSession
  } catch {
    return null
  }
}

/**
 * Write participant session to cookie (client-side)
 * Expires in 30 days
 */
export function setParticipantSession(data: ParticipantSession): void {
  if (typeof document === 'undefined') return

  const value = encodeURIComponent(JSON.stringify(data))
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${MAX_AGE}; samesite=strict`
}

/**
 * Clear participant session cookie
 */
export function clearParticipantSession(): void {
  if (typeof document === 'undefined') return

  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; samesite=strict`
}
