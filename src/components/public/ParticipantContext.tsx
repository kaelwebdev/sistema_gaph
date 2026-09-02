'use client'

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import {
  getParticipantSession,
  setParticipantSession,
  clearParticipantSession,
  ParticipantSession,
  ApartmentCookie,
} from '@/lib/participant-session'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Apartment {
  id: string
  numero: string
  torre: string
}

export interface Person {
  id: string
  nombre: string
  cedula: string
  apartments: Apartment[]
}

export interface ParticipantState {
  person: Person | null
  apartments: Apartment[]
  apartmentActual: Apartment | null
  isIdentificado: boolean
  isLoading: boolean
}

type ParticipantAction =
  | { type: 'SET_PERSONA'; payload: Person }
  | { type: 'SET_APARTAMENTO_ACTUAL'; payload: Apartment }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR' }
  | { type: 'RESET_TO_APARTMENT_SELECTION' } // keep person, reset apartment

// ─── Reducer ─────────────────────────────────────────────────────────────────

const initialState: ParticipantState = {
  person: null,
  apartments: [],
  apartmentActual: null,
  isIdentificado: false,
  isLoading: true,
}

function participanteReducer(
  state: ParticipantState,
  action: ParticipantAction
): ParticipantState {
  switch (action.type) {
    case 'SET_PERSONA':
      return {
        ...state,
        person: action.payload,
        apartments: action.payload.apartments,
        apartmentActual: null,
        isIdentificado: false,
      }
    case 'SET_APARTAMENTO_ACTUAL':
      return {
        ...state,
        apartmentActual: action.payload,
        isIdentificado: true,
      }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'CLEAR':
      return { ...initialState, isLoading: false }
    case 'RESET_TO_APARTMENT_SELECTION':
      return {
        ...state,
        apartmentActual: null,
        isIdentificado: false,
      }
    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface ParticipantContextValue {
  state: ParticipantState
  setPersona: (person: Person) => void
  setApartmentActual: (apartment: Apartment) => void
  resetToApartmentSelection: () => void
  clear: () => void
}

const ParticipantContext = createContext<ParticipantContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

interface ParticipantProviderProps {
  children: ReactNode
  /** Pre-fill context from server-side session data (optional) */
  initialSession?: ParticipantSession | null
}

export function ParticipantProvider({
  children,
  initialSession,
}: ParticipantProviderProps) {
  const [state, dispatch] = useReducer(participanteReducer, initialState)

  // Initialize from cookie on mount (only if no initialSession provided)
  useEffect(() => {
    if (initialSession) {
      // Server-side session available — hydrate context
      const person: Person = {
        id: initialSession.personaId,
        nombre: initialSession.nombre,
        cedula: initialSession.cedula,
        apartments: initialSession.apartments as Apartment[],
      }
      dispatch({ type: 'SET_PERSONA', payload: person })

      if (initialSession.ultimoApartmentId) {
        dispatch({
          type: 'SET_APARTAMENTO_ACTUAL',
          payload: {
            id: initialSession.ultimoApartmentId,
            torre: initialSession.ultimoApartmentTorre ?? '',
            numero: initialSession.ultimoApartmentNumero ?? '',
          },
        })
      }

      dispatch({ type: 'SET_LOADING', payload: false })
      return
    }

    // Try to restore from cookie
    const session = getParticipantSession()
    if (session) {
      const person: Person = {
        id: session.personaId,
        nombre: session.nombre,
        cedula: session.cedula,
        apartments: session.apartments as Apartment[],
      }
      dispatch({ type: 'SET_PERSONA', payload: person })

      if (session.ultimoApartmentId) {
        dispatch({
          type: 'SET_APARTAMENTO_ACTUAL',
          payload: {
            id: session.ultimoApartmentId,
            torre: session.ultimoApartmentTorre ?? '',
            numero: session.ultimoApartmentNumero ?? '',
          },
        })
      }
    }

    dispatch({ type: 'SET_LOADING', payload: false })
  }, [initialSession])

  // Persist to cookie whenever state changes
  useEffect(() => {
    if (state.isLoading) return

    if (state.person) {
      const session: ParticipantSession = {
        personaId: state.person.id,
        cedula: state.person.cedula,
        nombre: state.person.nombre,
        apartments: state.apartments.map((apt) => ({
          id: apt.id,
          numero: apt.numero,
          torre: apt.torre,
        })),
        ultimoApartmentId: state.apartmentActual?.id ?? null,
        ultimoApartmentTorre: state.apartmentActual?.torre ?? null,
        ultimoApartmentNumero: state.apartmentActual?.numero ?? null,
      }
      setParticipantSession(session)
    } else {
      clearParticipantSession()
    }
  }, [state.person, state.apartments, state.apartmentActual, state.isLoading])

  const setPersona = useCallback((person: Person) => {
    dispatch({ type: 'SET_PERSONA', payload: person })
  }, [])

  const setApartmentActual = useCallback((apartment: Apartment) => {
    dispatch({ type: 'SET_APARTAMENTO_ACTUAL', payload: apartment })
  }, [])

  const resetToApartmentSelection = useCallback(() => {
    dispatch({ type: 'RESET_TO_APARTMENT_SELECTION' })
  }, [])

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  return (
    <ParticipantContext.Provider
      value={{ state, setPersona, setApartmentActual, resetToApartmentSelection, clear }}
    >
      {children}
    </ParticipantContext.Provider>
  )
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useParticipant(): ParticipantContextValue {
  const context = useContext(ParticipantContext)
  if (!context) {
    throw new Error(
      'useParticipant must be used within a ParticipantProvider'
    )
  }
  return context
}
