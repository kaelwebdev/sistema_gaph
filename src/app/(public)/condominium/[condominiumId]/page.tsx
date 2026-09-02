'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getOpenAssemblies } from '@/lib/actions/public'
import { AssemblyCard } from '@/components/public/AssemblyCard'
import { Card, CardContent } from '@/components/ui/card'

interface Assembly {
  id: string
  titulo: string
  fecha: Date
  estado: string
}

export default function UnidadPage() {
  const params = useParams()
  const router = useRouter()
  const clienteId = params.clienteId as string

  const [assemblies, setAssemblies] = useState<Assembly[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadAssemblies() {
      try {
        console.log('Loading assemblies for clienteId:', clienteId)
        const data = await getOpenAssemblies(clienteId)
        console.log('Assemblies loaded:', data)
        setAssemblies(data)
      } catch (error) {
        console.error('Error loading assemblies:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAssemblies()
  }, [clienteId])

  const handleVolver = () => {
    router.push('/')
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Assemblies Disponibles</h1>
        <button
          onClick={handleVolver}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Volver
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Cargando assemblies...</p>
        </div>
      ) : assemblies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No hay assemblies abiertas en este momento.
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
          {assemblies.map((assembly) => (
            <AssemblyCard
              key={assembly.id}
              assembly={assembly}
              clienteId={clienteId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
