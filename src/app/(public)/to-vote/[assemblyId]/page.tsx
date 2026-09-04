'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { getActiveSurveys, getAssembly } from '@/lib/actions/public'
import { IdentificacionPanel } from '@/components/public/IdentificacionPanel'
import { EncuestaCard } from '@/components/public/SurveyCard'
import {
  ParticipantProvider,
  useParticipant,
  type Apartment,
  type Person,
} from '@/components/public/ParticipantContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SurveyOption {
  id: string
  texto: string
  orden: number
}

interface Survey {
  id: string
  pregunta: string
  tipo: 'BINARIA' | 'MULTIPLE'
  surveyOptions: SurveyOption[]
}

interface Assemblie {
  id: string
  titulo: string
  clienteId: string
  estado: string
}

// ─── Inner Voting Content ─────────────────────────────────────────────────────

function VotingContent({
  clienteId,
  assemblyId,
}: {
  clienteId: string
  assemblyId: string
}) {
  const router = useRouter()
  const {
    state,
    setPersona,
    setApartmentActual,
    resetToApartmentSelection,
    clear,
  } = useParticipant()

  const [encuestas, setEncuestas] = useState<Survey[]>([])
  const [isLoadingEncuestas, setIsLoadingEncuestas] = useState(true)
  const [votesCompletados, setVotesCompletados] = useState<Set<string>>(new Set())

  // Load encuestas on mount
  useEffect(() => {
    async function loadEncuestas() {
      try {
        const data = await getActiveSurveys(assemblyId)
        console.log([...votesCompletados])
        setEncuestas(data)
      } catch (error) {
        console.error('Error loading encuestas:', error)
      } finally {
        setIsLoadingEncuestas(false)
      }
    }

    loadEncuestas()
  }, [assemblyId])

  const handleIdentified = (
    identifiedPersona: Person,
    apartment: Apartment
  ) => {
    setPersona(identifiedPersona)
    setApartmentActual(apartment)
  }

  const handleVoted = (encuestaId: string) => {
    const internalId = state.apartmentActual!.torre + '-' + state.apartmentActual!.numero + '-' + encuestaId;
    
    // Mark this encuesta as completed for the current participant
    setVotesCompletados((prev) => new Set([...prev, internalId]))
    
  }

  // to know if the participant has already voted in a specific survey
  const hasVotedInEncuesta = (encuestaId: string) => {
    const internalId = state.apartmentActual!.torre + '-' + state.apartmentActual!.numero + '-' + encuestaId;
    
    return votesCompletados.has(internalId)
  }

  const handleCambiarApartment = () => {
    resetToApartmentSelection()
    //setVotesCompletados(new Set())
  }

  const handleChangeIdentification = () => {
    clear()
    setVotesCompletados(new Set())
  }

  const handleVolver = () => {
    router.push(`/condominium/${clienteId}`)
  }

  // Show loading while restoring from cookie
  if (state.isLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Restaurando sesión...</p>
        </div>
      </div>
    )
  }

  // Case 1: Identified and voting
  if (state.isIdentificado) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Header with participant info */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Votación</h1>
            <p className="text-sm text-muted-foreground">
              Votando como: Torre {state.apartmentActual!.torre}, Apto{' '}
              {state.apartmentActual!.numero}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCambiarApartment}
            >
              Cambiar apartment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleChangeIdentification}
            >
              Cambiar identificación
            </Button>
            <Button variant="ghost" size="sm" onClick={handleVolver}>
              ← Volver
            </Button>
          </div>
        </div>

        {/* Encuestas List */}
        {isLoadingEncuestas ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Cargando encuestas...</p>
          </div>
        ) : encuestas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No hay encuestas disponibles para esta assemblie.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div>
            <h2 className="mb-4 text-lg font-semibold">
              Encuestas ({encuestas.length})
            </h2>
            {encuestas.map((encuesta) => (
              <EncuestaCard
                key={encuesta.id}
                encuesta={encuesta}
                apartmentId={state.apartmentActual!.id}
                onVoted={() => handleVoted(encuesta.id)}
                hasVoted={() => hasVotedInEncuesta(encuesta.id)}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Case 2: Person identified (from cookie) but no apartment selected yet
  if (state.person && state.apartments.length > 0) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Votación</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleChangeIdentification}
            >
              Cambiar identificación
            </Button>
            <Button variant="ghost" size="sm" onClick={handleVolver}>
              ← Volver
            </Button>
          </div>
        </div>

        {/* Welcome back + apartment selection */}
        <Card className="mb-6">
          <CardContent className="py-6 space-y-4">
            <div>
              <p className="text-sm font-medium">Bienvenido de nuevo</p>
              <p className="text-lg font-semibold">{state.person.nombre}</p>
              <p className="text-sm text-muted-foreground">
                Cédula: {state.person.cedula}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium block">
                Selecciona tu apartment:
              </label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    const apt = state.apartments.find(
                      (a) => a.id === e.target.value
                    )
                    if (apt) {
                      setApartmentActual(apt)
                    }
                  }
                }}
              >
                <option value="">-- Selecciona un apartment --</option>
                {state.apartments.map((apt) => (
                  <option key={apt.id} value={apt.id}>
                    Torre {apt.torre} — Apto {apt.numero}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Encuestas count */}
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            {isLoadingEncuestas ? (
              <p>Cargando encuestas...</p>
            ) : (
              <p>
                {encuestas.length} encuesta{encuestas.length !== 1 ? 's' : ''}{' '}
                disponible{encuestas.length !== 1 ? 's' : ''}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Case 3: Not identified at all — show full IdentificacionPanel
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Votación</h1>
        <Button variant="ghost" size="sm" onClick={handleVolver}>
          ← Volver
        </Button>
      </div>

      <IdentificacionPanel
        clienteId={clienteId}
        onIdentified={handleIdentified}
      />

      {/* Encuestas count when not identified */}
      <Card>
        <CardContent className="py-6 text-center text-muted-foreground">
          {isLoadingEncuestas ? (
            <p>Cargando encuestas...</p>
          ) : (
            <p>
              {encuestas.length} encuesta{encuestas.length !== 1 ? 's' : ''}{' '}
              disponible{encuestas.length !== 1 ? 's' : ''}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function VotarPage({
  params,
  searchParams,
}: {
  params: Promise<{ assemblyId: string }>
  searchParams: Promise<{ clienteId?: string }>
}) {
  const [assemblyId, setAssemblyId] = useState<string | null>(null)
  const [clienteId, setClienteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params
      const resolvedSearch = await searchParams

      setAssemblyId(resolvedParams.assemblyId)

      // If clienteId provided in URL, use it
      if (resolvedSearch.clienteId) {
        setClienteId(resolvedSearch.clienteId)
        setLoading(false)
        return
      }

      // Otherwise, fetch the assembly to get its clienteId
      try {
        const assembly = await getAssembly(resolvedParams.assemblyId)
        if (assembly) {
          setClienteId(assembly.clienteId)
        }
      } catch (error) {
        console.error('Error fetching assembly:', error)
      }

      setLoading(false)
    }

    resolveParams()
  }, [params, searchParams])

  if (loading || !assemblyId || !clienteId) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <ParticipantProvider>
      <VotingContent clienteId={clienteId} assemblyId={assemblyId} />
    </ParticipantProvider>
  )
}
