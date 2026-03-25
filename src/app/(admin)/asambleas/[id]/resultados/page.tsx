import { getEncuestasPorAsamblea } from '@/lib/actions/encuestas'
import { getEncuestaResultados } from '@/lib/actions/votos'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarChart3, RefreshCw } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function ResultadosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Fetch encuestas
  const encuestas = await getEncuestasPorAsamblea(id)
  
  // Fetch results for each encuesta
  const encuestasConResultados = await Promise.all(
    encuestas.map(async (encuesta) => {
      const resultados = await getEncuestaResultados(encuesta.id)
      return { ...encuesta, resultados }
    })
  )

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Resultados de Asamblea</h1>
        {/* Refresh button - uses form action to revalidate */}
        <form action={async () => {
          'use server'
          revalidatePath(`/asambleas/${id}/resultados`)
        }}>
          <Button type="submit" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refrescar
          </Button>
        </form>
      </div>
      
      {encuestasConResultados.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No hay encuestas disponibles para esta asamblea.
          </CardContent>
        </Card>
      ) : (
        /* List each encuesta with its results */
        encuestasConResultados.map((encuesta) => (
          <Card key={encuesta.id} className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {encuesta.pregunta}
              </CardTitle>
              <Badge variant="outline">{encuesta.tipo}</Badge>
            </CardHeader>
            <CardContent>
              {/* Render resultados as bars */}
              {encuesta.resultados && (encuesta.resultados as any).resultados ? (
                (encuesta.resultados as any).resultados.map((opcion: { id: string; texto: string; votos: number; porcentaje: number }) => (
                  <div key={opcion.id} className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span>{opcion.texto}</span>
                      <span>{opcion.votos} votos ({opcion.porcentaje.toFixed(1)}%)</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full">
                      <div 
                        className="h-3 bg-primary rounded-full" 
                        style={{ width: `${opcion.porcentaje}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No hay opciones disponibles.</p>
              )}
              <p className="text-sm text-muted mt-4">
                Total: {(encuesta.resultados as any)?.totalVotos || 0} votos
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
