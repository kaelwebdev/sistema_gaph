'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getAsambleasAbiertas } from '@/lib/actions/public'
import { AsambleaCard } from '@/components/public/AsambleaCard'
import { Card, CardContent } from '@/components/ui/card'

interface Asamblea {
  id: string
  titulo: string
  fecha: Date
  estado: string
}

export default function UnidadPage() {
  const params = useParams()
  const router = useRouter()
  const clienteId = params.clienteId as string

  const [asambleas, setAsambleas] = useState<Asamblea[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadAsambleas() {
      try {
        const data = await getAsambleasAbiertas(clienteId)
        setAsambleas(data)
      } catch (error) {
        console.error('Error loading assemblies:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAsambleas()
  }, [clienteId])

  const handleVolver = () => {
    router.push('/')
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Asambleas Disponibles</h1>
        <button
          onClick={handleVolver}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Volver
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Cargando asambleas...</p>
        </div>
      ) : asambleas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No hay asambleas abiertas en este momento.
            </p>
            <button
              onClick={handleVolver}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              Volver al inicio
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {asambleas.map((asamblea) => (
            <AsambleaCard
              key={asamblea.id}
              asamblea={asamblea}
              clienteId={clienteId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
