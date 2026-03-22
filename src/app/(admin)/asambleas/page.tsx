'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, Calendar, BarChart3 } from 'lucide-react'
import { getAsambleas } from '@/lib/actions'

interface Asamblea {
  id: string
  titulo: string
  fecha: Date
  estado: 'ABIERTA' | 'CERRADA'
}

const estadoColors: Record<string, string> = {
  ABIERTA: 'bg-green-100 text-green-800',
  CERRADA: 'bg-gray-100 text-gray-800',
}

export default function AsambleasPage() {
  const [asambleas, setAsambleas] = useState<Asamblea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAsambleas() {
      try {
        setIsLoading(true)
        
        // Obtener la sesión del cliente
        const sessionRes = await fetch('/api/auth/session')
        const session = await sessionRes.json()
        console.log('Sesión:', session)
        
        // Usar el clienteId de la sesión, o fallback a cliente_default_001
        const clienteId = session?.user?.clienteId || 'cliente_default_001'
        console.log('ClienteId usado:', clienteId)
        
        const data = await getAsambleas(clienteId)
        console.log('Datos recibidos:', data)
        setAsambleas(data)
      } catch (err) {
        console.error('Error cargando:', err)
        setError('Error al cargar las asambleas')
      } finally {
        setIsLoading(false)
      }
    }

    loadAsambleas()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Asambleas</h1>
        <Link href="/asambleas/nueva">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Asamblea
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {asambleas.map((asamblea) => (
          <Card key={asamblea.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <Badge className={estadoColors[asamblea.estado]}>
                  {asamblea.estado}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold mb-2">{asamblea.titulo}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Calendar className="h-4 w-4" />
                {new Date(asamblea.fecha).toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="flex gap-2">
                <Link href={`/asambleas/${asamblea.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Gestionar
                  </Button>
                </Link>
                <Link href={`/asambleas/${asamblea.id}/resultados`}>
                  <Button variant="ghost" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {asambleas.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No hay asambleas registradas
          </div>
        )}
      </div>
    </div>
  )
}
