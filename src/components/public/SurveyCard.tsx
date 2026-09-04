'use client'

import { useEffect, useState } from 'react'
import { emitVote, getSurveyResults, getParticipationData } from '@/lib/actions/public'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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

interface Resultado {
  id: string
  texto: string
  orden: number
  votes: number
  porcentaje: number
}

type ResultadosData = {
  resultados: Resultado[]
  totalVotes: number
} | null

interface ParticipationData {
  totalParticipants: number,
  totalVotes: number,
  totalPorcentajeParticipacion: number
}

interface EncuestaCardProps {
  encuesta: Survey
  apartmentId: string
  onVoted?: () => void
  hasVoted: () => boolean
}

export function EncuestaCard({ encuesta, apartmentId, onVoted, hasVoted }: EncuestaCardProps) {
  const [selectedOpcionId, setSelectedOpcionId] = useState<string>('')
  const [hasVotedNow, setHasVotedNow] = useState(hasVoted())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [participationData, setParticipationData] = useState<ParticipationData | null>(null)
  const [totalVotes, setTotalVotes] = useState(0)

  const isBinaria = encuesta.tipo === 'BINARIA'
  
  const handleVotar = async () => {
    
    if (!selectedOpcionId) {
      setError('Por favor selecciona una opción')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const result = await emitVote(encuesta.id, apartmentId, encuesta.id, selectedOpcionId)
      
      if (!result.success) {
        setError(result.error || 'Error al registrar el vote')
        return
      }

      // Load results after successful vote
      const resultadosData = await getSurveyResults(encuesta.id)
      setResultados(resultadosData?.resultados || [])
      setTotalVotes(resultadosData?.totalVotes || 0)
      setHasVotedNow(true)
      onVoted?.()

    } catch (err) {
      console.error('Error submitting vote:', err)
      setError('Error al registrar el vote. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerEncuestas = async () => {
    setError('')

    try {
      
      // See results
      const resultadosData = await getSurveyResults(encuesta.id)
      setResultados(resultadosData?.resultados || [])
      setTotalVotes(resultadosData?.totalVotes || 0)

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
        <div className="flex flex-wrap items-start justify-between gap-4">
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
              {encuesta.surveyOptions.map((surveyOption) => (
                <label 
                  key={surveyOption.id} 
                  className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <input
                    type="radio"
                    name={`encuesta-${encuesta.id}`}
                    value={surveyOption.id}
                    checked={selectedOpcionId === surveyOption.id}
                    onChange={() => setSelectedOpcionId(surveyOption.id)}
                    className="h-4 w-4 text-primary"
                  />
                  <span className="text-sm">{surveyOption.texto}</span>
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
                        {resultado.votes} vote{resultado.votes !== 1 ? 's' : ''}
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
                ({participationData.totalVotes}/{participationData.totalParticipants}) 
                 {participationData.totalPorcentajeParticipacion}% de participants han votado
              </p>
            </div>
          )}
          
          </>
        ) : (
          <>
          {/* Results after voting */}
         
          <div className="space-y-3">
            <p className="text-sm font-medium text-green-600">✓ Vote registrado</p>
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
                      {resultado.votes} vote{resultado.votes !== 1 ? 's' : ''}
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
                    ({participationData.totalVotes}/{participationData.totalParticipants}) 
                    {participationData.totalPorcentajeParticipacion}% de participants han votado
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
