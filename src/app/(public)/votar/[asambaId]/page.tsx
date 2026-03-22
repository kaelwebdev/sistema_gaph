'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { getEncuestasActivas, getAsamblea } from '@/lib/actions/public'
import { IdentificacionPanel } from '@/components/public/IdentificacionPanel'
import { EncuestaCard } from '@/components/public/EncuestaCard'
import {
  ParticipanteProvider,
  useParticipante,
  type Apartamento,
  type Persona,
} from '@/components/public/ParticipanteContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Opcion {
  id: string
  texto: string
  orden: number
}

interface Encuesta {
  id: string
  pregunta: string
  tipo: 'BINARIA' | 'MULTIPLE'
  opciones: Opcion[]
}

interface Asamblea {
  id: string
  titulo: string
  clienteId: string
  estado: string
}

// ─── Inner Voting Content ─────────────────────────────────────────────────────

function VotingContent({
  clienteId,
  asambleaId,
}: {
  clienteId: string
  asambleaId: string
}) {
  const router = useRouter()
  const {
    state,
    setPersona,
    setApartamentoActual,
    resetToApartmentSelection,
  } = useParticipante()

  const [encuestas, setEncuestas] = useState<Encuesta[]>([])
  const [isLoadingEncuestas, setIsLoadingEncuestas] = useState(true)
  const [votosCompletados, setVotosCompletados] = useState<Set<string>>(new Set())

  // Load encuestas on mount
  useEffect(() => {
    async function loadEncuestas() {
      try {
        const data = await getEncuestasActivas(asambleaId)
        setEncuestas(data)
      } catch (error) {
        console.error('Error loading encuestas:', error)
      } finally {
        setIsLoadingEncuestas(false)
      }
    }

    loadEncuestas()
  }, [asambleaId])

  const handleIdentified = (
    identifiedPersona: Persona,
    apartamento: Apartamento
  ) => {
    setPersona(identifiedPersona)
    setApartamentoActual(apartamento)
  }

  const handleVoted = (encuestaId: string) => {
    setVotosCompletados((prev) => new Set([...prev, encuestaId]))
  }

  const handleCambiarApartamento = () => {
    resetToApartmentSelection()
    setVotosCompletados(new Set())
  }

  const handleVolver = () => {
    router.push(`/unidad/${clienteId}`)
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
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Votación</h1>
            <p className="text-sm text-muted-foreground">
              Votando como: Torre {state.apartamentoActual!.torre}, Apto{' '}
              {state.apartamentoActual!.numero}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCambiarApartamento}
            >
              Cambiar apartamento
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
                No hay encuestas disponibles para esta asamblea.
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
                apartamentoId={state.apartamentoActual!.id}
                onVoted={() => handleVoted(encuesta.id)}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Case 2: Persona identified (from cookie) but no apartment selected yet
  if (state.persona && state.apartamentos.length > 0) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Votación</h1>
          <Button variant="ghost" size="sm" onClick={handleVolver}>
            ← Volver
          </Button>
        </div>

        {/* Welcome back + apartment selection */}
        <Card className="mb-6">
          <CardContent className="py-6 space-y-4">
            <div>
              <p className="text-sm font-medium">Bienvenido de nuevo</p>
              <p className="text-lg font-semibold">{state.persona.nombre}</p>
              <p className="text-sm text-muted-foreground">
                Cédula: {state.persona.cedula}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium block">
                Selecciona tu apartamento:
              </label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    const apt = state.apartamentos.find(
                      (a) => a.id === e.target.value
                    )
                    if (apt) {
                      setApartamentoActual(apt)
                    }
                  }
                }}
              >
                <option value="">-- Selecciona un apartamento --</option>
                {state.apartamentos.map((apt) => (
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
  params: Promise<{ asambaId: string }>
  searchParams: Promise<{ clienteId?: string }>
}) {
  const [asambaId, setAsambaId] = useState<string | null>(null)
  const [clienteId, setClienteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params
      const resolvedSearch = await searchParams

      setAsambaId(resolvedParams.asambaId)

      // If clienteId provided in URL, use it
      if (resolvedSearch.clienteId) {
        setClienteId(resolvedSearch.clienteId)
        setLoading(false)
        return
      }

      // Otherwise, fetch the assembly to get its clienteId
      try {
        const asamblea = await getAsamblea(resolvedParams.asambaId)
        if (asamblea) {
          setClienteId(asamblea.clienteId)
        }
      } catch (error) {
        console.error('Error fetching assembly:', error)
      }

      setLoading(false)
    }

    resolveParams()
  }, [params, searchParams])

  if (loading || !asambaId || !clienteId) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <ParticipanteProvider>
      <VotingContent clienteId={clienteId} asambleaId={asambaId} />
    </ParticipanteProvider>
  )
}
