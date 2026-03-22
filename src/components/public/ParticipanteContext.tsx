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
  getParticipanteSession,
  setParticipanteSession,
  clearParticipanteSession,
  ParticipanteSession,
  ApartamentoCookie,
} from '@/lib/participante-session'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Apartamento {
  id: string
  numero: string
  torre: string
}

export interface Persona {
  id: string
  nombre: string
  cedula: string
  apartamentos: Apartamento[]
}

export interface ParticipanteState {
  persona: Persona | null
  apartamentos: Apartamento[]
  apartamentoActual: Apartamento | null
  isIdentificado: boolean
  isLoading: boolean
}

type ParticipanteAction =
  | { type: 'SET_PERSONA'; payload: Persona }
  | { type: 'SET_APARTAMENTO_ACTUAL'; payload: Apartamento }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR' }
  | { type: 'RESET_TO_APARTMENT_SELECTION' } // keep persona, reset apartment

// ─── Reducer ─────────────────────────────────────────────────────────────────

const initialState: ParticipanteState = {
  persona: null,
  apartamentos: [],
  apartamentoActual: null,
  isIdentificado: false,
  isLoading: true,
}

function participanteReducer(
  state: ParticipanteState,
  action: ParticipanteAction
): ParticipanteState {
  switch (action.type) {
    case 'SET_PERSONA':
      return {
        ...state,
        persona: action.payload,
        apartamentos: action.payload.apartamentos,
        apartamentoActual: null,
        isIdentificado: false,
      }
    case 'SET_APARTAMENTO_ACTUAL':
      return {
        ...state,
        apartamentoActual: action.payload,
        isIdentificado: true,
      }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'CLEAR':
      return { ...initialState, isLoading: false }
    case 'RESET_TO_APARTMENT_SELECTION':
      return {
        ...state,
        apartamentoActual: null,
        isIdentificado: false,
      }
    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface ParticipanteContextValue {
  state: ParticipanteState
  setPersona: (persona: Persona) => void
  setApartamentoActual: (apartamento: Apartamento) => void
  resetToApartmentSelection: () => void
  clear: () => void
}

const ParticipanteContext = createContext<ParticipanteContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

interface ParticipanteProviderProps {
  children: ReactNode
  /** Pre-fill context from server-side session data (optional) */
  initialSession?: ParticipanteSession | null
}

export function ParticipanteProvider({
  children,
  initialSession,
}: ParticipanteProviderProps) {
  const [state, dispatch] = useReducer(participanteReducer, initialState)

  // Initialize from cookie on mount (only if no initialSession provided)
  useEffect(() => {
    if (initialSession) {
      // Server-side session available — hydrate context
      const persona: Persona = {
        id: initialSession.personaId,
        nombre: initialSession.nombre,
        cedula: initialSession.cedula,
        apartamentos: initialSession.apartamentos as Apartamento[],
      }
      dispatch({ type: 'SET_PERSONA', payload: persona })

      if (initialSession.ultimoApartamentoId) {
        dispatch({
          type: 'SET_APARTAMENTO_ACTUAL',
          payload: {
            id: initialSession.ultimoApartamentoId,
            torre: initialSession.ultimoApartamentoTorre ?? '',
            numero: initialSession.ultimoApartamentoNumero ?? '',
          },
        })
      }

      dispatch({ type: 'SET_LOADING', payload: false })
      return
    }

    // Try to restore from cookie
    const session = getParticipanteSession()
    if (session) {
      const persona: Persona = {
        id: session.personaId,
        nombre: session.nombre,
        cedula: session.cedula,
        apartamentos: session.apartamentos as Apartamento[],
      }
      dispatch({ type: 'SET_PERSONA', payload: persona })

      if (session.ultimoApartamentoId) {
        dispatch({
          type: 'SET_APARTAMENTO_ACTUAL',
          payload: {
            id: session.ultimoApartamentoId,
            torre: session.ultimoApartamentoTorre ?? '',
            numero: session.ultimoApartamentoNumero ?? '',
          },
        })
      }
    }

    dispatch({ type: 'SET_LOADING', payload: false })
  }, [initialSession])

  // Persist to cookie whenever state changes
  useEffect(() => {
    if (state.isLoading) return

    if (state.persona) {
      const session: ParticipanteSession = {
        personaId: state.persona.id,
        cedula: state.persona.cedula,
        nombre: state.persona.nombre,
        apartamentos: state.apartamentos.map((apt) => ({
          id: apt.id,
          numero: apt.numero,
          torre: apt.torre,
        })),
        ultimoApartamentoId: state.apartamentoActual?.id ?? null,
        ultimoApartamentoTorre: state.apartamentoActual?.torre ?? null,
        ultimoApartamentoNumero: state.apartamentoActual?.numero ?? null,
      }
      setParticipanteSession(session)
    } else {
      clearParticipanteSession()
    }
  }, [state.persona, state.apartamentos, state.apartamentoActual, state.isLoading])

  const setPersona = useCallback((persona: Persona) => {
    dispatch({ type: 'SET_PERSONA', payload: persona })
  }, [])

  const setApartamentoActual = useCallback((apartamento: Apartamento) => {
    dispatch({ type: 'SET_APARTAMENTO_ACTUAL', payload: apartamento })
  }, [])

  const resetToApartmentSelection = useCallback(() => {
    dispatch({ type: 'RESET_TO_APARTMENT_SELECTION' })
  }, [])

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  return (
    <ParticipanteContext.Provider
      value={{ state, setPersona, setApartamentoActual, resetToApartmentSelection, clear }}
    >
      {children}
    </ParticipanteContext.Provider>
  )
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useParticipante(): ParticipanteContextValue {
  const context = useContext(ParticipanteContext)
  if (!context) {
    throw new Error(
      'useParticipante must be used within a ParticipanteProvider'
    )
  }
  return context
}
