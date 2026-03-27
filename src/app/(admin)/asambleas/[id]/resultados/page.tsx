import { getEncuestasPorAsamblea } from '@/lib/actions/encuestas'
import { ResultadosEnVivo } from '@/components/admin/ResultadosEnVivo'
import { Card, CardContent } from '@/components/ui/card'

export default async function ResultadosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Fetch encuestas
  const encuestas = await getEncuestasPorAsamblea(id)
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Resultados de Asamblea</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          En vivo
        </div>
      </div>
      
      {encuestas.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No hay encuestas disponibles para esta asamblea.
          </CardContent>
        </Card>
      ) : (
        /* Render each encuesta with realtime */
        encuestas.map((encuesta) => (
          <ResultadosEnVivo
            key={encuesta.id}
            encuestaId={encuesta.id}
            pregunta={encuesta.pregunta}
            tipo={encuesta.tipo}
          />
        ))
      )}
    </div>
  )
}
