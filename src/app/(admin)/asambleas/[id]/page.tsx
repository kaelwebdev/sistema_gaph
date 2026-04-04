import { getAsamblea } from '@/lib/actions/asambleas'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BarChart3 } from 'lucide-react'
import { ParticipantesSection } from './participantes-section'
import { EncuestasSection } from './encuestas-section'
import { TabsClient } from './tabs-client'

const estadoColors: Record<string, string> = {
  ABIERTA: 'bg-green-100 text-green-800',
  CERRADA: 'bg-gray-100 text-gray-800',
}

export default async function AsambleaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getAsamblea(id)
  
  if (!data) {
    notFound()
  }

  return (
    <div className="space-y-6">
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
        <div className="flex items-center gap-3">
          <Link href={`/asambleas/${id}/resultados`}>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Resultados
            </Button>
          </Link>
          <Badge className={estadoColors[data.estado]}>{data.estado}</Badge>
        </div>
      </div>

      <TabsClient 
        defaultTab="participantes"
        tabs={[
          {
            id: 'participantes',
            label: 'Participantes',
            content: (
              <ParticipantesSection
                asambleaId={id}
                participantes={data.participantes}
              />
            )
          },
          {
            id: 'encuestas',
            label: 'Encuestas',
            content: (
              <EncuestasSection
                asambleaId={id}
                encuestas={data.encuestas}
              />
            )
          }
        ]}
      />
    </div>
  )
}