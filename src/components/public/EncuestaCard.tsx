'use client'

import { useEffect, useState } from 'react'
import { emitVote, getResultadosEncuesta, getParticipationData } from '@/lib/actions/public'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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

interface Resultado {
  id: string
  texto: string
  orden: number
  votos: number
  porcentaje: number
}

interface ParticipationData {
  totalParticipantes: number,
  totalVotos: number,
  totalPorcentajeParticipacion: number
}

interface EncuestaCardProps {
  encuesta: Encuesta
  apartamentoId: string
  onVoted?: () => void
  hasVoted: () => boolean
}

export function EncuestaCard({ encuesta, apartamentoId, onVoted, hasVoted }: EncuestaCardProps) {
  const [selectedOpcionId, setSelectedOpcionId] = useState<string>('')
  const [hasVotedNow, setHasVotedNow] = useState(hasVoted())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [participationData, setParticipationData] = useState<ParticipationData | null>(null)

  const isBinaria = encuesta.tipo === 'BINARIA'
  
  const handleVotar = async () => {
    
    if (!selectedOpcionId) {
      setError('Por favor selecciona una opción')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const result = await emitVote(encuesta.id, apartamentoId, encuesta.id, selectedOpcionId)
      
      if (!result.success) {
        setError(result.error || 'Error al registrar el voto')
        return
      }

      // Load results after successful vote
      const resultadosData = await getResultadosEncuesta(encuesta.id)
      setResultados(resultadosData)
      setHasVotedNow(true)
      onVoted?.()

    } catch (err) {
      console.error('Error submitting vote:', err)
      setError('Error al registrar el voto. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerEncuestas = async () => {
    setError('')

    try {
      
      // See results
      const resultadosData = await getResultadosEncuesta(encuesta.id)
      setResultados(resultadosData)

      const participationData = await getParticipationData(encuesta.id)
      setParticipationData(participationData)
    } catch (err) {
      console.error('Error when loading results:', err)
      setError('Error when loading results. Try again.')
    } finally {
      
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-base font-semibold leading-tight">
            {encuesta.pregunta}
          </CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {isBinaria ? 'Binario' : 'Múltiple'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Options */}
        {hasVotedNow === false ? (
          <>
            <div className="space-y-3">
              {encuesta.opciones.map((opcion) => (
                <label 
                  key={opcion.id} 
                  className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <input
                    type="radio"
                    name={`encuesta-${encuesta.id}`}
                    value={opcion.id}
                    checked={selectedOpcionId === opcion.id}
                    onChange={() => setSelectedOpcionId(opcion.id)}
                    className="h-4 w-4 text-primary"
                  />
                  <span className="text-sm">{opcion.texto}</span>
                </label>
              ))}
            </div>

            {/* Error message */}
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {/* Vote button */}
            <Button 
              className="w-full" 
              onClick={handleVotar}
              disabled={!selectedOpcionId || isSubmitting}
            >
              {isSubmitting ? 'Registrando...' : 'Votar'}
            </Button>
            {(
              <Button 
                className="w-full" 
                onClick={handleVerEncuestas}
              >
                Ver resultados / refrescar
              </Button>
            )}
            <div className="space-y-3">
            
              {resultados.length > 0 && (
                <div className="space-y-2">
                  {resultados.map((resultado) => (
                    <div key={resultado.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{resultado.texto}</span>
                        <span className="text-muted-foreground">
                          {resultado.porcentaje}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{ width: `${resultado.porcentaje}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {resultado.votos} voto{resultado.votos !== 1 ? 's' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
          </div>
          {resultados.length > 0 && participationData && (
            <div className="space-y-3">
              <p className={`text-md font-medium ${
                participationData.totalPorcentajeParticipacion > 50 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                ({participationData.totalVotos}/{participationData.totalParticipantes}) 
                 {participationData.totalPorcentajeParticipacion}% de participantes han votado
              </p>
            </div>
          )}
          
          </>
        ) : (
          <>
          {/* Results after voting */}
         
          <div className="space-y-3">
            <p className="text-sm font-medium text-green-600">✓ Voto registrado</p>
             {(
              <Button 
                className="w-full" 
                onClick={handleVerEncuestas}
              >
                Ver resultados / refrescar
              </Button>
            )}
            {resultados.length > 0 ? (
              <div className="space-y-2">
                {resultados.map((resultado) => (
                  <div key={resultado.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{resultado.texto}</span>
                      <span className="text-muted-foreground">
                        {resultado.porcentaje}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${resultado.porcentaje}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {resultado.votos} voto{resultado.votos !== 1 ? 's' : ''}
                    </p>
                  </div>
                ))}
                {participationData && (
                <div className="space-y-3">
                  <p className={`text-md font-medium ${
                    participationData.totalPorcentajeParticipacion > 50 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    ({participationData.totalVotos}/{participationData.totalParticipantes}) 
                    {participationData.totalPorcentajeParticipacion}% de participantes han votado
                  </p>
                </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                ...
              </p>
            )}
          </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
