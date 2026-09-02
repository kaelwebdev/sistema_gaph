import { getAssembly } from '@/lib/actions/assemblies'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BarChart3 } from 'lucide-react'
import { ParticipantsSection } from './participants-section'
import { EncuestasSection } from './survey-section'
import { TabsClient } from './tabs-client'

const statusColors: Record<string, string> = {
  ABIERTA: 'bg-green-100 text-green-800',
  CERRADA: 'bg-gray-100 text-gray-800',
}

export default async function AssemblieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getAssembly(id)
  
  if (!data) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{data.title}</h1>
          <p className="text-gray-500">
            {new Date(data.date).toLocaleDateString('es-CO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/assemblies/${id}/resultados`}>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Resultados
            </Button>
          </Link>
          <Badge className={statusColors[data.status]}>{data.status}</Badge>
        </div>
      </div>

      <TabsClient 
        defaultTab="participants"
        tabs={[
          {
            id: 'participants',
            label: 'Participants',
            content: (
              <ParticipantsSection
                assemblyId={id}
                participants={data.participants}
              />
            )
          },
          {
            id: 'encuestas',
            label: 'Encuestas',
            content: (
              <EncuestasSection
                assemblyId={id}
                encuestas={data.surveys}
              />
            )
          }
        ]}
      />
    </div>
  )
}
