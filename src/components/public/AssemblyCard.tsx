'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Assembly {
  id: string
  titulo: string
  fecha: Date
  estado: string
}

interface AssemblyCardProps {
  assembly: Assembly
  clienteId?: string
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function AssemblyCard({ assembly, clienteId }: AssemblyCardProps) {
  const router = useRouter()

  const isAbierta = assembly.estado === 'ABIERTA'

  const handleClick = () => {
    if (isAbierta) {
      const url = clienteId 
        ? `/to-vote/${assembly.id}?clienteId=${clienteId}`
        : `/to-vote/${assembly.id}`
      router.push(url)
    }
  }

  return (
    <Card className="w-full cursor-pointer transition-shadow hover:shadow-md" onClick={handleClick}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg font-semibold leading-tight">
            {assembly.titulo}
          </CardTitle>
          <Badge
            variant={isAbierta ? 'default' : 'secondary'}
            className="shrink-0"
          >
            {assembly.estado}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          {formatDate(assembly.fecha)}
        </p>
        {isAbierta && (
          <Button size="sm" className="w-full">
            Participar
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
