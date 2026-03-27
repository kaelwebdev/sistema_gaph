'use client'

import { useVotosRealtime } from '@/hooks/useVotosRealtime'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, RefreshCw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ResultadoOpcion = {
  id: string
  texto: string
  votos: number
  porcentaje: number
}

type ResultadosData = {
  resultados: ResultadoOpcion[]
  totalVotos: number
} | null

interface EncuestaConResultados {
  id: string
  pregunta: string
  tipo: string
  resultados: ResultadosData
}

interface ResultadosEnVivoProps {
  encuestaId: string
  pregunta: string
  tipo: string
}

export function ResultadosEnVivo({ encuestaId, pregunta, tipo }: ResultadosEnVivoProps) {
  const { resultados, isLoading, error, refetch } = useVotosRealtime(encuestaId)

  if (isLoading) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {pregunta}
          </CardTitle>
          <Badge variant="outline">{tipo}</Badge>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {pregunta}
          </CardTitle>
          <Badge variant="outline">{tipo}</Badge>
        </CardHeader>
        <CardContent className="text-center py-10 text-red-500">
          {error}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {pregunta}
          </CardTitle>
          <Badge variant="outline">{tipo}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Render resultados as bars */}
        {resultados?.resultados ? (
          resultados.resultados.map((opcion) => (
            <div key={opcion.id} className="mb-3">
              <div className="flex justify-between mb-1">
                <span>{opcion.texto}</span>
                <span className="text-sm font-medium">
                  {opcion.votos} votos ({opcion.porcentaje.toFixed(1)}%)
                </span>
              </div>
              <div className="h-3 w-full bg-muted rounded-full">
                <div 
                  className="h-3 bg-primary rounded-full transition-all duration-300" 
                  style={{ width: `${opcion.porcentaje}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No hay opciones disponibles.</p>
        )}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <p className="text-sm text-muted">
            Total: {resultados?.totalVotos || 0} votos
          </p>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={refetch}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Actualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
