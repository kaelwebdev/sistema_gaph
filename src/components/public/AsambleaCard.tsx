'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Asamblea {
  id: string
  titulo: string
  fecha: Date
  estado: string
}

interface AsambleaCardProps {
  asamblea: Asamblea
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

export function AsambleaCard({ asamblea, clienteId }: AsambleaCardProps) {
  const router = useRouter()

  const isAbierta = asamblea.estado === 'ABIERTA'

  const handleClick = () => {
    if (isAbierta) {
      const url = clienteId 
        ? `/votar/${asamblea.id}?clienteId=${clienteId}`
        : `/votar/${asamblea.id}`
      router.push(url)
    }
  }

  return (
    <Card className="w-full cursor-pointer transition-shadow hover:shadow-md" onClick={handleClick}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg font-semibold leading-tight">
            {asamblea.titulo}
          </CardTitle>
          <Badge
            variant={isAbierta ? 'default' : 'secondary'}
            className="shrink-0"
          >
            {asamblea.estado}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          {formatDate(asamblea.fecha)}
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
