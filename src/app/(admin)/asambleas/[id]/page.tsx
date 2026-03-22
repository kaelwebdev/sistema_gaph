import { getAsamblea, updateAsamblea } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { redirect, notFound } from 'next/navigation'
import { ParticipantesSection } from './participantes-section'
import { EncuestasSection } from './encuestas-section'

const estadoColors: Record<string, string> = {
  ABIERTA: 'bg-green-100 text-green-800',
  CERRADA: 'bg-gray-100 text-gray-800',
}

export default async function AssemblyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getAsamblea(id)
  console.log('Data de asamblea:', id);
  if (!data) {
    notFound()
  }

  async function handleStatusChange(estado: 'ABIERTA' | 'CERRADA') {
    'use server'
    await updateAsamblea(id, { estado })
    redirect(`/asambleas/${id}`)
  }

  return (
    <div className="space-y-6">
      <h1>hola</h1>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{data.titulo}</h1>
          <p className="text-gray-500">
            {new Date(data.fecha).toLocaleDateString('es-CO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <Badge className={estadoColors[data.estado]}>{data.estado}</Badge>
      </div>

      <Tabs value="participantes">
        <TabsList>
          <TabsTrigger value="participantes">Participantes</TabsTrigger>
          <TabsTrigger value="encuestas">Encuestas</TabsTrigger>
        </TabsList>

        <TabsContent value="participantes">
          <ParticipantesSection
            asambleaId={id}
            participantes={data.participantes}
          />
        </TabsContent>

        <TabsContent value="encuestas">
          <EncuestasSection
            asambleaId={id}
            encuestas={data.encuestas}
          />
        </TabsContent>
      </Tabs>

      {data.estado === 'ABIERTA' && (
        <div className="flex gap-4">
          <form action={handleStatusChange.bind(null, 'CERRADA')}>
            <Button variant="destructive" type="submit">
              Cerrar Asamblea
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}